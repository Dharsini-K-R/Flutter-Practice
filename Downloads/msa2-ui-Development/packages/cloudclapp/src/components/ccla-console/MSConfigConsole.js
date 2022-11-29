import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  Grid,
  CircularProgress,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import classNames from "classnames";

import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@material-ui/icons";

import useApi from "cloudclapp/src/hooks/useApi";
import MSConfigTable from "cloudclapp/src/components/ccla-console/MSConfigTable";

import { getDeploymentSetting } from "msa2-ui/src/api/deploymentSettings";
import Repository from "msa2-ui/src/services/Repository";
import { listOrderStack } from "msa2-ui/src/api/orderStack";
import AlertBar from "msa2-ui/src/components/AlertBar";
import FilterMenu from "msa2-ui/src/components/FilterMenu";
import TreeItem from "msa2-ui/src/components/TreeItem";
import TreeView from "msa2-ui/src/components/TreeView";
import { filter } from "msa2-ui/src/utils/filter";
import {
  TreeFolderComponent,
  TreeItemComponent,
  TreeItemReadOnlyComponent,
} from "msa2-ui/src/components/msa-console/ManagedEntityConfigureTree";

const formatMicroservice = (response) => {
  const { microserviceUris, microservicesByUri } = response;
  const microservices = microserviceUris.map((uri) => ({
    uri,
    baseFilename: Repository.stripFolderPathAndFileExtensionFromUri(uri),
    displayName: microservicesByUri[uri].name,
  }));
  return { ...response, microservices };
};

const useStyles = makeStyles(
  ({ breakpoints, darkMode, palette, typography, transitions, colors }) => ({
    grid: {
      padding: 16,
    },
    gridSide: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    treeView: {
      height: "calc(100% - 58px)",
      overflowY: "auto",
    },
    console: {
      height: "100%",
      width: "75%",
      transition: transitions.create("width", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    consoleOpen: {
      width: "calc(100% - 100px)",
      transition: transitions.create("width", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
    consoleSidebar: {
      borderRight: "1px solid #e0e2e7",
      width: "24%",
      height: "100%",
      transition: transitions.create("width", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
    consoleSidebarClosed: {
      width: 100,
      flexBasis: "unset",
      transition: transitions.create("width", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    chevrons: {
      color: "#fff",
      [breakpoints.down("md")]: {
        position: "absolute",
        top: 12,
      },
    },
    menuToggle: {
      margin: 5,
    },
    container: {
      height: "100%",
    },
  }),
);

const MicroserviceConsole = ({
  deviceId,
  deploymentSetting,
  orderStack,
  selectedMicroserviceName = "",
  filterItemClickCallback = () => {},
}) => {
  const classes = useStyles();

  const [filterValue, setFilterValue] = useState("");
  const [showMenu, setShowMenu] = useState(true);
  const [selectedMicroservice, setSelectedMicroservice] = useState(
    selectedMicroserviceName,
  );

  const handleFilterItemClick = (microservice) => {
    filterItemClickCallback(microservice);
    const { baseFilename } = microservice;
    setSelectedMicroservice(baseFilename);
  };

  const filteredMicroservices = deploymentSetting
    ? filter(deploymentSetting.microservices, filterValue, [
        "baseFilename",
        "name",
      ])
    : [];

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <Grid
        className={classNames(classes.consoleSidebar, {
          [classes.consoleSidebarClosed]: !showMenu,
        })}
      >
        <Grid
          container
          item
          alignItems="center"
          justifyContent={showMenu ? "space-between" : "flex-end"}
        >
          {showMenu && (
            <Grid
              item
              className={classNames([classes.borderBottom, classes.gridSide])}
            >
              <FilterMenu
                handleSearchByChange={setFilterValue}
                searchValue={filterValue}
              />
            </Grid>
          )}
          <Grid item className={classes.menuToggle}>
            <IconButton
              className={classes.chevrons}
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              {showMenu ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          className={classNames([classes.treeView, classes.grid])}
        >
          <TreeView
            folderComponent={TreeFolderComponent}
            itemComponent={
              showMenu ? TreeItemComponent : TreeItemReadOnlyComponent
            }
          >
            <TreeItem
              key={deploymentSetting.externalReference}
              externalReference={deploymentSetting.externalReference}
              label={showMenu ? deploymentSetting.name : ""}
              countChildren={filteredMicroservices.length}
              hideCount={!showMenu}
            >
              {filteredMicroservices.map((microservice) => {
                return (
                  <TreeItem
                    key={microservice.baseFilename}
                    label={showMenu ? microservice.displayName : ""}
                    deviceId={deviceId}
                    onClick={() => handleFilterItemClick(microservice)}
                    path={microservice.uri}
                    selected={
                      selectedMicroservice === microservice.baseFilename
                    }
                  />
                );
              })}
            </TreeItem>
          </TreeView>
        </Grid>
      </Grid>
      <Grid
        className={classNames(classes.console, {
          [classes.consoleOpen]: !showMenu,
        })}
      >
        {selectedMicroservice &&
          deploymentSetting &&
          (() => {
            const filteredOrderStack = orderStack.filter(({ parameters }) =>
              Boolean(parameters[selectedMicroservice]),
            );
            const microserviceUri = deploymentSetting.microservices.find(
              ({ baseFilename }) => baseFilename === selectedMicroservice,
            )?.uri;
            return (
              <MSConfigTable
                key={microserviceUri}
                microserviceUri={microserviceUri}
                orderStack={filteredOrderStack}
                deviceId={deviceId}
              />
            );
          })()}
      </Grid>
    </>
  );
};

const MSConfigConsole = ({ deviceId, deploymentSettingId }) => {
  const { t } = useTranslation();

  // Get instance data for the managed entity's microservices
  const [, , orderStack = [], , reloadOrderStack] = useApi(listOrderStack, {
    deviceId,
  });

  const hasDeploymentSetting = deploymentSettingId !== 0;

  const [
    deploymentSettingIsLoading,
    deploymentSettingError,
    deploymentSetting,
    ,
    reloadDeploymentSetting,
  ] = useApi(
    getDeploymentSetting,
    {
      deploymentSettingId,
      //   filterByLabel: isPermissionProfileLabelsEnabled,
      transforms: [formatMicroservice],
    },
    !hasDeploymentSetting,
  );

  return (
    <Grid container xs={12}>
      {deploymentSettingIsLoading && (
        <Grid container alignItems={"center"} justifyContent={"center"}>
          <CircularProgress />
        </Grid>
      )}

      {deploymentSettingError && !deploymentSettingIsLoading && (
        <AlertBar
          message={t("Unable to load x", {
            x: t("Deployment Settings"),
          })}
          refreshFnc={reloadDeploymentSetting}
          adjust
        />
      )}
      {deviceId && deploymentSetting && (
        <MicroserviceConsole
          deviceId={deviceId}
          deploymentSetting={deploymentSetting}
          orderStack={orderStack}
          reloadOrderStack={reloadOrderStack}
          isFilterVariableEnabled={false}
        />
      )}
    </Grid>
  );
};

MSConfigConsole.propTypes = {
  deviceId: PropTypes.number,
  deploymentSettingId: PropTypes.number,
};

export default MSConfigConsole;
