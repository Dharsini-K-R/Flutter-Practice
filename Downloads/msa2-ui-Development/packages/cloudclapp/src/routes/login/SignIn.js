import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import {
  Button,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

import { useHistory, Route, Switch } from "react-router-dom";

import isEmpty from "lodash/isEmpty";

import { EyeIcon, EyeSlashIcon } from "react-line-awesome";

import useTogglePassword from "msa2-ui/src/hooks/useTogglePassword";
import { signIn } from "cloudclapp/src/store/auth";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import AppLogo from "cloudclapp/src/components/app/AppLogo";
import InputField from "cloudclapp/src/components/controls/InputField";
import ForgotPasswordDialog from "./forgot-password-dialog";
import ChangePasswordDialog from "./change-password-dialog";

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    button: {
      minWidth: 160,
    },
    form: {
      marginTop: 30,
    },
    formError: {
      marginTop: 3,
      width: 300,
    },
    formItem: {
      display: "flex",
      alignItems: "center",
    },
    [breakpoints.down("sm")]: {
      loginForm: {
        minWidth: 380,
      },
    },
    loginFormSignIn: {
      padding: "30px 30px 20px 30px",
      borderBottom: "1px solid rgba(178,188,206,0.2)",
    },
    loginFormSignUp: {
      padding: "20px 30px 30px 30px",
    },
    logo: {
      marginBottom: 32,
    },
    subTitle: {
      color: palette.text.primary,
      fontWeight: 500,
      fontSize: 18,
    },
    signUpCaption: {
      fontSize: 14,
      maxWidth: 250,
      lineHeight: "20px",
    },
    title: {
      color: palette.text.primary,
    },
  };
});

export const routes = {
  login: "/sign-in",
  forgotPassword: "/sign-in/forgot-password",
  changePassword: "/sign-in/change-password/:hash",
};

const SignIn = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    userMail: undefined,
    userPassword: undefined,
  });

  const [formErrors, setFormErrors] = useState({});

  const [showPassword, PasswordInputAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const validationErrors = () => {
    const errors = {
      userMail: isEmpty(formData.userMail)
        ? t("Email Address is required")
        : undefined,
      userPassword: isEmpty(formData.userPassword)
        ? t("Password is required")
        : undefined,
    };

    setFormErrors(errors);

    return Object.values(errors).some((value) => Boolean(value));
  };

  const handleSubmit = async () => {
    if (!validationErrors()) {
      setIsLoading(true);

      const [error, response] = await signIn({
        username: formData.userMail,
        password: formData.userPassword,
        logInAsOperator: true,
      })(dispatch);

      if (error) {
        setFormErrors({
          ...formErrors,
          signIn: response?.message,
        });

        console.error(response?.message);
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    history.push(routes.forgotPassword);
  };

  const handleForgotPasswordDialogClose = () => {
    history.push(routes.login);
    setFormData({ userMail: "", userPassword: "" });
  };

  const handleChangePasswordDialogClose = () => history.push(routes.login);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      return handleSubmit();
    }
  };

  return (
    <>
      <Grid item className={commonClasses.commonLoginFormWrapper}>
        <Switch>
          <Route
            exact
            path={routes.forgotPassword}
            render={() => (
              <ForgotPasswordDialog
                userName={formData.userMail}
                onClose={handleForgotPasswordDialogClose}
              />
            )}
          />
          <Route
            exact
            path={routes.changePassword}
            render={() => (
              <ChangePasswordDialog onClose={handleChangePasswordDialogClose} />
            )}
          />
        </Switch>
        <Grid
          container
          direction="column"
          alignItems="center"
          item
          className={classes.loginFormSignIn}
        >
          <Grid item>
            <AppLogo className={classes.logo} />
          </Grid>
          <Typography className={classes.subTitle}>
            {t("Member Login")}
          </Typography>
          <form className={classes.form}>
            <Grid container direction="column" alignItems="center" spacing={2}>
              <Grid
                item
                container
                direction="column"
                className={classes.formItem}
              >
                <InputField
                  required
                  id="SIGN_IN_EMAIL_INPUT"
                  disabled={isLoading}
                  error={formErrors.userMail}
                  label={t("Email Address")}
                  value={formData.userMail || ""}
                  onChange={({ target: { value: userMail } }) => {
                    setFormData({ ...formData, userMail });
                    setFormErrors({
                      ...formErrors,
                      userMail: isEmpty(userMail)
                        ? t("Email Address is required")
                        : undefined,
                    });
                  }}
                  onKeyDown={handleKeyDown}
                  FormHelperTextProps={{
                    error: true,
                    className: classnames(
                      classes.formError,
                      commonClasses.commonTextItalic,
                    ),
                  }}
                />
              </Grid>
              <Grid item className={classes.formItem}>
                <InputField
                  required
                  id="SIGN_IN_PASSWORD_INPUT"
                  disabled={isLoading}
                  autoComplete="on"
                  error={formErrors.userPassword}
                  label={t("Password")}
                  value={formData.userPassword || ""}
                  onChange={({ target: { value: userPassword } }) => {
                    setFormData({
                      ...formData,
                      userPassword,
                    });
                    setFormErrors({
                      ...formErrors,
                      userPassword: isEmpty(userPassword)
                        ? t("Password is required")
                        : undefined,
                    });
                  }}
                  onKeyDown={handleKeyDown}
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: <PasswordInputAdornment />,
                  }}
                  FormHelperTextProps={{
                    error: true,
                    className: classnames(
                      classes.formError,
                      commonClasses.commonTextItalic,
                    ),
                  }}
                />
              </Grid>
              {formErrors.signIn && (
                <Grid item>
                  <Typography
                    align="left"
                    color="error"
                    variant="caption"
                    className={classnames(
                      classes.formError,
                      commonClasses.commonTextItalic,
                    )}
                  >
                    {formErrors.signIn}
                  </Typography>
                </Grid>
              )}
              <Grid item>
                {isLoading ? (
                  <CircularProgress size={36} />
                ) : (
                  <Button
                    id="SIGN_IN_SUBMIT_BUTTON"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmit}
                  >
                    {t("Login")}
                  </Button>
                )}
              </Grid>
              <Grid item>
                <span>
                  <Button
                    color="primary"
                    onClick={handleForgotPassword}
                    id="FORGOT_PASSWORD_BTN_FORGOT_PASSWORD"
                    tabIndex="-1"
                  >
                    {t("Forgot Password?")}
                  </Button>
                </span>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          className={classes.loginFormSignUp}
          spacing={2}
        >
          <Grid item className={classes.formItem}>
            <Typography className={classes.subTitle}>
              {t("Don't have an account?")}
            </Typography>
          </Grid>
          <Grid item className={classes.formItem}>
            <Typography variant="caption" className={classes.signUpCaption}>
              {t("Click below to register an sign up today and get started!")}
            </Typography>
          </Grid>
          <Grid item className={classes.formItem}>
            <Button
              disabled={isLoading}
              component={RouterLink}
              id="SIGN_IN_GET_STARTED_BUTTON"
              variant="contained"
              color="secondary"
              className={classes.button}
              to={{
                pathname: `/sign-up`,
              }}
            >
              {t("Get Started")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SignIn;
