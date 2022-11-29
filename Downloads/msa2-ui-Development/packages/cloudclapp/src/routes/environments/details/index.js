import React, { useState } from "react";
import i18n from "cloudclapp/src/localisation/i18n";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Link,
  Route,
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useParams } from "react-router";

import { buildRoute, getParentRoute } from "msa2-ui/src/utils/urls";
import useApi from "cloudclapp/src/hooks/useApi";
import usePostApi from "cloudclapp/src/hooks/usePostApi";
import useWorkflowDialog from "cloudclapp/src/hooks/useWorkflowDialog";
import DeploymentsTab from "cloudclapp/src/routes/environments/details/DeploymentsTab";
import MonitoringTab from "cloudclapp/src/routes/environments/details/MonitoringTab";
import EnvironmentLogs from "cloudclapp/src/routes/environments/details/EnvironmentLogs";
import isEmpty from "lodash/isEmpty";

import {
  getEnvironment,
  deleteEnvironment,
} from "cloudclapp/src/api/environment";
import {
  fetchEnvironments,
  getEnvironmentById,
  getWorkflowByUri,
  getCloudVendors,
  getPermission,
  getAccessibility,
} from "cloudclapp/src/store/designations";
import CloudVendor from "cloudclapp/src/services/CloudVendor";

import { PROCESS_NAME } from "cloudclapp/src/Constants";

import { makeStyles, Grid, Tab, Tabs, Typography } from "@material-ui/core";

import {
  HomeIcon,
  StreamIcon,
  DesktopIcon,
  CogIcon,
  HistoryIcon,
  VectorSquareIcon,
} from "react-line-awesome";

import Dialog from "cloudclapp/src/components/dialog/Dialog";

import { ICONS } from "cloudclapp/src/components/status-badge-icon";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import EnvironmentConfig from "./EnvironmentConfig";
import Header from "./Header";

import EnvironmentSummary from "./EnvironmentSummary";
import DesignTab from "./DesignTab";

const useStyles = makeStyles(({ palette, typography }) => {
  return {
    title: {
      fontSize: 28,
      fontWeight: 500,
    },
    description: {
      marginTop: 10,
      height: 25,
      fontWeight: 400,
    },
    tabRoot: {
      minWidth: 10,
    },
    tabWrapper: {
      flexDirection: "row",
      fontSize: 14,
    },
    tabLabelIcon: {
      minHeight: 10,
    },
    wrapper: {
      height: "100%",
    },
    tabContent: {
      height: "calc(100% - 150px)",
    },
  };
});

const TABS = [
  {
    id: "dashboard",
    label: i18n.t("Dashboard"),
    Component: EnvironmentSummary,
    Icon: HomeIcon,
  },
  {
    id: "design",
    label: i18n.t("Design"),
    Component: DesignTab,
    Icon: VectorSquareIcon,
    getHidden: (state, environment) => {
      return isEmpty(environment?.envBlueprintPath);
    },
  },
  {
    id: "deployments",
    label: i18n.t("Deployments"),
    Component: DeploymentsTab,
    Icon: StreamIcon,
  },
  {
    id: "monitoring",
    label: i18n.t("Monitoring"),
    Component: MonitoringTab,
    Icon: DesktopIcon,
    getHidden: ({ auth, designations: { permissions } }) => {
      const userRole = auth.userDetails.baseRole.id;
      const canViewMonitoring = getAccessibility(
        permissions,
        ["environments", "monitoring", "view"].join("."),
        userRole,
      );
      return !canViewMonitoring;
    },
    /*getHidden : () => {
      return getPermission("environments", "monitoring", "view")
    },*/
  },
  {
    id: "config",
    label: i18n.t("Configure"),
    Component: EnvironmentConfig,
    Icon: CogIcon,
  },
  {
    id: "logs",
    label: i18n.t("Logs"),
    Component: EnvironmentLogs,
    Icon: HistoryIcon,
  },
  // {
  //   id: "drift",
  //   label: i18n.t("Drift"),
  //   Component: () => <></>,
  //   Icon: ColumnsIcon,
  // },
];

