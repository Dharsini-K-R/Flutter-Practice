import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid, Typography } from "@material-ui/core";
import { StreamIcon, AngleUpIcon, AngleDownIcon } from "react-line-awesome";
import { makeStyles, Tooltip } from "@material-ui/core";
import UserButton from "cloudclapp/src/components/user-button/UserButton";
import { useTranslation } from "react-i18next";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon/StatusBadgeIcon";
import useWorkflowDialog from "cloudclapp/src/hooks/useWorkflowDialog";
import DeploymentsExpandedView from "./DeploymentsExpandedView";
import useToggle from "react-use/lib/useToggle";
import { WORKFLOW_STATUS } from "cloudclapp/src/Constants";
import Process from "msa2-ui/src/services/Process";
import CloudVendor from "cloudclapp/src/services/CloudVendor";
import {
  getCloudVendors,
  getWorkflowByUri,
} from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ breakpoints, palette }) => {
  return {
    boxWrapper: {
      padding: "10px",
      width: "100%",
      borderBottom: "1px solid #e0e2e7",
    },
    deploymentWrapper: {
      padding: "6px 8px",
      alignItems: "center",
    },
    icon: {
      fontSize: "21px",
    },
    iconText: {
      fontSize: "15px",
      marginLeft: "6px",
    },
    expandCollapseIcon: {
      fontSize: 19,
      verticalAlign: "middle",
      color: palette.common.black,
      cursor: "pointer",
    },
    statusRunning: (colorProps) => ({
      color: colorProps.wfColor,
      marginLeft: "6px",
    }),
    statusReady: {
      color: palette.primary.main,
    },
    workflowIcon: {
      padding: "5px",
      borderRadius: "4px",
      border: "1px solid",
      fontSize: "20px",
      color: palette.primary.main,
      cursor: "pointer",
    },
    userContainer: {
      justifyContent: "flex-start",
      [breakpoints.down("sm")]: {
        justifyContent: "flex-end",
      },
    },
    containerPlacement: {
      justifyContent: "flex-start",
      [breakpoints.up("md")]: {
        justifyContent: "flex-end",
      },
    },
    titleContainer: {
      display: "flex",
      padding: "6px 8px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(56, 64, 82, 0.04)",
      },
    },
  };
});

const DeploymentDetails = ({
  deploymentDetails,
  environment,
  isExpandable,
  onClickCallBack,
}) => {
  const { envUbiqubeId: ubiqubeId } = environment;
  const { t } = useTranslation();
  const cloudVendors = useSelector(getCloudVendors);
  const { appWFUri } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );

  const [drawerOpen, toggleDrawer] = useToggle(false);

  const deployment = {};

  if (deploymentDetails.variables) {
    deployment.name = deploymentDetails.variables.deployment_name;
    deployment.id = deploymentDetails.variables.SERVICEINSTANCEID;
    deployment.user = deploymentDetails.taskRunner;
    deployment.status = deploymentDetails.status.status;
  } else {
    deployment.name = deploymentDetails.deploymentName;
    deployment.id = deploymentDetails.deploymentId;
    deployment.user = deploymentDetails.deploymentUser;
    deployment.status = deploymentDetails.status;
  }

  const statusObject = WORKFLOW_STATUS[deployment.status];

  const workflow = useSelector(getWorkflowByUri(appWFUri));

  const {
    showWorkflowDialog,
    WorkflowDialog,
    ...workflowDialogProps
  } = useWorkflowDialog({
    workflow,
    ubiqubeId,
    instanceId: deployment.id,
  });

  deployment.displayStatus = statusObject.name;
  const colorProps = { wfColor: statusObject.color };
  const classes = useStyles(colorProps);

  return (
    <Grid container className={classes.boxWrapper}>
      <WorkflowDialog {...workflowDialogProps} />
      <Grid
        container
        item
        lg={3}
        md={4}
        sm={6}
        xs={6}
        className={classes.deploymentWrapper}
        onClick={() => onClickCallBack(deployment.id)}
      >
        <div className={classes.titleContainer}>
          <StatusBadgeIcon
            icon={StreamIcon}
            size="small"
            type="deployment"
            status={deployment.status}
          />
          <Typography
            id={`DEPLOYMENTS_DEPLOYMENT_NAME_${deployment.id}`}
            className={classes.iconText}
          >
            {deployment.name}
          </Typography>
        </div>
      </Grid>
      <Grid
        container
        item
        lg={3}
        md={2}
        sm={6}
        xs={6}
        className={`${classes.userContainer} ${classes.deploymentWrapper}`}
      >
        <UserButton
          id={`DEPLOYMENT_DETAILS_OWNER_BUTTON_${deployment.id}`}
          className={classes.icon}
          username={deployment.user}
          color="dark"
        />
      </Grid>
      <Grid container item lg={6} md={6} sm={12} xs={12} spacing-lg={2}>
        <Grid
          item
          container
          xs
          className={`${classes.deploymentWrapper} ${classes.containerPlacement}`}
        >
          <Typography
            id={`DEPLOYMENTS_DEPLOYMENT_STATUS_${deployment.id}`}
            className={classes.iconText}
          >
            {t("Status")}:
            <span className={classes.statusRunning}>
              {deployment.displayStatus}
            </span>
          </Typography>
          <Grid
            item
            container
            lg={1}
            md={2}
            sm={2}
            xs={1}
            justifyContent="flex-end"
          >
            {workflow &&
              statusObject?.deployActions?.map(
                ({ name, processName, icon: StatusIcon }, index) => {
                  const process = Process.getProcessByLabel(
                    processName,
                    workflow.process,
                  );
                  if (!process) return null;
                  return (
                    <Tooltip title={processName}>
                      <StatusIcon
                        key={name}
                        id={`DEPLOYMENT_DETAILS_STATUS_ICON_${index}`}
                        className={classes.workflowIcon}
                        onClick={() => {
                          showWorkflowDialog(process);
                        }}
                      />
                    </Tooltip>
                  );
                },
              )}
          </Grid>
        </Grid>

        {isExpandable && (
          <Grid
            item
            container
            xs={2}
            sm={1}
            lg={2}
            md={2}
            className={`${classes.deploymentWrapper} ${classes.containerPlacement}`}
          >
            {drawerOpen && (
              <AngleUpIcon
                id={`DEPLOYMENTS_DEPLOYMENT_COLLAPSE_${deployment.id}`}
                className={classes.expandCollapseIcon}
                onClick={toggleDrawer}
              />
            )}
            {!drawerOpen && (
              <AngleDownIcon
                id={`DEPLOYMENTS_DEPLOYMENT_EXPAND_${deployment.id}`}
                className={classes.expandCollapseIcon}
                onClick={toggleDrawer}
              />
            )}
          </Grid>
        )}
      </Grid>
      {drawerOpen && (
        <Grid container>
          <DeploymentsExpandedView
            instanceId={deployment.id}
            appWFUri={appWFUri}
          />
        </Grid>
      )}
    </Grid>
  );
};

DeploymentDetails.propTypes = {
  deploymentDetails: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
  isExpandable: PropTypes.bool,
  onClickCallBack: PropTypes.func,
};

export default DeploymentDetails;
