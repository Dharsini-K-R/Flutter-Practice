import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
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
import useApi from "cloudclapp/src/hooks/useApi";
import {
  changePassword,
  validateChangePasswordLink,
} from "msa2-ui/src/api/auth";
import classNames from "classnames";
import reduxForm from "redux-form/lib/reduxForm";
import { SubmissionError } from "redux-form";
import { reduxFormNames } from "msa2-ui/src/Constants";
import { useSnackbar } from "notistack";
import { EyeIcon, EyeSlashIcon, LockIcon } from "react-line-awesome";
import classnames from "classnames";
import isEmpty from "lodash/isEmpty";
import InputField from "cloudclapp/src/components/controls/InputField";
import useTogglePassword from "msa2-ui/src/hooks/useTogglePassword";

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
      paddingTop: "35px",
      paddingBottom: "35px",
    },
    textSpacing: {
      paddingBottom: "20px",
    },
    changePasswordContainer: {
      direction: "column",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
    },
    containerSize: {
      minHeight: 300,
    },
    formError: {
      marginTop: 3,
      width: 325,
    },
  };
});

const ChangePasswordDialog = ({ onClose, handleSubmit: onSubmit }) => {
  const { t } = useTranslation();
  const commonClasses = useCommonStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { hash } = useParams();
  const classes = useStyles();

  const [formErrors, setFormErrors] = useState({});

  const [showPassword, PasswordInputAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const [
    showConfirmPassword,
    ConfirmPasswordInputAdornment,
  ] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const validationErrors = () => {
    const errors = {
      newPassword: isEmpty(formData.newPassword)
        ? t("New Password is required")
        : undefined,
      passwordConfirmation: isEmpty(formData.passwordConfirmation)
        ? t("Password Confirmation is required")
        : undefined,
    };

    setFormErrors(errors);

    return Object.values(errors).some((value) => Boolean(value));
  };

  const [formData, setFormData] = useState({
    newPassword: undefined,
    passwordConfirmation: undefined,
  });

  const [isLoading, isError] = useApi(validateChangePasswordLink, {
    hash,
  });

  const handleChangePassword = async () => {
    if (!validationErrors()) {
      if (formData.newPassword !== formData.passwordConfirmation) {
        setFormErrors({
          ...formErrors,
          passwordConfirmation: t("Passwords do not match"),
        });

        throw new SubmissionError({
          formErrors,
        });
      }

      const password = formData.newPassword;
      const [error] = await changePassword({ password, hash });

      if (error) {
        return enqueueSnackbar(
          error.getMessage(t("Unable to change password")),
          {
            variant: "error",
          },
        );
      }

      enqueueSnackbar(t("Password has been changed"), { variant: "success" });
      onClose();
    }
  };

  const renderDialogContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }

    if (isError) {
      return (
        <Grid item xs={10}>
          <Typography id="CHANGE_PASSWORD_ERROR" variant="body1" align="center">
            {t("Unable to change password")}.
          </Typography>
          <Typography
            id="INVALID_CHANGE_PASSWORD_LINK"
            variant="body1"
            align="center"
          >
            {t("Invalid link")}.
          </Typography>
        </Grid>
      );
    }

    return (
      <Grid
        item
        container
        spacing={2}
        className={classes.changePasswordContainer}
      >
        <Grid item xs={8}>
          <LockIcon
            className={`${classes.lockIcon} ${commonClasses.commonPageHeaderIcon}`}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography
            id="CHANGE_PASSWORD_DIALOG_MSG"
            variant="h6"
            align="center"
          >
            {t("Enter New Password")}
          </Typography>
        </Grid>

        <Grid item xs={8}>
          <Typography
            id="CHANGE_PASSWORD_DIALOG_MSG_NOT_INITIALIZED"
            variant="body1"
            align="center"
            className={classes.textSpacing}
          >
            {t(
              "Your new password must be different from your previous password.",
            )}
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <InputField
            id="CHANGE_PWD_PASSWORD_FIELD"
            autoComplete="on"
            error={formErrors.newPassword}
            label={t("New password")}
            width={325}
            onChange={({ target: { value: newPassword } }) => {
              setFormData({
                ...formData,
                newPassword,
              });
              setFormErrors({
                ...formErrors,
                newPassword: isEmpty(newPassword)
                  ? t("New Password is required")
                  : undefined,
              });
            }}
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
        <Grid item xs={7}>
          <InputField
            id="CHANGE_PWD_CONFIRMATION_FIELD"
            autoComplete="on"
            error={formErrors.passwordConfirmation}
            label={t("Confirm Password")}
            width={325}
            onChange={({ target: { value: passwordConfirmation } }) => {
              setFormData({
                ...formData,
                passwordConfirmation,
              });
              setFormErrors({
                ...formErrors,
                passwordConfirmation: isEmpty(passwordConfirmation)
                  ? t("Password Confirmation is required")
                  : undefined,
              });
            }}
            type={showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: <ConfirmPasswordInputAdornment />,
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
      </Grid>
    );
  };

  return (
    <Dialog
      id="CHANGE_PWD_DIALOG"
      data-testid="CHANGE_PWD_DIALOG"
      open
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      classes={{
        paper: commonClasses.commonDialogPaper,
      }}
    >
      <DialogContent>
        <Grid
          container
          className={`${classes.changePasswordContainer} ${classes.containerSize}`}
        >
          {renderDialogContent()}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actionsSpacing}>
        <Grid container spacing={2} className={classes.changePasswordContainer}>
          <Button
            id="CHANGE_PWD_SUBMIT_BTN"
            variant="contained"
            size="small"
            color="primary"
            className={classNames(
              commonClasses.commonBtn,
              commonClasses.commonBtnPrimary,
            )}
            onClick={onSubmit(handleChangePassword)}
            disabled={isError || isLoading}
          >
            {t("Reset Password")}
          </Button>
          <Button
            id="CHANGE_PWD_CANCEL_BTN"
            data-testid="CHANGE_PWD_BTN_CANCEL"
            variant="text"
            size="small"
            color="default"
            className={classNames(
              commonClasses.commonBtn,
              commonClasses.commonBtnSecondary,
            )}
            onClick={onClose}
          >
            {t("Cancel")}
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

ChangePasswordDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: reduxFormNames.changePasswordForm,
})(ChangePasswordDialog);
