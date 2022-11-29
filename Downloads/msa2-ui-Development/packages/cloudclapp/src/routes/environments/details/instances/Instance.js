import React from "react";
import {
  Grid,
  Typography,
  makeStyles,
  Button,
  Tabs,
  Tab,
} from "@material-ui/core";
import Header from "../Header";
import { ICONS } from "cloudclapp/src/components/status-badge-icon";
import i18n from "cloudclapp/src/localisation/i18n";
import {
  getEnvironments,
  getCloudVendors,
} from "cloudclapp/src/store/designations";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import WorkflowInstance from "./WorkflowInstance";
import { CubeIcon, ShieldAltIcon, HistoryIcon } from "react-line-awesome";
import ApplicationDetails from "./ApplicationDetails";
import DeploymentSecurity from "./DeploymentSecurity";
import DeploymentLogsTabHistory from "./logs/DeploymentLogsTabHistory";
import { useParams } from "react-router";
import Process from "msa2-ui/src/services/Process";
import { getEnvironmentByDeploymentId } from "cloudclapp/src/services/Environment";
import CloudVendor from "cloudclapp/src/services/CloudVendor";

import useWorkflowInstance from "cloudclapp/src/hooks/useWorkflowInstance";
import useWorkflowDialog from "cloudclapp/src/hooks/useWorkflowDialog";
import useApi from "cloudclapp/src/hooks/useApi";
import { getEnvironment } from "cloudclapp/src/api/environment";
import EnvironmentDetail from "./EnvironmentDetail";
import { WORKFLOW_STATUS } from "cloudclapp/src/Constants";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import {
  Link,
  Route,
  Redirect,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { buildRoute, getParentRoute } from "msa2-ui/src/utils/urls";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import { ListIcon } from "react-line-awesome";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => {
  return {
    title: {
      fontSize: 28,
      fontWeight: 500,
    },
    description: {
      marginTop: "1%",
      height: 25,
      fontWeight: 400,
      marginRight: "1%",
    },
    environmentWrapper: {
      marginTop: "2%",
    },
    statusButton: {
      padding: 0,
      marginLeft: "7%",
    },
    buttonText: {
      borderRadius: 4,
      padding: "6px 10px",
      fontSize: 15,
      boxSizing: "border-box",
      alignItems: "center",
    },
    statusButtonText: {
      border: "1px solid #327BF6",
      color: palette.primary.main,
    },
    actionIcon: {
      fontSize: 16,
    },
    actionsWrapper: {
      marginTop: "0.5%",
      height: 40,
    },
    deploymentActions: {
      display: "flex",
      alignItems: "center",
    },
    status: {
      marginLeft: 10,
    },
  };
});

const TABS = [
  {
    id: "applications",
    label: i18n.t("Applications"),
    Component: ApplicationDetails,
    Icon: CubeIcon,
  },
  {
    id: "security",
    label: i18n.t("Security"),
    Component: DeploymentSecurity,
    Icon: ShieldAltIcon,
  },
  {
    id: "logs",
    label: i18n.t("Logs"),
    Component: DeploymentLogsTabHistory,
    Icon: HistoryIcon,
  },
];

