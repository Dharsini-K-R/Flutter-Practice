import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

import Dialog from "cloudclapp/src/components/dialog/Dialog";

import { getToken } from "cloudclapp/src/store/auth";
import { getUserList } from "cloudclapp/src/store/designations";
import Radio from "msa2-ui/src/components/connectedFormComponents/Radio";
import useDialog from "cloudclapp/src/hooks/useDialog";
import { changeOwner } from "cloudclapp/src/api/environment";
import { useSnackbar } from "notistack";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";

const useStyles = makeStyles(() => {
  return {
    userList: {
      textAlign: "left",
    },
  };
});
const ChangeOwnershipDialog = ({
  onClose,
  currentOwner,
  envName,
  envId,
  onExec,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const userList = useSelector(getUserList);

  const [showConfirmationDialog, ConfirmationDialog] = useDialog();
  const [ownerId, setOwnerId] = useState(currentOwner);
  const [ownerName, setOwnerName] = useState("");

  const handleChange = (value) => {
    setOwnerId(Number(value));
    const selectedUser = userList.find((user) => user.id === Number(value));
    setOwnerName(selectedUser.name);
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const token = useSelector(getToken);
  const changeOwnership = async () => {
    const [error] = await changeOwner({ token, envId, ownerId });
    const message = error
      ? t(`Unable to change ownership of ${envName} to ${ownerName}`)
      : t(`Ownership of ${envName} has been changed to ${ownerName}`);
    const variant = error ? "error" : "success";
    enqueueSnackbar(message, {
      variant,
      action: (key) => <SnackbarAction id={key} handleClose={closeSnackbar} />,
    });
    onExec();
    onClose();
  };

  return (
    <>
      <ConfirmationDialog
        title={t("Change Ownership")}
        content={`${t(
          `Are you sure you want to delegate ownership of ${envName} to ${ownerName}?`,
        )}`}
        onExec={changeOwnership}
      />
      <Dialog
        maxWidth="sm"
        onClose={onClose}
        title={t("Change Ownership")}
        onExec={() => {
          showConfirmationDialog(true);
        }}
        disabled={ownerId === currentOwner}
      >
        <Grid container item className={classes.userList}>
          <Radio
            input={{
              onChange: (value) => {
                handleChange(value);
              },
              value: ownerId,
            }}
            options={userList.map(({ id, name }, i) => ({
              id,
              value: id,
              displayName: name || `User ${i} (${t("No name")})`,
            }))}
            className={classes.formField}
            flexdirection="column"
          />
        </Grid>
      </Dialog>
    </>
  );
};

export default ChangeOwnershipDialog;
