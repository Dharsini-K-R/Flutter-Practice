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
import { ReactComponent as SentEmailIcon } from "cloudclapp/src/assets/img/sent.svg";
import { useSnackbar } from "notistack";
import { status } from "msa2-ui/src/api/constants";
import InputField from "cloudclapp/src/components/controls/InputField";
import { getOrganisationId } from "cloudclapp/src/store/designations";
import { useSelector } from "react-redux";
import { inviteUser } from "cloudclapp/src/api/user";
import { getToken } from "cloudclapp/src/store/auth";
import Validation from "msa2-ui/src/services/Validation";

const useStyles = makeStyles(() => {
  return {
    actionsSpacing: {
      paddingTop: "5px",
      paddingBottom: "35px",
    },
    textSpacing: {
      paddingBottom: "20px",
    },
    inviteUserContainer: {
      direction: "column",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
    },
    containerSize: {
      minHeight: 250,
    },
  };
});

const REQUEST_STATUS = {
  OK: "OK",
  NOT_FOUND: "NOT_FOUND",
  NOT_INITIALIZED: "NOT_INITIALIZED",
  PENDING: "PENDING",
};

const InviteUserEmailDialog = ({ onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const commonClasses = useCommonStyles();
  const classes = useStyles();

  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState("");

  const [requestStatus, setRequestStatus] = useState(
    REQUEST_STATUS.NOT_INITIALIZED,
  );

  const orgId = useSelector(getOrganisationId);
  const token = useSelector(getToken);

  const handleSend = async () => {
    if (!Validation.validEmail(userEmail)) {
      enqueueSnackbar(t("Invalid Email Address"), {
        variant: "warning",
      });
      return;
    }

    setRequestStatus(REQUEST_STATUS.PENDING);

    const [error, response] = await inviteUser({
      email: userEmail,
      orgId,
      token,
    });

    if (response?.errorCode === status.NOT_FOUND) {
      return setRequestStatus(REQUEST_STATUS.NOT_FOUND);
    } else if (error) {
      enqueueSnackbar(error.getMessage(), {
        variant: "error",
      });
      return onClose();
    }
    setRequestStatus(REQUEST_STATUS.OK);
  };

  return (
    <Dialog
      data-testid="INVITE_USER_EMAIL_DIALOG"
      id="INVITE_USER_EMAIL_DIALOG"
      open
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="invite-user-email-dialog-title"
      aria-describedby="invite-user-email-dialog-success"
      classes={{
        paper: commonClasses.commonDialogPaper,
      }}
    >
      <DialogContent>
        <Grid
          container
          className={`${classes.inviteUserContainer} ${classes.containerSize}`}
        >
          <Grid
            item
            container
            spacing={2}
            className={classes.inviteUserContainer}
          >
            {requestStatus === REQUEST_STATUS.NOT_INITIALIZED && (
              <>
                <Grid item xs={8}>
                  <Typography
                    id="INVITE_EMAIL_DIALOG_MSG"
                    variant="h6"
                    align="center"
                  >
                    {t("Invite User")}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    id="INVITE_EMAIL_DIALOG_MSG_NOT_INITIALIZED"
                    variant="body1"
                    align="center"
                    className={classes.textSpacing}
                  >
                    {t(
                      "Enter the user's email address and and we will send them a link to active their account.",
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <InputField
                    data-testid="INVITE_USER_DIALOG_INPUT"
                    id="INVITE_USER_INPUT"
                    autoComplete="on"
                    label={t("Email Address")}
                    value={userEmail}
                    width={325}
                    onChange={({ target }) => setUserEmail(target.value)}
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
                    id="INVITE_USER_DIALOG_MSG_SUCCESS"
                    align="center"
                  >
                    {t("Email sent")}
                  </Typography>
                </Grid>
                <br />
                <Grid item xs={10}>
                  <Typography id="CONTACT_ADMIN" variant="body2" align="center">
                    {t(
                      "Invited user can now activate their account by using the email link.",
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
                    id="INVITE_USER_DIALOG_MSG_FAIL"
                    align="center"
                  >
                    {t("There is no email address associated to user", {
                      userEmail,
                    })}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actionsSpacing}>
        <Grid container spacing={2} className={classes.inviteUserContainer}>
          <Button
            id="INVITE_USER_DIALOG_SEND_LINK"
            variant="contained"
            size="small"
            color="primary"
            className={classNames(
              commonClasses.commonBtn,
              commonClasses.commonBtnPrimary,
            )}
            onClick={handleSend}
            disabled={
              !userEmail || requestStatus !== REQUEST_STATUS.NOT_INITIALIZED
            }
          >
            {t("Send Email")}
          </Button>
          <Button
            id="INVITE_USER_DIALOG_CANCEL"
            variant="text"
            size="small"
            color="default"
            className={classNames(
              commonClasses.commonBtn,
              commonClasses.commonBtnSecondary,
            )}
            onClick={onClose}
          >
            {t("Back to Users List")}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

InviteUserEmailDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default InviteUserEmailDialog;
