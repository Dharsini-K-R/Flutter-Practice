import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { CloudIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import EnvironmentSection from "../dashboard/EnvironmentSection";

const useStyles = makeStyles(({ palette }) => {
  return {
    boxWrapper: {
      padding: "2% 2%",
      backgroundColor: palette.common.white,
      borderRadius: 8,
      boxShadow:
        "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
    },
  };
});

const EnvironmentDashboard = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div
      className={commonClasses.commonPageHeaderContainer}
      data-testid="deployments-container"
    >
      <Grid
        container
        className={commonClasses.commonPageHeaderGrid}
        spacing={2}
      >
        <Grid item>
          <CloudIcon className={commonClasses.commonPageHeaderIcon} />
        </Grid>
        <Grid item>
          <Typography
            id="ENVIRONMENT_TITLE"
            variant="h4"
            className={commonClasses.commonPageHeaderText}
          >
            {t("Environments")}
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.boxWrapper}>
        <EnvironmentSection />
      </div>
    </div>
  );
};

export default EnvironmentDashboard;
