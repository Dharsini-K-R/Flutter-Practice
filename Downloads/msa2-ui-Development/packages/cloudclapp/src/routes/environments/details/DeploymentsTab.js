import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DeploymentsWrapper from "./DeploymentsWrapper";

const useStyles = makeStyles(({ palette }) => {
  return {
    text: {
      fontWeight: 600,
      fontSize: 14,
      color: palette.background.appBar,
    },
    deploymentContainer: {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: "0 1%",
    },
    header: {
      alignItems: "center",
      padding: "30px 0",
    },
  };
});

const DeploymentsTab = ({ environment }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div
      className={classes.deploymentContainer}
      data-testid="deployments-tab-container"
    >
      <Grid container className={classes.header} spacing={2}>
        <Grid item>
          <Typography
            id="ENVIRONMENT_DEPLOYMENTS_TITLE"
            className={classes.text}
          >
            {t("DEPLOYMENTS")}
          </Typography>
        </Grid>
      </Grid>
      <DeploymentsWrapper environment={environment} />
    </div>
  );
};

export default DeploymentsTab;
