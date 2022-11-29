import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles, Tooltip } from "@material-ui/core";
import {
  fetchEnvironments,
  getCloudVendors,
} from "cloudclapp/src/store/designations";
import CloudVendor, {
  getServiceFromEnvironment,
} from "cloudclapp/src/services/CloudVendor";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon/StatusBadgeIcon";
import AddItemsButton from "cloudclapp/src/components/add-items-button/AddItemsButton";
import AddDeploymentDialog from "./AddDeploymentDialog";
import { useTranslation } from "react-i18next";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => {
  return {
    boxWrapper: {
      width: "100%",
      borderBottom: "1px solid #e0e2e7",
    },
    icon: {
      fontSize: "31px",
      color: palette.common.black,
    },
    text: {
      fontSize: "19px",
      fontWeight: 600,
      color: palette.common.black,
      marginLeft: 10,
    },
    addIcon: {
      fontSize: 18,
      color: palette.primary.main,
      verticalAlign: "middle",
    },
    buttonText: {
      fontSize: 16,
      color: palette.primary.main,
      marginLeft: 6,
    },
    boxPadding: {
      padding: "0 20px 14px 12px",
    },
    titleContainer: {
      display: "flex",
      padding: "6px 8px",
      "&:hover": {
        backgroundColor: "rgba(56, 64, 82, 0.04)",
      },
    },
  };
});
const DeploymentTitle = ({ id, title, status, environment }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cloudVendors = useSelector(getCloudVendors);
  const cloudService = getServiceFromEnvironment(environment, cloudVendors);
  const { appWFUri } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );
  const [showAddDeployment, setShowAddDeployment] = React.useState(false);

  const canCreateDeployment = useSelector(
    getPermission("deployments", "general", "create"),
  );

  const disableAddDeployment =
    environment?.serviceId === null || environment?.envEntityId === 0;

  const openAddDeploymentDialog = () => {
    setShowAddDeployment(true);
  };
  const closeAddDeploymentDialog = () => {
    dispatch(fetchEnvironments);
    setShowAddDeployment(false);
  };
  return (
    <div className={classes.boxWrapper}>
      <Grid container className={classes.boxPadding}>
        <Grid container item xs>
          <div className={classes.titleContainer}>
            <Grid item>
              <StatusBadgeIcon status={status} />
            </Grid>
            <Grid item>
              <Typography
                id={`DEPLOYMENTS_DEPLOYMENT_TITLE_${id}`}
                className={classes.text}
              >
                {title}
              </Typography>
            </Grid>
          </div>
        </Grid>
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
              xs={6}
              justifyContent="flex-end"
              style={{ alignItems: "center" }}
            >
              <AddItemsButton
                id={`DEPLOYMENTS_ADD_DEPLOYMENT_BUTTON_${id}`}
                onClickCallBack={openAddDeploymentDialog}
                buttonLabel={t("Add Deployment")}
                disabled={disableAddDeployment}
              ></AddItemsButton>
            </Grid>
          </Tooltip>
        )}
      </Grid>
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
    </div>
  );
};

export default DeploymentTitle;
