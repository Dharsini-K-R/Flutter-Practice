import React from "react";
import { Grid, Typography, Card, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { PlusCircleIcon } from "react-line-awesome";
import { getEnvironments } from "cloudclapp/src/store/designations";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import EnvironmentCards from "../dashboard/EnvironmentCards";
import { ENVIRONMENT_COMMUNITY_ACCOUNT } from "cloudclapp/src/Constants";
import { useHistory } from "react-router-dom";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => {
  return {
    loadingCard: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "220px",
      borderRadius: "10px",
    },
    flexCenter: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    createEnvCard: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "97%",
      minHeight: "500px",
      backgroundColor: palette.background.cardGrey,
      borderRadius: "10px",
      cursor: "pointer",
    },
    addIcon: {
      color: palette.primary.main,
      fontSize: "39px",
    },
    addEnvText: {
      fontWeight: "500",
      paddingLeft: "5px",
      color: palette.secondary.main,
    },
  };
});

const EnvironmentSection = ({ sort }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const collator = new Intl.Collator(undefined, { caseFirst: "upper" });

  const environments = useSelector(getEnvironments());

  const canCreateEnvironment = useSelector(
    getPermission("environments", "general", "create"),
  );

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
    >
      {[...environments]
        .slice()
        .sort((a, b) => collator.compare(a[sort], b[sort]))
        .map((data, index) => {
          return <EnvironmentCards key={index} input={data} />;
        })}
      {canCreateEnvironment && (
        <Grid item xl={3} lg={4} md={6} sm={12} xs={12}>
          {environments.length < ENVIRONMENT_COMMUNITY_ACCOUNT.count ? (
            <Card
              className={classes.createEnvCard}
              onClick={() => {
                history.push("/environments/create");
              }}
            >
              <PlusCircleIcon className={classes.addIcon} />
              <Typography
                gutterBottom
                variant="h5"
                className={classes.addEnvText}
              >
                {t("Create New Environment")}
              </Typography>
            </Card>
          ) : (
            <Tooltip
              title={t(
                "With a Community Account, you cannot add more than 5 environments.",
              )}
            >
              <Card className={classes.createEnvCard}>
                <PlusCircleIcon className={classes.addIcon} />
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classes.addEnvText}
                >
                  {t("Create New Environment")}
                </Typography>
              </Card>
            </Tooltip>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default EnvironmentSection;
