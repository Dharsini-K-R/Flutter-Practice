import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import AddDeployment from "cloudclapp/src/components/deployments/AddDeployment";

const useStyles = makeStyles(() => {
  return {
    flexEnd: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
  };
});

const DeploymentStep = ({ workflowContext, isDisabled, cloudService }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  //   const isAppDisabled = (data) => {
  //      isDisabled(data)
  //      }
  const showOnlyVMs =
    cloudService?.imageType === "vm" ? "virtual-machine" : "docker-hub";

  return (
    <Grid>
      <Typography gutterBottom variant="h5" className={classes.flexEnd}>
        {t("Create a Deployment")}
      </Typography>
      <AddDeployment
        workflowContext={workflowContext}
        showOnlyVMs={showOnlyVMs}
      />
    </Grid>
  );
};

export default DeploymentStep;
