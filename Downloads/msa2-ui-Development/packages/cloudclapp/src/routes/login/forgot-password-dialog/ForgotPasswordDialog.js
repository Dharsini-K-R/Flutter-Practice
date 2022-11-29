import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  DialogActions,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { forgotPassword } from "msa2-ui/src/api/auth";
import { ReactComponent as SentEmailIcon } from "cloudclapp/src/assets/img/sent.svg";
import { useSnackbar } from "notistack";
import { status } from "msa2-ui/src/api/constants";
import { LockIcon } from "react-line-awesome";
import InputField from "cloudclapp/src/components/controls/InputField";

const useStyles = makeStyles(({ palette, breakpoints }) => {
  return {
    lockIcon: {
      backgroundColor: "rgba(68,93,110,0.1)",
      opacity: 0.9,
      borderRadius: "50%",
      height: "75px",
      width: "75px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    actionsSpacing: {
      paddingTop: "5px",
      paddingBottom: "35px",
    },
    textSpacing: {
      paddingBottom: "20px",
    },
    forgotPasswordContainer: {
      direction: "column",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
    },
    containerSize: {
      minHeight: 300,
    },
  };
});

const REQUEST_STATUS = {
  OK: "OK",
  NOT_FOUND: "NOT_FOUND",
  NOT_INITIALIZED: "NOT_INITIALIZED",
  PENDING: "PENDING",
};

const ForgotPasswordDialog = ({ userName: initialUserName = "", onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const commonClasses = useCommonStyles();
  const classes = useStyles();

  const { t } = useTranslation();
  const [userName, setUserName] = useState(initialUserName);

  const [requestStatus, setRequestStatus] = useState(
    REQUEST_STATUS.NOT_INITIALIZED,
  );

  const handleSend = async () => {
    setRequestStatus(REQUEST_STATUS.PENDING);

    const urlContext = process.env.PUBLIC_URL;

    const [error] = await forgotPassword({ userName, ccla: true, urlContext });

    if (error?.statusCode === status.NOT_FOUND) {
      return setRequestStatus(REQUEST_STATUS.NOT_FOUND);
    }

    // some generic error
    if (error) {
      enqueueSnackbar(error.getMessage(), {
        variant: "error",
      });
      return onClose();
    }

    setRequestStatus(REQUEST_STATUS.OK);
  };

  return (
    <Dialog
      data-testid="FORGOT_PASSWORD_DIALOG"
      id="FORGOT_PASSWORD_DIALOG"
      open
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="forgot-password-dialog-title"
      aria-describedby="forgot-password-dialog-success"
      classes={{
        paper: commonClasses.commonDialogPaper,
      }}
    >
      <DialogContent>
        <Grid
          container
          className={`${classes.forgotPasswordContainer} ${classes.containerSize}`}
        >
          <Grid
            item
            container
            spacing={2}
            className={classes.forgotPasswordContainer}
          >
            {requestStatus === REQUEST_STATUS.NOT_INITIALIZED && (
              <>
                <Grid item xs={8}>
                  <LockIcon
                    className={`${classes.lockIcon} ${commonClasses.commonPageHeaderIcon}`}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    id="FORGOT_PASSWORD_DIALOG_MSG"
                    variant="h6"
                    align="center"
                  >
                    {t("Forgot Password")}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    id="FORGOT_PASSWORD_DIALOG_MSG_NOT_INITIALIZED"
                    variant="body1"
                    align="center"
                    className={classes.textSpacing}
                  >
                    {t(
                      "Enter your email address and and we will send you a link to reset your password.",
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <InputField
                    data-testid="FORGOT_PASSWORD_DIALOG_INPUT"
                    id="FORGOT_PASSWORD_INPUT"
                    autoComplete="on"
                    label={t("Email Address")}
                    value={userName}
                    width={325}
                    onChange={({ target }) => setUserName(target.value)}
                  />
                </Grid>
              </>
            )}

            {requestStatus === REQUEST_STATUS.PENDING && <CircularProgress />}

            {requestStatus === REQUEST_STATUS.OK && (
              <>
                <Grid item xs={10}>
                  <SentEmailIcon />
                </Grid>
                <br />
                <Grid item xs={10}>
                  <Typography
                    variant="body1"
                    id="FORGOT_PASSWORD_DIALOG_MSG_SUCCESS"
                    align="center"
                  >
                    {t("email sent", { userName })}
                  </Typography>
                </Grid>
                <br />
                <Grid item xs={10}>
                  <Typography id="CONTACT_ADMIN" variant="body2" align="center">
                    {t(
                      "Don't see the email? Please contact your administrator.",
                    )}
                  </Typography>
                </Grid>
              </>
            )}

            {requestStatus === REQUEST_STATUS.NOT_FOUND && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    id="FORGOT_PASSWORD_DIALOG_MSG_FAIL"
                    align="center"
                  >
                    {t("There is no email address associated to user", {
                      userName,
                    })}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actionsSpacing}>
        <Grid container spacing={2} className={classes.forgotPasswordContainer}>
          <Button
            id="FORGOT_PASSWORD_DIALOG_SEND_LINK"
            variant="contained"
            size="small"
            color="primary"
            className={classNames(
              commonClasses.commonBtn,
              commonClasses.commonBtnPrimary,
            )}
            onClick={handleSend}
            disabled={
              !userName || requestStatus !== REQUEST_STATUS.NOT_INITIALIZED
            }
          >
            {t("Reset Password")}
          </Button>
          <Button
            id="FORGOT_PASSWORD_DIALOG_CANCEL"
            variant="text"
            size="small"
            color="default"
            className={classNames(
              commonClasses.commonBtn,
              commonClasses.commonBtnSecondary,
            )}
            onClick={onClose}
          >
            {t("Back to Login")}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

ForgotPasswordDialog.propTypes = {
  userName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordDialog;
