import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
} from "@material-ui/core";
import { CloudIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UserButton from "cloudclapp/src/components/user-button";
import { managedEntityStatus } from "msa2-ui/src/Constants";

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    status: {
      color: palette.background.paper,
      textAlign: "center",
      fontSize: "20px",
      padding: "15px",
      fontWeight: "bold",
    },
    user: {
      fontSize: "24px",
      backgroundColor: "rgba(68, 93, 110, 0.1)",
      borderRadius: "20px",
      padding: "2px",
    },
    version: {
      backgroundColor: palette.background.userGrey,
      borderRadius: "20px",
      padding: "2px 10px 2px 10px",
    },
    flexEnd: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    flexCenter: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    card: {
      marginTop: "20px",
      height: "97%",
      minHeight: "500px",
      borderRadius: "10px",
      cursor: "pointer",
    },
    userName: {
      fontWeight: "500",
      paddingLeft: "5px",
    },
    envName: {
      fontWeight: "bold",
      paddingLeft: "7px",
    },
    cloudIcon: {
      fontSize: "35px",
    },
    envDecSpace: {
      minHeight: "70px",
    },
    envData: {
      color: palette.background.subTextGrey,
      fontWeight: "500",
    },
    devTitle: {
      color: theme.typography.body1.color,
    },
    estimate: {
      fontWeight: "500",
      color: palette.text.support,
    },
    usd: {
      color: theme.typography.body1.color,
      marginBottom: "3px",
    },
    cost: {
      fontWeight: "500",
      color: theme.typography.body1.color,
    },
    depCount: {
      fontWeight: "500",
    },
    costTitle: {
      color: theme.typography.body1.color,
    },
  };
});

const EnvironmentCards = ({ input }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const redirectToEnv = () => {
    history.push(`/environments/${input.envId}`);
  };

  return (
    <Grid
      item
      xl={3}
      lg={4}
      md={6}
      sm={12}
      xs={12}
      data-testid="environment-cards"
    >
      <Card className={classes.card} onClick={redirectToEnv}>
        <div
          className={classes.status}
          style={{
            backgroundColor: `${managedEntityStatus[input.status]?.color}`,
          }}
          id={`ENV_CARD_STATUS_${input.envId}`}
        >
          {managedEntityStatus[input.status]?.label}
        </div>
        <CardContent>
          <div className={classes.flexSpaceBtw}>
            <Typography
              gutterBottom
              variant="h6"
              id={`ENV_CARD_VER_${input.envId}_${input.version}`}
              className={classes.version}
            >
              {input.version ?? "V1.0.0"}
            </Typography>
            <div>
              <UserButton
                id={`ENV_CARD_USERNAME_${input.envId}_${input.userName}`}
                userId={input.cclapOwner}
              />
            </div>
          </div>
          <br />
          <div className={classes.flexCenter}>
            <CloudIcon className={classes.cloudIcon} />
            <Typography
              variant="h5"
              id={`ENV_CARD_ENV_NAME_${input.envId}_${input.envName}`}
              className={classes.envName}
            >
              {input.envName}
            </Typography>
          </div>
          <br />
          <div className={classes.envDecSpace}>
            <Typography
              gutterBottom
              variant="subtitle1"
              className={classes.envData}
              id={`ENV_CARD_ENV_DATA_${input.envId}`}
            >
              {input.description}
            </Typography>
          </div>
          <br />
          <div className={classes.devTitle}>
            <Typography variant="subtitle1">{t("Deployments")}</Typography>
            <Typography
              gutterBottom
              variant="h3"
              className={classes.depCount}
              id={`ENV_CARD_DEV_COUNT_${input.envId}`}
            >
              {input.deployments?.length ?? 0}
            </Typography>
          </div>
          {/* <div>
            <Typography
              gutterBottom
              variant="subtitle1"
              className={classes.costTitle}
            >
              {t("Current Cost*")}
            </Typography>
            <div className={classes.flexEnd}>
              <Typography
                variant="h3"
                className={classes.cost}
                id={`ENV_CARD_COST_${input.envId}_${input.cost}`}
              >
                //${input.cost}
                $518.2
              </Typography>
              <Typography variant="h5" className={classes.usd}>
                {t("USD p/m")}
              </Typography>
            </div>
          </div>
          <div>
            <Typography
              gutterBottom
              variant="subtitle2"
              className={classes.estimate}
            >
              {t("*Estimate based on current usage")}
            </Typography>
          </div> */}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default EnvironmentCards;
