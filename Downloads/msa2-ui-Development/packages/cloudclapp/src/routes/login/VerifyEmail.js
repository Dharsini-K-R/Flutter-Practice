import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { EnvelopeIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import ReturnToLoginButton from "./ReturnToLoginButton";

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    verifyEmail: {
      padding: 30,
    },
    verifyEmailMailIcon: {
      color: palette.text.primary,
      fontSize: "48px",
    },
    verifyEmailMailIconBackground: {
      backgroundColor: palette.background.icon,
      borderRadius: 40,
      height: 80,
      width: 80,
    },
    verifyEmailSubTitle: {
      color: palette.text.primary,
      fontWeight: 500,
      fontSize: 18,
      margin: "18px 0",
    },
    verifyEmailCaption: {
      fontSize: 16,
      maxWidth: 300,
      lineHeight: "24px",
    },
    returnToLogin: {
      marginTop: 30,
    },
  };
});

const Mail = () => {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid
        container
        className={classes.verifyEmailMailIconBackground}
        alignItems="center"
        justifyContent="center"
      >
        <EnvelopeIcon className={classes.verifyEmailMailIcon} />
      </Grid>
    </Grid>
  );
};

const VerifyEmail = ({ mail }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <Grid
      className={classnames(
        classes.verifyEmail,
        commonClasses.commonLoginFormWrapper,
      )}
    >
      <Mail />
      <Typography className={classes.verifyEmailSubTitle}>
        {t("Verify email address")}
      </Typography>
      <Grid container direction="column" alignItems="center">
        <Typography
          variant="caption"
          className={classes.verifyEmailCaption}
          component="div"
        >
          {t(
            "Please check your inbox and click on the link to verify your email address",
          )}
        </Typography>
        <Typography className={commonClasses.commonTextBold}>{mail}</Typography>
      </Grid>
      <ReturnToLoginButton className={classes.returnToLogin} />
    </Grid>
  );
};

export default VerifyEmail;
