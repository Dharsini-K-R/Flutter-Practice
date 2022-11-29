import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Button,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  CloudIcon,
  PlugIcon,
  AngleRightIcon,
  StreamIcon,
  CloudUploadIcon,
} from "react-line-awesome";
import QuickDeploymentDialog from "../../components/quick-deployment-dialog/QuickDeploymentDialog";
import { getEnvironments } from "cloudclapp/src/store/designations";
import { getDeploymentsCount } from "../../services/Environment";
import QuickDeploymentStatusBadgeIcon from "cloudclapp/src/components/status-badge-icon/QuickDeploymentStatusBadgeIcon";
import { QUICK_DEPLOYMENT_STEPS } from "cloudclapp/src/Constants";
import isEmpty from "lodash/isEmpty";
import { getConnectionSummary } from "cloudclapp/src/store/designations";

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    button: {
      color: palette.primary.main,
      "&.MuiButton-outlined": {
        border: `1px solid ${palette.primary.main}`,
      },
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    quickDeployCard: {
      marginTop: "20px",
      borderRadius: "10px",
      padding: "10px",
    },
    quickDepIcons: {
      width: "35px",
      height: "35px",
      color: palette.secondary.main,
      padding: "15px",
      fontSize: "xx-large",
    },
    quickDepArrows: {
      width: "10px",
      height: "18px",
      color: palette.border.main,
      padding: "15px",
      fontSize: "x-large",
    },
    collapseBtn: {
      cursor: "pointer",
    },
  };
});

