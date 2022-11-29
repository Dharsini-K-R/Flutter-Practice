import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import useTogglePassword from "msa2-ui/src/hooks/useTogglePassword";
import { EyeIcon, EyeSlashIcon } from "react-line-awesome";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { getToken, updateUserDetails } from "cloudclapp/src/store/auth";
import { useSelector, useDispatch } from "react-redux";

import { updateManager } from "cloudclapp/src/api/manager";
import Validation from "msa2-ui/src/services/Validation";
import { useSnackbar } from "notistack";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";

const useStyles = makeStyles((theme) => {
  const { spacing } = theme;

  return {
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    formField: {
      margin: `${spacing(1)}px 0`,
      textAlign: "left",
      weight: "100%",
    },
    boxStyle: {
      display: "flex",
      flexDirection: "column",
      p: 2,
    },
  };
});

const AccountSettings = ({ initialValues, onClose }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const token = useSelector(getToken);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [formErrors, setFormErrors] = useState({});
  const [userPass, setUserPass] = useState(undefined);
  const [userCnfPass, setUserCnfPass] = useState(undefined);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState(initialValues);

  const [showCnfPassword, PasswordCnfInputAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const [showPassword, PasswordInputAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const onSave = async () => {
    if (!validationErrors()) {
      setDisabled(true);
      const [error] = await updateManager({
        token,
        id: formData.id,
        name: formData.name,
        email: formData.address.mail,
        username: formData.login,
        password: userPass,
        attachedCustomerIds: formData.attachedCustomerIds,
        attachedOperatorIds: formData.attachedOperatorIds,
        manager: {
          ...formData,
          address: {
            ...omit(formData.address, "mail"),
          },
        },
      });
      const message = error ? error.getMessage() : t("Account updated");
      enqueueSnackbar(message, {
        variant: error ? "error" : "success",
        action: (key) => (
          <SnackbarAction id={key} handleClose={closeSnackbar} />
        ),
      });
      if (!error) {
        dispatch(
          updateUserDetails({
            ...formData,
          }),
        );
        onClose();
      }
      setDisabled(false);
    }
  };

  const validationErrors = () => {
    const validateConfirmPassword = (password, confirmPassword) => {
      return !isEqual(password, confirmPassword) && t("Passwords do not match");
    };

    const validateEmail = (email) => {
      if (isEmpty(email)) {
        return t("This field is required.");
      }
      if (!Validation.validEmail(email)) {
        return t("Invalid email address");
      }
      return false;
    };

    const errors = {
      ...formErrors,
      name: isEmpty(formData.name) ? t("Name is required") : undefined,
      mail: validateEmail(formData.address.mail),
      cnfPassword:
        userPass !== undefined || userCnfPass !== undefined
          ? validateConfirmPassword(userPass, userCnfPass)
          : null,
    };

    setFormErrors(errors);
    return !Object.values(errors).every((value) => !value);
  };

  return (
    <Dialog
      id="ACC_SETTINGS"
      maxWidth="md"
      onClose={onClose}
      title={t("Account Settings")}
      disabled={disabled}
      onExec={onSave}
      execLabel={t("Save")}
      data-testid="account-settings-dialog"
    >
      <Box className={classes.boxStyle}>
        <Grid className={classes.flexSpaceBtw}>
          <Grid item>
            <Typography variant="body1" id="ACC_SETTINGS_LABEL_NAME">
              {t("Name")}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              size="small"
              error={formErrors.name}
              value={formData.name || ""}
              onChange={({ target: { value: name } }) => {
                setFormData({ ...formData, name });
              }}
              variant="outlined"
              id={"ACC_SETTINGS_NAME"}
              label={null}
              className={classes.formField}
              fullWidth={true}
              helperText={formErrors.name || null}
            />
          </Grid>
        </Grid>
        <Grid className={classes.flexSpaceBtw}>
          <Grid item>
            <Typography variant="body1" id="ACC_SETTINGS_LABEL_EMAIL">
              {t("Email")}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              size="small"
              error={formErrors.mail}
              value={formData.address.mail || ""}
              onChange={({ target: { value: mail } }) => {
                setFormData({
                  ...formData,
                  address: { ...formData.address, mail: mail },
                });
              }}
              variant="outlined"
              id={"ACC_SETTINGS_EMAIL"}
              label={null}
              className={classes.formField}
              fullWidth={true}
              helperText={formErrors.mail || null}
            />
          </Grid>
        </Grid>
        <Grid className={classes.flexSpaceBtw}>
          <Grid item>
            <Typography variant="body1" id="ACC_SETTINGS_LABEL_LOGIN_ID">
              {t("Login ID")}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              size="small"
              value={formData.login || ""}
              onChange={({ target: { value: login } }) => {
                setFormData({ ...formData, login });
              }}
              disabled
              variant="outlined"
              id={"ACC_SETTINGS_LOGIN_ID"}
              label={null}
              className={classes.formField}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid className={classes.flexSpaceBtw}>
          <Grid item>
            <Typography variant="body1" id="ACC_SETTINGS_LABEL_PASSWORD">
              {t("Password")}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              size="small"
              value={userPass || ""}
              onChange={({ target: { value } }) => {
                setUserPass(value);
              }}
              error={formErrors.cnfPassword}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              id={"ACC_SETTINGS_PASSWORD"}
              label={null}
              className={classes.formField}
              fullWidth={true}
              InputProps={{
                endAdornment: <PasswordInputAdornment />,
              }}
            />
          </Grid>
        </Grid>
        <Grid className={classes.flexSpaceBtw}>
          <Grid item>
            <Typography variant="body1" id="ACC_SETTINGS_LABEL_CONF_PASSWORD">
              {t("Confirm Password")}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              size="small"
              value={userCnfPass || ""}
              onChange={({ target: { value } }) => {
                setUserCnfPass(value);
              }}
              error={formErrors.cnfPassword}
              type={showCnfPassword ? "text" : "password"}
              variant="outlined"
              id={"ACC_SETTINGS_CONF_PASSWORD"}
              label={null}
              className={classes.formField}
              fullWidth={true}
              InputProps={{
                endAdornment: <PasswordCnfInputAdornment />,
              }}
              helperText={formErrors.cnfPassword || null}
            />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default AccountSettings;
