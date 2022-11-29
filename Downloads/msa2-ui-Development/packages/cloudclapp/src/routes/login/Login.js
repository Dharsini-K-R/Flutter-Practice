import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import SignIn from "cloudclapp/src/routes/login/SignIn";
import ActivateAccount from "cloudclapp/src/routes/login/ActivateAccount";
import SignUp from "cloudclapp/src/routes/login/SignUp";
import companyLogo from "cloudclapp/src/assets/icons/companyLogo.png";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    copyrightSection: {
      marginTop: 32,
    },
    copyrightText: {
      fontSize: 12,
      opacity: 0.4,
      margin: 8,
    },
    loginWrapper: {
      color: palette.text.secondary,
      fontSize: 14,
      height: "100%",
    },
    loginContainer: {
      justifyContent: "center",
      flexWrap: "nowrap",
    },
    companyLogo: {
      width: '100px',
    }
  };
});

const Login = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" className={classes.loginWrapper}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container className={classes.loginContainer} direction="column">
          <Switch>
            <Route path="/sign-in" component={SignIn} />
            <Route
              exact
              path="/sign-up/verify/:activateKey"
              component={ActivateAccount}
            />
            <Route exact path="/sign-up" component={SignUp} />
            <Route path="/" component={SignIn}>
            </Route>
          </Switch>
          <Grid
            container
            className={classes.copyrightSection}
            direction="column"
            alignItems="center"
          >
            <img src={companyLogo} alt="UBIQUBE" className={classes.companyLogo} />
            <span className={classes.copyrightText}>
              {t("Copyright 2022. All Rights Reserved. Ubiqube")}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
