import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import SummaryCard from "cloudclapp/src/components/summary-card/SummaryCard";
import { ShieldAltIcon, StreamIcon, UserFriendsIcon } from "react-line-awesome";

import CloudVendor, {
  getServiceFromEnvironment,
} from "cloudclapp/src/services/CloudVendor";
import AddDeploymentDialog from "cloudclapp/src/routes/deployments/AddDeploymentDialog";
import {
  fetchEnvironmentSummary,
  fetchEnvironments,
  getEnvironments,
} from "cloudclapp/src/store/designations";
import { useSelector, useDispatch } from "react-redux";

import useApi from "cloudclapp/src/hooks/useApi";
import { getSecurityInstance } from "cloudclapp/src/api/security";
import { WORKFLOW_STATUS, workflowStatus } from "cloudclapp/src/Constants";
import { getCloudVendors } from "cloudclapp/src/store/designations";
import SecurityDialog from "cloudclapp/src/routes/environments/details/instances/SecurityDialog";
import ListUsers from "./ListUsers";
import { ENVIRONMENT_SUMMARY_CARDS } from "cloudclapp/src/Constants";
import MonitoringGraph from "./MonitoringGraph";
import { getUsersBySubtenant } from "cloudclapp/src/api/environment.js";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(() => {
  return {
    deploymentContainer: {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: "2% 0",
    },
    ".deploymentContainer>div:not(firstChild)": {
      marginLeft: 15,
    },
  };
});