const EnvironmentDetails = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { envId } = useParams();

  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const defaultRoute = buildRoute(url, TABS[0].id);

  const state = useSelector((state) => ({
    // trim states to minimise rerender time
    auth: state.auth,
    designations: { permissions: state.designations.permissions },
  }));

  const [isLoading, , environment, , reloadEnvironment] = useApi(
    getEnvironment,
    { envId },
  );

  const filteredTabs = TABS.filter(({ getHidden }) =>
    getHidden ? !getHidden(state, environment) : true,
  );

  const canTearDownEnvironment = useSelector(
    getPermission("environments", "general", "tearDown"),
  );
  const canDeleteEnvironment = useSelector(
    getPermission("environments", "general", "delete"),
  );

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const currentTab = filteredTabs.findIndex(
    ({ id }) => id === pathname.replace(url, "").split("/")[1],
  );

  const onDeleteSuccess = () => {
    dispatch(fetchEnvironments);
    history.push("/environments");
  };

  const [handleDelete, isDeleting, deleteError] = usePostApi(
    deleteEnvironment,
    { envId },
    onDeleteSuccess,
  );

  const { status } = useSelector(getEnvironmentById(environment?.envId)) ?? {};
  const cloudVendors = useSelector(getCloudVendors);
  const { envWFUri } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );

  const handleTabChange = (_, index) => {
    history.push(buildRoute(getParentRoute(pathname), filteredTabs[index].id));
  };

  const workflow = useSelector(getWorkflowByUri(envWFUri));
  const tearDownProcess = workflow?.process.find(
    ({ displayName }) => displayName === PROCESS_NAME.TEAR_DOWN,
  );
  // If there is Tear Down Process, trigger it. Otherwise Call DELETE environment
  const canTearDown = Boolean(tearDownProcess && environment?.serviceId);

  const {
    showWorkflowDialog,
    WorkflowDialog,
    ...workflowDialogProps
  } = useWorkflowDialog({
    workflow,
    ubiqubeId: environment?.envUbiqubeId,
    instanceId: environment?.serviceId,
    onClose: reloadEnvironment,
  });

  return (
    <>
      {isConfirmingDelete && (
        <Dialog
          onClose={() => {
            setIsConfirmingDelete(false);
          }}
          title={t("Confirmation Request")}
          onExec={() => {
            handleDelete();
          }}
          content={t("Are you sure you want to delete this environment?", {
            name: environment?.envName,
          })}
          disabled={isDeleting}
          errorContent={deleteError?.getMessage(
            t("Unable to delete Environment"),
          )}
        />
      )}
      <WorkflowDialog {...workflowDialogProps} />
      <Grid container className={classes.wrapper}>
        <Header
          name={environment?.envName}
          icon={ICONS.environment}
          status={status}
          envId={environment?.envId}
          onDeleteEvent={
            canTearDown
              ? () => showWorkflowDialog(tearDownProcess)
              : () => setIsConfirmingDelete(true)
          }
          userId={environment?.cclapOwner}
          isLoading={isLoading}
          onChangeOwnership={reloadEnvironment}
          deleteButtonLabel={canTearDown ? t("Tear Down") : undefined}
          shouldHideDeleteButton={
            canTearDown ? !canTearDownEnvironment : !canDeleteEnvironment
          }
        />
        <Grid item xs={12}>
          <Typography
            id="ENVIRONMENT_DETAILS_DESCRIPTION"
            variant="subtitle2"
            className={classes.description}
          >
            {environment?.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={currentTab < 0 ? 0 : currentTab}
            onChange={handleTabChange}
          >
            {filteredTabs.map(({ id, label, Icon }) => (
              <Tab
                key={id}
                component={Link}
                id={`CREATE_ENVIRONMENT_${id.toUpperCase()}_TAB`}
                label={label}
                to={buildRoute(getParentRoute(pathname), id)}
                icon={<Icon className={commonClasses.commonTabIcon} />}
                disabled={isLoading}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12} className={classes.tabContent}>
          {environment && (
            <Switch>
              <Route exact path={path}>
                <Redirect to={defaultRoute} />
              </Route>
              {filteredTabs.map(({ id, Component }) => (
                <Route path={buildRoute(path, id)} key={id}>
                  <Component
                    environment={environment}
                    reloadEnvironment={reloadEnvironment}
                  />
                </Route>
              ))}
              <Redirect to={defaultRoute} />
            </Switch>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default EnvironmentDetails;
