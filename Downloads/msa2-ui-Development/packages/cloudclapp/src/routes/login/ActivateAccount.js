import React from "react";
import {
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { CheckIcon, ExclamationIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { useParams } from "react-router";

import useApi from "cloudclapp/src/hooks/useApi";
import { activate } from "cloudclapp/src/api/user";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import ReturnToLoginButton from "./ReturnToLoginButton";

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    wrapper: {
      padding: 30,
    },
    icon: {
      color: palette.text.primary,
      fontSize: "48px",
    },
    iconBackground: {
      backgroundColor: palette.background.icon,
      borderRadius: 40,
      height: 80,
      width: 80,
    },
    subtitle: {
      color: palette.text.primary,
      fontWeight: 500,
      fontSize: 18,
      margin: "18px 0",
    },
    caption: {
      fontSize: 16,
      maxWidth: 300,
      lineHeight: "24px",
    },
    errorMessage: {
      color: palette.text.error,
    },
    returnToLogin: {
      marginTop: 30,
    },
  };
});

const ActivateAccount = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { activateKey } = useParams();
  const [isLoading = true, error, meta] = useApi(activate, {
    key: activateKey,
  });

  return (
    <Grid
      className={classnames(
        classes.wrapper,
        commonClasses.commonLoginFormWrapper,
      )}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        meta && (
          <>
            <Grid container alignItems="center" justifyContent="center">
              <Grid
                container
                className={classes.iconBackground}
                alignItems="center"
                justifyContent="center"
              >
                {error ? (
                  <ExclamationIcon className={classes.icon} />
                ) : (
                  <CheckIcon className={classes.icon} />
                )}
              </Grid>
            </Grid>

            <Typography className={classes.subtitle}>
              {error ? t("Activation Failed") : t("Activated!")}
            </Typography>
            <Grid container direction="column" alignItems="center">
              {error ? (
                <>
                  <Typography
                    variant="caption"
                    className={classes.caption}
                    component="div"
                  >
                    {t("Failed to activate your account.")}
                  </Typography>
                  <Typography className={classes.errorMessage}>
                    [{error.getMessage()}]
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="caption"
                  className={classes.caption}
                  component="div"
                >
                  {t("Your account is successfully activated.")}
                </Typography>
              )}
            </Grid>

            <ReturnToLoginButton className={classes.returnToLogin} />
          </>
        )
      )}
    </Grid>
  );
};

export default ActivateAccount;
