import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import useDialog from "cloudclapp/src/hooks/useDialog";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import InviteUsers from "./InviteUsers";
import {
  editOrganisationName,
  deleteOrganisation,
} from "cloudclapp/src/api/settings";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  FormControl,
  TextField,
  makeStyles,
} from "@material-ui/core";
import {
  getOrganisation,
  getOrganisationName,
  fetchOrganisationList,
  fetchEnvironmentSummary,
} from "cloudclapp/src/store/designations";
import { userRoles, getUserRole } from "cloudclapp/src/store/auth";
import usePostApi from "cloudclapp/src/hooks/usePostApi";

const useStyles = makeStyles(({ palette }) => ({
  listItem: {
    color: palette.text.primary,
  },
  listItemIcon: {
    color: palette.text.primary,
    fontSize: 24,
    minWidth: 40,
  },
  listItemText: {
    "& span": {
      fontSize: "14px",
      fontWeight: 500,
    },
  },
}));

const Settings = ({ onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [showEditOrgName, EditOrgName] = useDialog();
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showDeleteOrg, DeleteOrg] = useDialog();

  const organisation = useSelector(getOrganisation);
  const orgName = useSelector(getOrganisationName);
  const userRole = useSelector(getUserRole);
  const isLoginUserSuperAdmin = userRole === userRoles.PRIVILEGED_ADMINISTRATOR;

  const [editOrgName, setOrgName] = useState(organisation?.name);
  const prefix = organisation?.prefix;

  const MenuItems = [
    {
      id: "DASHBOARD_SETTINGS_EDIT_ORGANISATIONA_NAME",
      label: "Edit Organisation Name",
      onClick: showEditOrgName,
    },
    {
      id: "DASHBOARD_SETTINGS_ACCOUNTS",
      label: "Accounts",
      onClick: setShowAccountDialog,
    },
    {
      id: "DASHBOARD_SETTINGS_DELETE_ORGANISATION",
      label: "Delete Organisation",
      onClick: showDeleteOrg,
      disabled: !isLoginUserSuperAdmin,
    },
  ];

  const onDeleteSuccess = () => {
    dispatch(fetchOrganisationList());
  };

  const onUpdateSuccess = () => {
    dispatch(fetchOrganisationList());
    dispatch(fetchEnvironmentSummary);
  };

  const [handleDelete, isDeleting, deleteError] = usePostApi(
    deleteOrganisation,
    { prefix },
    onDeleteSuccess,
  );

  const [handleEdit, isUpdating, updateError] = usePostApi(
    editOrganisationName,
    { name: editOrgName, prefix },
    onUpdateSuccess,
  );

  return (
    <>
      <Dialog
        id="ORGANISATION_SETTINGS"
        maxWidth="xs"
        onClose={onClose}
        title={t("Organisation Settings")}
      >
        <List>
          {MenuItems.map((item) => (
            <ListItem
              key={item.id}
              id={item.id}
              button
              className={classes.listItem}
              style={item.itemStyle}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              <ListItemText
                className={classes.listItemText}
                primary={t(item.label)}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
      <EditOrgName
        id="EDIT_ORGANISATION"
        title={t("Edit Organisation Name")}
        maxWidth={"sm"}
        onExec={() => {
          handleEdit();
        }}
        disabled={isUpdating}
      >
        <Grid className={classes.gridSpacing}>
          <FormControl>
            <TextField
              type={"text"}
              id="ORGANISATION_EDIT_NAME"
              value={editOrgName}
              onChange={(event) => {
                setOrgName(event.target.value);
              }}
              hyperText={updateError}
            />
          </FormControl>
        </Grid>
      </EditOrgName>
      {showAccountDialog && (
        <InviteUsers onClose={() => setShowAccountDialog(false)} />
      )}
      <DeleteOrg
        id="DELETE_ORGANISATION"
        title={t("Delete Organisation")}
        maxWidth={"sm"}
        content={t("Are you sure you want to delete organaisation?", {
          name: orgName,
        })}
        onExec={() => {
          handleDelete();
        }}
        disabled={isDeleting}
        errorContent={deleteError?.getMessage(
          t("Unable to delete Organisation"),
        )}
      />
    </>
  );
};

export default Settings;