const EnvironmentSummary = ({
  environment,
  cloudVendor,
  reloadEnvironment,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [showAddDeployment, setShowAddDeployment] = React.useState(false);
  const openAddDeploymentDialog = () => {
    setShowAddDeployment(true);
  };

  const closeAddDeploymentDialog = () => {
    reloadEnvironment();
    dispatch(fetchEnvironments);
    setShowAddDeployment(false);
  };

  const closeListUsersDialog = () => {
    reloadEnvironmentUsersList();
    setInviteUsers(false);
  };

  const [inviteUsers, setInviteUsers] = useState(false);

  const canCreateDeployment = useSelector(
    getPermission("deployments", "general", "create"),
  );

  const disableAddDeployment =
    environment?.serviceId === null || environment?.envEntityId === 0;

  useEffect(() => {
    dispatch(fetchEnvironmentSummary);
  }, [dispatch]);

  const cloudVendors = useSelector(getCloudVendors);
  const cloudService = getServiceFromEnvironment(environment, cloudVendors);
  const {
    appWFUri,
    scanApp: scanAppWorkflowPath,
    scanWebApp: scanWebAppWorkflowPath,
  } = CloudVendor.getWFUrisFromEnvironment(environment, cloudVendors);

  const allEnvironments = useSelector(getEnvironments());
  const environmentDeployments = allEnvironments
    ?.filter((env) => env.envId === environment.envId)[0]
    .deployments?.map((deployment) => deployment.deploymentId);

  const [isLoading, , response = {}, , reload] = useApi(
    getSecurityInstance,
    {
      ubiqubeId: environment.envUbiqubeId,
      workflowPath: decodeURIComponent(scanAppWorkflowPath),
      activeDeployments: environmentDeployments,
    },
    !environment.envUbiqubeId || !scanAppWorkflowPath,
  );
  const { securityInstance } = response;
  const status = securityInstance?.status.status ?? WORKFLOW_STATUS.NONE.status;
  const { securityLabel, color } =
    workflowStatus.find((wf) => wf.status === status) ?? {};
  const [showSecurityDialog, setShowSecurityDialog] = React.useState(false);
  const openSecurityDialog = () => {
    setShowSecurityDialog(true);
  };
  const closeSecurityDialog = () => {
    reload();
    setShowSecurityDialog(false);
  };

  const [
    isLoadingWebappScan,
    ,
    responseWebappScan = {},
    ,
    reloadWebappScan,
  ] = useApi(
    getSecurityInstance,
    {
      ubiqubeId: environment.envUbiqubeId,
      workflowPath: decodeURIComponent(scanWebAppWorkflowPath),
      activeDeployments: environmentDeployments,
    },
    !environment.envUbiqubeId || !scanWebAppWorkflowPath,
  );
  const webAppScanStatus =
    responseWebappScan.securityInstance?.status.status ??
    WORKFLOW_STATUS.NONE.status;
  const scanWfObject =
    workflowStatus.find((wf) => wf.status === webAppScanStatus) ?? {};
  const [
    showWebAppSecurityDialog,
    setShowWebAppSecurityDialog,
  ] = React.useState(false);
  const openWebAppSecurityDialog = () => {
    setShowWebAppSecurityDialog(true);
  };
  const closeWebAppSecurityDialog = () => {
    reloadWebappScan();
    setShowWebAppSecurityDialog(false);
  };

  const [, , enviromentUsersList, , reloadEnvironmentUsersList] = useApi(
    getUsersBySubtenant,
    {
      subtenantId: environment.envId,
    },
  );

  const CARDS = [
    {
      title: ENVIRONMENT_SUMMARY_CARDS.DEPLOYMENTS,
      icon: StreamIcon,
      count: environment?.deploymentCount || 0,
      noDataText: t("You have not created any deployments yet"),
      buttonText: canCreateDeployment ? t("Add Deployment") : null,
      buttonDisabled: disableAddDeployment,
      disabledButtonText: t("You cannot add Deployment on this Environment"),
      onClickCallback: openAddDeploymentDialog,
      idPrefix: "ENVIRONMENT_DETAILS_DEPLOYMENTS",
    },
    {
      title: ENVIRONMENT_SUMMARY_CARDS.USERS,
      icon: UserFriendsIcon,
      count: enviromentUsersList?.length || 0,
      noDataText: t("No users linked yet"),
      buttonText: t("List Users"),
      idPrefix: "ENVIRONMENT_DETAILS_USERS",
      onClickCallback: setInviteUsers,
    },
    {
      title: ENVIRONMENT_SUMMARY_CARDS.SECURITY,
      icon: ShieldAltIcon,
      status: securityInstance?.status.status ?? WORKFLOW_STATUS.NONE.status,
      securityLabel,
      statusIcon: ShieldAltIcon,
      statusColor: color,
      noDataText: t("You have not created any deployments yet"),
      buttonText: t("View Details"),
      updatedAt: securityInstance?.status.endingDate,
      isLoading: isLoading,
      onClickCallback: openSecurityDialog,
      idPrefix: "ENVIRONMENT_DETAILS_SECURITY",
      buttonDisabled: securityInstance ? false : true,
      hidden: !scanAppWorkflowPath,
    },
    {
      title: ENVIRONMENT_SUMMARY_CARDS.WEBAPPSECURITY,
      icon: ShieldAltIcon,
      status: webAppScanStatus,
      securityLabel: scanWfObject.securityLabel,
      statusIcon: ShieldAltIcon,
      statusColor: scanWfObject.color,
      noDataText: t("You have not created any deployments yet"),
      buttonText: t("View Details"),
      updatedAt: responseWebappScan.securityInstance?.status.endingDate,
      isLoading: isLoadingWebappScan,
      onClickCallback: openWebAppSecurityDialog,
      idPrefix: "ENVIRONMENT_DETAILS_SECURITY_WEBAPP",
      buttonDisabled: responseWebappScan.securityInstance ? false : true,
      hidden: !scanWebAppWorkflowPath,
    },
  ];

  const availableCards = CARDS.filter(({ hidden }) => !hidden);

  return (
    <Grid
      container
      direction="row"
      data-testid="environment-summary-tab-container"
    >
      <Grid
        container
        spacing={2}
        alignItems="stretch"
        className={classes.deploymentContainer}
      >
        {availableCards.map((props) => (
          <Grid
            item
            xl={availableCards.length === 4 ? 3 : undefined}
            lg={availableCards.length === 3 ? 4 : undefined}
            md={6}
            sm={12}
            xs={12}
          >
            <SummaryCard {...props} />
          </Grid>
        ))}

        {showAddDeployment && (
          <AddDeploymentDialog
            onClose={closeAddDeploymentDialog}
            ubiqubeId={environment.envUbiqubeId}
            workflowPath={appWFUri}
            entityId={environment.envEntityId}
            showOnlyVMs={
              cloudService?.imageType === "vm"
                ? "virtual-machine"
                : "docker-hub"
            }
          />
        )}

        {inviteUsers && (
          <ListUsers
            environmentId={environment.envId}
            environmentName={environment.envName}
            onClose={closeListUsersDialog}
            environmentUsers={enviromentUsersList}
            reloadEnvironmentUsersList={reloadEnvironmentUsersList}
          />
        )}

        {showSecurityDialog && (
          <SecurityDialog
            onClose={closeSecurityDialog}
            environment={environment}
            deployment={{}}
            cloudVendor={cloudVendor}
            scanApp
          />
        )}

        {showWebAppSecurityDialog && (
          <SecurityDialog
            onClose={closeWebAppSecurityDialog}
            environment={environment}
            deployment={{}}
            cloudVendor={cloudVendor}
            scanWebApp
          />
        )}
      </Grid>

      <MonitoringGraph envEntityId={environment.envEntityId} />
    </Grid>
  );
};

export default EnvironmentSummary;