const Instance = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { instanceId } = useParams();
  const [showWFLiveConsole, setWFLiveConsole] = React.useState(false);

  const openWFLiveConsoleDialog = () => {
    setWFLiveConsole(true);
  };
  const closeWFLiveConsoleDialog = () => {
    setWFLiveConsole(false);
  };

  const cloudVendors = useSelector(getCloudVendors);
  const environmentsList = useSelector(getEnvironments());
  const environmentDetails = getEnvironmentByDeploymentId(
    environmentsList ?? [],
    instanceId,
  );

  const [isEnvironmentLoading, , environment, ,] = useApi(getEnvironment, {
    envId: environmentDetails.envId,
  });

  const { appWFUri } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );

  const {
    isLoading,
    workflow,
    workflowInstance,
    workflowStatus,
  } = useWorkflowInstance({
    workflowPath: appWFUri,
    instanceId,
  });
  const statusObject = WORKFLOW_STATUS[workflowStatus?.status.status];

  const {
    showWorkflowDialog,
    WorkflowDialog,
    ...workflowDialogProps
  } = useWorkflowDialog({
    workflowPath: appWFUri,
    ubiqubeId: environment?.envUbiqubeId,
    instanceId: instanceId,
  });

  const history = useHistory();
  const { path, url } = useRouteMatch();
  const defaultRoute = buildRoute(url, TABS[0].id);
  const currentTab = TABS.findIndex(
    ({ id }) => id === pathname.replace(url, "").split("/")[1],
  );
  const handleTabChange = (_, index) => {
    history.push(buildRoute(getParentRoute(pathname), TABS[index].id));
  };

  const isDeploymentActionsEnabled = useSelector(
    getPermission("deployments", "general", "action"),
  );

  return (
    <Grid container className={classes.wrapper}>
      <WorkflowDialog {...workflowDialogProps} />
      <Header
        name={workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.NAME]}
        icon={ICONS.deployment}
        status={workflowStatus?.status.status}
        owner={workflowStatus?.executorUsername}
        isEnvironment={false}
        isLoading={false}
      />
      <Grid container item xs={12}>
        <Grid item xs={12} sm={9}>
          <Typography
            id="DEPLOYMENT_DETAILS_DESCRIPTION"
            variant="subtitle2"
            className={`${classes.description} ${commonClasses.commonTextEllipsis}`}
          >
            {workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.DESCRIPTION]}
          </Typography>
        </Grid>
        <Grid
          container
          xs={12}
          sm
          item
          className={commonClasses.commonXSOnlyFlexStart}
        >
          <Typography
            id="DEPLOYMENT_DETAILS_IP_ADDRESS"
            variant="subtitle2"
            className={classes.description}
          >
            {workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.IP_ADDRESS]}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} className={classes.actionsWrapper}>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={3}
          container
          alignItems="flex-start"
          className={classes.deploymentActions}
        >
          <Typography id="DEPLOYMENT_DETAILS_STATUS" variant="subtitle2">
            {t("Status")}
            {":"}
          </Typography>
          <Typography
            id="DEPLOYMENT_DETAILS_STATUS"
            variant="subtitle2"
            className={classes.status}
            style={{ color: statusObject?.color }}
          >
            {statusObject?.name}
          </Typography>
          {workflow &&
            statusObject?.deployActions?.map(
              ({ icon: ActionIcon, name, processName }, index) => {
                const process = Process.getProcessByLabel(
                  processName,
                  workflow.process,
                );
                if (!process) return null;

                return (
                  <Button
                    key={name}
                    id={`DEPLOYMENT_DETAILS_STATUS_BUTTON_${index}`}
                    className={classes.statusButton}
                    onClick={() => {
                      showWorkflowDialog(process);
                    }}
                  >
                    <Typography
                      id={`DEPLOYMENT_DETAILS_STATUS_${index}`}
                      className={`${classes.buttonText} ${classes.statusButtonText}`}
                    >
                      <ActionIcon className={classes.actionIcon} /> {name}
                    </Typography>
                  </Button>
                );
              },
            )}

          {statusObject?.name === WORKFLOW_STATUS.RUNNING.name && (
            <Button
              key={statusObject.id}
              id={`DEPLOYMENT_DETAILS_STATUS_BUTTON_${statusObject.id}`}
              onClick={() => {
                openWFLiveConsoleDialog();
              }}
            >
              <Typography
                id={`DEPLOYMENT_DETAILS_STATUS_${statusObject.id}`}
                className={`${classes.buttonText} ${classes.statusButtonText}`}
              >
                <ListIcon className={classes.actionIcon} /> {"Details"}
              </Typography>
            </Button>
          )}
        </Grid>
        {workflow && isDeploymentActionsEnabled && (
          <WorkflowInstance
            workflowData={workflow}
            envUbiqubeId={environment?.envUbiqubeId}
            instanceId={instanceId}
            disableProcessButton={
              statusObject
                ? statusObject.name === WORKFLOW_STATUS.RUNNING.name
                : false
            }
          />
        )}
      </Grid>

      <Grid item xs={12} style={{ boxSizing: "border-box" }}>
        <Tabs
          value={currentTab < 0 ? 0 : currentTab}
          onChange={handleTabChange}
        >
          {TABS.map(({ id, label, Icon }) => (
            <Tab
              key={id}
              component={Link}
              id={`INSTANCE_DETAILS_${id.toUpperCase()}_TAB`}
              label={label}
              to={buildRoute(getParentRoute(pathname), id)}
              icon={<Icon className={commonClasses.commonTabIcon} />}
              disabled={isLoading || isEnvironmentLoading}
            />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {workflowInstance && workflow && (
          <Switch>
            <Route exact path={path}>
              <Redirect to={defaultRoute} />
            </Route>
            {TABS.map(({ id, Component }) => (
              <Route path={buildRoute(path, id)} key={id}>
                {workflowInstance && environment && (
                  <Component
                    applications={
                      workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.APPLICATION]
                    }
                    deployment={workflowInstance}
                    environment={environment}
                    instanceId={instanceId}
                    processes={workflow?.process}
                  />
                )}
              </Route>
            ))}
            <Redirect to={defaultRoute} />
          </Switch>
        )}
      </Grid>
      {environment && (
        <EnvironmentDetail
          environment={environment}
          instanceId={instanceId}
          instanceName={workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.NAME]}
          status={environmentDetails.status}
        />
      )}
      {showWFLiveConsole && (
        <Dialog
          maxWidth="md"
          onClose={closeWFLiveConsoleDialog}
          title={workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.NAME]}
        >
          <WorkflowLiveConsole processInstance={workflowStatus} />
        </Dialog>
      )}
    </Grid>
  );
};

export default Instance;