const QuickDeployment = ({ cloudConnectionCount = 0 }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [deploymentDialog, setDeploymentDialog] = useState(false);

  const [collapse, setCollapse] = useState(false);

  const connectionSummary = useSelector(getConnectionSummary);

  const environments = useSelector(getEnvironments());

  const deploymentsCount = getDeploymentsCount(environments);

  const [selectedCloud, setSelectedCloud] = useState({});

  useEffect(() => {
    setCollapse(deploymentsCount === 0);
  }, [environments, deploymentsCount]);

  useEffect(() => {
    if (connectionSummary) {
      const connectedCloud = connectionSummary.filter((cloudVendor) => {
        return cloudVendor.connections.some(
          (connection) => !isEmpty(connection.connectionName),
        );
      });
      setSelectedCloud(connectedCloud[0]);
    }
  }, [connectionSummary]);

  const [currentStep, setCurrentStep] = useState(
    QUICK_DEPLOYMENT_STEPS.CLOUD_CONNECTION_STEP,
  );

  const quickDeployExpnd = () => {
    setCollapse(!collapse);
  };

  const handleQuickDeploymentOnClick = (step) => {
    setCurrentStep(step);
    setDeploymentDialog(true);
  };

  const getEnvironmentsName = () => {
    let environmentsCreated = environments[0].envName;
    if (environments.length === 1) {
      return environmentsCreated;
    }
    environmentsCreated = environmentsCreated + ", " + environments[1].envName;
    if (environments.length > 2) {
      environmentsCreated += " ...";
    }
    return environmentsCreated;
  };
  const getCloudConnectionNames = () => {
    if (isEmpty(selectedCloud)) {
      let connectionsCreated = connectionSummary[0]?.vendorDisplayName;
      if (connectionSummary.length === 1) {
        return connectionsCreated;
      }
      connectionsCreated =
        connectionsCreated + ", " + connectionSummary[1]?.vendorDisplayName;
      if (connectionSummary.length > 2) {
        connectionsCreated += " ...";
      }
      return connectionsCreated;
    } else {
      return selectedCloud.vendorDisplayName;
    }
  };

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Grid item xs={12}>
        <Card className={classes.quickDeployCard}>
          <CardContent>
            <div className={classes.flexSpaceBtw}>
              <Typography gutterBottom variant="h5">
                {t("Quick Deployment")}
              </Typography>
              <Typography
                gutterBottom
                variant="body1"
                onClick={quickDeployExpnd}
                id="DASHBOARD_COLLAPSE_BUTTON"
                className={classes.collapseBtn}
              >
                {collapse ? t("Collapse") : t("Expand")}
              </Typography>
            </div>
            {collapse ? (
              <>
                <Typography gutterBottom variant="subtitle1">
                  {t("4 Easy steps to get your application to the cloud.")}
                </Typography>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ paddingTop: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {deploymentsCount === 0 && cloudConnectionCount > 0 ? (
                      <QuickDeploymentStatusBadgeIcon
                        size="large"
                        icon={PlugIcon}
                        status={"COMPLETED"}
                        label="Cloud Connected"
                        selectedValue={getCloudConnectionNames()}
                      />
                    ) : (
                      <>
                        <PlugIcon className={classes.quickDepIcons} />
                        <Button
                          variant="outlined"
                          id="DASHBOARD_QUICK_DEPLOYMENT_BTN"
                          className={classes.button}
                          onClick={() =>
                            handleQuickDeploymentOnClick(
                              QUICK_DEPLOYMENT_STEPS.CLOUD_CONNECTION_STEP,
                            )
                          }
                        >
                          {t("Add a Cloud Connection")}
                        </Button>
                      </>
                    )}
                  </Box>
                  <AngleRightIcon className={classes.quickDepArrows} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {deploymentsCount === 0 && environments.length > 0 ? (
                      <QuickDeploymentStatusBadgeIcon
                        size="large"
                        icon={CloudIcon}
                        status={"COMPLETED"}
                        label="Environment Created"
                        selectedValue={getEnvironmentsName()}
                      />
                    ) : (
                      <>
                        <CloudIcon className={classes.quickDepIcons} />
                        <Button
                          variant="outlined"
                          id="DASHBOARD_QUICK_DEPLOYMENT_ENVIRONMENT_BTN"
                          className={classes.button}
                          onClick={() =>
                            handleQuickDeploymentOnClick(
                              QUICK_DEPLOYMENT_STEPS.ENVIRONMENT_STEP,
                            )
                          }
                        >
                          {t("Add an Environment")}
                        </Button>
                      </>
                    )}
                  </Box>
                  <AngleRightIcon className={classes.quickDepArrows} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <StreamIcon className={classes.quickDepIcons} />
                    <Button
                      variant="outlined"
                      id="DASHBOARD_QUICK_DEPLOYMENT_DEPLOYMENT_BTN"
                      className={classes.button}
                      onClick={() =>
                        handleQuickDeploymentOnClick(
                          environments.length === 1
                            ? QUICK_DEPLOYMENT_STEPS.DEPLOYMENT_STEP
                            : QUICK_DEPLOYMENT_STEPS.ENVIRONMENT_STEP,
                        )
                      }
                    >
                      {t("Add a Deployment")}
                    </Button>
                  </Box>
                  <AngleRightIcon className={classes.quickDepArrows} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <CloudUploadIcon className={classes.quickDepIcons} />
                    <Typography gutterBottom variant="subtitle1">
                      {t("Deploy on the Cloud")}
                    </Typography>
                  </Box>
                </Grid>
              </>
            ) : (
              <div className={classes.flexSpaceBtw}>
                <Typography gutterBottom variant="subtitle1">
                  {t("Choose the Application you want to deploy")}
                </Typography>
                <Button
                  variant="outlined"
                  id="DASHBOARD_QUICK_DEPLOYMENT_BTN"
                  className={classes.button}
                  onClick={() =>
                    handleQuickDeploymentOnClick(
                      QUICK_DEPLOYMENT_STEPS.CLOUD_CONNECTION_STEP,
                    )
                  }
                >
                  {t("Create a Quick Deployment")}
                </Button>
              </div>
            )}
          </CardContent>
          {deploymentDialog && (
            <QuickDeploymentDialog
              connectionSummary={connectionSummary}
              environments={environments}
              cloudConnectionSelected={
                cloudConnectionCount === 1 ? selectedCloud : {}
              }
              environmentSelected={
                environments?.length === 1 ? environments[0] : {}
              }
              currentStep={currentStep}
              onClose={() => {
                setDeploymentDialog(false);
              }}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default QuickDeployment;
