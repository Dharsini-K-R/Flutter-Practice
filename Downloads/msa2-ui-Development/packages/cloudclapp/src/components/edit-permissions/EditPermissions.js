import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getToken } from "cloudclapp/src/store/auth";
import useApi from "cloudclapp/src/hooks/useApi";
import {
  updatePermissionProfile,
  getPermissionProfileById,
  getAvailableActions,
} from "msa2-ui/src/api/permissionProfiles";
import PermissionsDialog from "cloudclapp/src/components/edit-permissions/PermissionsDialog";
import { Grid } from "@material-ui/core";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(({ spacing }) => ({
  dialogWindow: {
    height: 500,
  },
  commonNoContentWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    fontSize: "15px",
    height: "100%",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

const EditPermissions = ({ profileId, onClose }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const token = useSelector(getToken);

  const [
    profileLoading,
    profileError,
    profile,
  ] = useApi(getPermissionProfileById, { id: profileId, token });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [actions, setActions] = useState({});
  const [loading, , actionsData = {}] = useApi(getAvailableActions, {
    token,
    type: "ccla",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getProfileActions = (profile, actionsData) => {
    const { permissionList } = profile;

    permissionList.forEach((permission) => {
      const {
        right: value,
        categoryName,
        subCategoryName,
        actionName,
      } = permission;

      if (value) {
        if (actionsData[categoryName][subCategoryName][actionName]) {
          actionsData[categoryName][subCategoryName][actionName][
            "value"
          ] = value;
        }
        const subCategoryActions = permissionList.filter(
          (item) =>
            item.categoryName === categoryName &&
            item.subCategoryName === subCategoryName,
        );
        if (
          subCategoryActions.length > 0 &&
          !subCategoryActions.find((action) => action.right === false)
        ) {
          actionsData[categoryName][subCategoryName].value = true;
        }
      }
    });

    return actionsData;
  };

  useEffect(() => {
    const categories = Object.keys(actionsData);
    if (profile && categories.length > 0) {
      if (profileError) {
        enqueueSnackbar(profileError.getMessage("Unable to load profile"), {
          variant: "error",
          action: (key) => (
            <SnackbarAction id={key} handleClose={closeSnackbar} />
          ),
        });
      } else {
        const profileActions = getProfileActions(profile, actionsData);
        setActions(profileActions);
      }
    }
  }, [profile, profileError, actionsData, enqueueSnackbar, closeSnackbar]);

  const onSubmit = async () => {
    setIsSubmitting(true);

    const [error] = await updatePermissionProfile({
      entry: profile,
      actions,
      token,
      id: profileId,
    });

    setIsSubmitting(false);

    const message = error
      ? error.getMessage()
      : t("Permission profile updated");
    enqueueSnackbar(message, {
      variant: error ? "error" : "success",
      action: (key) => <SnackbarAction id={key} handleClose={closeSnackbar} />,
    });
    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog
      onExec={onSubmit}
      execLabel={t("Save")}
      title={t("Edit Permission")}
      maxWidth={"md"}
      disabled={Boolean(profileError) || profileLoading || isSubmitting}
      classes={{ paperScrollPaper: classes.dialogWindow }}
      position={"inherit"}
      onClose={onClose}
    >
      {loading || profileLoading || isEmpty(profile) ? (
        <div className={classes.commonNoContentWrapper}>
          <CircularProgress aria-label={t("Loading")} />
        </div>
      ) : (
        <Grid container direction="column" style={{ position: "absolute" }}>
          <PermissionsDialog
            actions={actions}
            setActions={setActions}
            permissionsList={profile?.permissionList.filter(
              (permission) => permission.subCategoryName === "labels",
            )}
          />
        </Grid>
      )}
    </Dialog>
  );
};

export default EditPermissions;
