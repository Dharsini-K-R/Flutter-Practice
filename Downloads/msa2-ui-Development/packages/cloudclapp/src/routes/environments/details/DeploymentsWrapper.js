import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

import useApi from "cloudclapp/src/hooks/useApi";
import { getWorkflowInstances } from "msa2-ui/src/api/workflow";
import { buildRoute } from "msa2-ui/src/utils/urls";
import Repository from "msa2-ui/src/services/Repository";
import AddItemsButton from "cloudclapp/src/components/add-items-button/AddItemsButton";
import CloudVendor, {
  getServiceFromEnvironment,
} from "cloudclapp/src/services/CloudVendor";
import {
  fetchEnvironments,
  getCloudVendors,
} from "cloudclapp/src/store/designations";
import { workflowStatus } from "msa2-ui/src/Constants";

import { CircularProgress, Grid, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import DeploymentDetails from "cloudclapp/src/routes/deployments/DeploymentDetails";
import AddDeploymentDialog from "cloudclapp/src/routes/deployments/AddDeploymentDialog";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    header: {
      alignItems: "center",
      paddingBottom: 10,
    },
    boxWrapper: {
      padding: "1.5% 0",
      alignItems: "center",
      backgroundColor: palette.common.white,
      borderRadius: 8,
      boxShadow:
        "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
    },
    deploymentsHeader: {
      paddingBottom: 10,
      borderBottom: "1px solid #e0e2e7",
    },
    selectUsers: {
      [breakpoints.down("sm")]: {
        paddingLeft: 20,
      },
    },
    selectStates: {
      paddingLeft: 20,
    },
    addDeployment: {
      paddingRight: 20,
    },
    selectInput: {
      marginLeft: 10,
    },
    selectLabel: {
      alignItems: "center",
      fontWeight: "bold",
    },
    noContentWrapper: {
      padding: "10px",
      width: "100%",
      borderBottom: "1px solid #e0e2e7",
      display: "flex",
      justifyContent: "center",
      fontSize: "15px",
    },
  };
});

const filterOptions = workflowStatus.map(({ name, status }, index) => ({
  value: index + 1,
  label: name,
  status,
}));

const filterByStates = [
  {
    value: 0,
    label: "All States",
    status: "All States",
  },
  ...filterOptions,
];

// const filterByUsers = [
//   {
//     value: 0,
//     label: "All Users",
//   },
// ];

const DeploymentsWrapper = ({ environment }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [statesInput, setStatesInput] = useState(filterByStates[0]);
  // const [usersInput, setUsersInput] = useState(filterByUsers[0]);
  const [showAddDeployment, setShowAddDeployment] = useState(false);

  const cloudVendors = useSelector(getCloudVendors);
  const cloudService = getServiceFromEnvironment(environment, cloudVendors);
  const { appWFUri } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );
  const canCreateDeployment = useSelector(
    getPermission("deployments", "general", "create"),
  );

  const disableAddDeployment =
    environment?.serviceId === null || environment?.envEntityId === 0;

  const [loading, , workflow, , reload] = useApi(
    getWorkflowInstances,
    {
      ubiqubeId: environment.envUbiqubeId,
      workflowPath: decodeURIComponent(
        Repository.stripFileExtensionFromString(appWFUri),
      ),

      status: statesInput.value === 0 ? "" : statesInput.status,
    },
    !environment.envUbiqubeId || !appWFUri,
  );
  const deployments = workflow?.instances;

  const openAddDeploymentDialog = () => {
    setShowAddDeployment(true);
  };
  const closeAddDeploymentDialog = () => {
    reload();
    dispatch(fetchEnvironments);
    setShowAddDeployment(false);
  };

  const { url } = useRouteMatch();
  const history = useHistory();
  const handleChange = (index) => {
    history.push(buildRoute(url, index));
  };
  return (
    <Grid container className={classes.boxWrapper}>
      <Grid container className={classes.deploymentsHeader}>
        <Grid
          container
          item
          lg
          md
          xs={12}
          className={`${classes.header} ${classes.selectStates}`}
        >
          <Grid item>
            <Typography
              id="DEPLOYMENT_SELECT_STATES"
              className={classes.selectLabel}
            >
              {t("States")}
            </Typography>
          </Grid>
          <Grid item>
            <SelectField
              id="DEPLOYMENTS_STATES_FILTER"
              className={classes.selectInput}
              width={170}
              options={filterByStates}
              value={statesInput}
              onChange={(event) => setStatesInput(event)}
            />
          </Grid>
        </Grid>
        {/* <Grid
          container
          item
          lg
          md
          xs={12}
          className={`${classes.header} ${classes.selectUsers}`}
        >
          <Grid item>
            <Typography
              id="DEPLOYMENT_SELECT_USERS"
              className={classes.selectLabel}
            >
              {t("Users")}
            </Typography>
          </Grid>
          <Grid item>
            <SelectField
              id="DEPLOYMENTS_USERS_FILTER"
              className={classes.selectInput}
              width={170}
              options={filterByUsers}
              value={usersInput}
              onChange={(event) => setUsersInput(event)}
              disabled={true}
            ></SelectField> 
          </Grid>
        </Grid> */}
        {canCreateDeployment && (
          <Tooltip
            title={
              disableAddDeployment
                ? t("You cannot add Deployment on this Environment")
                : ""
            }
          >
            <Grid
              container
              item
              lg={6}
              md={3}
              xs={12}
              className={`${classes.header} ${classes.addDeployment}`}
              justifyContent="flex-end"
            >
              <AddItemsButton
                id="ENVIRONMENTS_ADD_DEPLOYMENT_BUTTON"
                onClickCallBack={openAddDeploymentDialog}
                buttonLabel={t("Add Deployment")}
                disabled={disableAddDeployment}
              />
            </Grid>
          </Tooltip>
        )}
      </Grid>
      {loading || !deployments ? (
        <div className={classes.noContentWrapper}>
          <CircularProgress aria-label={t("Loading")} />
        </div>
      ) : deployments && deployments.length === 0 ? (
        <Typography
          id="ENVIRONMENT_DEPLOYMENTS_NO_DEPLOYMENT"
          className={`${classes.noContentWrapper}`}
        >
          {t("No deployments found")}
        </Typography>
      ) : (
        deployments?.map((deployment) => (
          <DeploymentDetails
            key={deployment.variables.SERVICEINSTANCEID}
            deploymentDetails={deployment}
            isExpandable={false}
            onClickCallBack={handleChange}
            environment={environment}
          />
        ))
      )}

      {showAddDeployment && (
        <AddDeploymentDialog
          onClose={closeAddDeploymentDialog}
          ubiqubeId={environment.envUbiqubeId}
          workflowPath={appWFUri}
          entityId={environment.envEntityId}
          showOnlyVMs={
            cloudService?.imageType === "vm" ? "virtual-machine" : "docker-hub"
          }
        />
      )}
    </Grid>
  );
};

export default DeploymentsWrapper;
