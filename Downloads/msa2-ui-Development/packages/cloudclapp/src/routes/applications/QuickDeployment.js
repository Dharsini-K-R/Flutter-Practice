import React, { useState } from "react";
import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import QuickDeploymentDialog from "cloudclapp/src/components/quick-deployment-dialog/QuickDeploymentDialog";
import {
  getConnectionSummary,
  getEnvironments,
} from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ overrides, palette }) => ({
  deploymentText: {
    boxSizing: "border-box",
    fontSize: "normal",
    color: palette.background.subTextGrey,
    textAlign: "left",
    lineHeight: "16px",
    paddingBottom: "1%",
    paddingLeft: "2%",
    paddingTop: "3%",
  },
  deploymentButton: {
    padding: "12px 20px 12px 20px",
    borderRadius: "4px",
    border: "1px solid #327bf6",
    boxSizing: "border-box",
    fontWeight: "500",
    color: overrides.MuiButton.root.color,
    textAign: "center",
    lineHeight: "normal",
    textTransform: "none",
  },
}));

const QuickDeployment = ({ defaultContext, selectedCloud, imageType }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const connectionSummary = useSelector(getConnectionSummary);
  const environments = useSelector(getEnvironments());

  return (
    <>
      {showDialog && (
        <QuickDeploymentDialog
          selectedCloud={selectedCloud}
          imageType={imageType}
          onClose={() => {
            setShowDialog(false);
          }}
          defaultContext={defaultContext}
          connectionSummary={connectionSummary}
          environments={environments}
        />
      )}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        direction="row"
      >
        <Grid item xs={3}>
          <Typography
            id="choose_application_to_deploy"
            className={classes.deploymentText}
          >
            {" "}
            {t("Choose the application you want to deploy")}{" "}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button
            id="dockerhub-deployment-button"
            variant="outlined"
            className={classes.deploymentButton}
            onClick={() => {
              setShowDialog(true);
            }}
          >
            {t("Create a Quick Deployment")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default QuickDeployment;
