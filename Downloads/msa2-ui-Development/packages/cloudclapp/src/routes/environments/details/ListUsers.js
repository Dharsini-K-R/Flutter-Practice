import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getToken } from "cloudclapp/src/store/auth";
import { useSnackbar } from "notistack";
import { uniq, omit } from "lodash";

import {
  makeStyles,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import AddItemsButton from "cloudclapp/src/components/add-items-button/AddItemsButton";

import { userRoles, getUserRole } from "cloudclapp/src/store/auth";
import { getUserList } from "cloudclapp/src/store/designations";
import { updateManager } from "cloudclapp/src/api/manager";

const useStyles = makeStyles(({ palette }) => {
  return {
    flexCenter: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: "20px",
    },
    username: {
      fontColor: palette.text.primary,
      fontWeight: 700,
      fontSize: 14,
    },
    email: {
      fontWeight: 400,
      fontSize: 12,
    },
  };
});

const ListUsers = ({
  environmentId,
  environmentName,
  onClose,
  environmentUsers,
  reloadEnvironmentUsersList,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const userList = useSelector(getUserList);
  const userRole = useSelector(getUserRole);
  const isLoginUserRestrictedManager = userRole >= userRoles.MANAGER;
  const [deleteUser, setDeleteUser] = useState({});
  const [isUserDelete, setIsUserDelete] = useState(false);
  const [showUserInvite, setShowUserInvite] = useState(false);
  const token = useSelector(getToken);
  const { enqueueSnackbar } = useSnackbar();
  const [managerArrayToAssociate, setManagerArrayToAssociate] = useState([]);

  const addItemsCallBack = (id) => {
    setManagerArrayToAssociate([...managerArrayToAssociate, id]);
  };

  const removeItemsCallBack = (id) => {
    const filteredManagers = managerArrayToAssociate.filter(
      (managerId) => managerId !== id,
    );
    setManagerArrayToAssociate(filteredManagers);
  };

  const associateSubTenantToManager = () => {
    managerArrayToAssociate.forEach((managerId) => {
      const indexAtUserList = userList
        ? userList.findIndex((userData) => userData["id"] === managerId)
        : -1;
      if (indexAtUserList >= 0) {
        const manager = userList[indexAtUserList];
        const subTenantIdList = manager["attachedCustomerIds"] || [];
        const updatedSubTenantIdList = uniq([
          ...subTenantIdList,
          environmentId,
        ]);
        updateSubtenantToManager(manager, updatedSubTenantIdList);
      }
    });
    closeUserInviteEmailDialog();
  };

  const removeSubTenantFromManager = () => {
    const manager =
      userList[
        userList.findIndex((userData) => userData["id"] === deleteUser.id)
      ];
    const subTenantIdList = manager["attachedCustomerIds"]?.filter(
      (envId) => envId !== environmentId,
    );
    updateSubtenantToManager(manager, subTenantIdList);
    setIsUserDelete(false);
  };

  const updateSubtenantToManager = async (manager, subTenantIdList) => {
    const [error] = await updateManager({
      token,
      id: manager.id,
      manager: {
        ...manager,
        address: {
          ...omit(manager.address, "mail"),
        },
      },
      name: manager.name,
      email: manager.address.email,
      username: manager.login,
      password: manager.pwd,
      usertype: manager.userType,
      attachedCustomerIds: subTenantIdList,
    });
    reloadEnvironmentUsersList();
    if (error) {
      return enqueueSnackbar(
        error.getMessage(t("Unable to save", { variant: "error" })),
      );
    }
    enqueueSnackbar(t("Saved successfully", { x: "Profile" }), {
      variant: "success",
    });
  };

  const openUserInviteEmailDialog = () => {
    setShowUserInvite(true);
  };

  const closeUserInviteEmailDialog = () => {
    setManagerArrayToAssociate([]);
    setShowUserInvite(false);
  };

  const getNonUsersList = () => {
    return userList.filter(
      (user) => !environmentUsers.some((envUser) => user.id === envUser.id),
    );
  };

  return (
    <>
      <Dialog
        id="LIST_ENVIRONMENT_USERS"
        maxWidth="sm"
        execLabel={t("Done")}
        onClose={onClose}
        title={t("Users for", { environmentName })}
      >
        {!isLoginUserRestrictedManager && (
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <AddItemsButton
              id={`ADD_USERS_BUTTON`}
              onClickCallBack={openUserInviteEmailDialog}
              buttonLabel={t("Add Users")}
            ></AddItemsButton>
          </Box>
        )}
        <Box data-testid={"envUserListComponent"}>
          {environmentUsers?.map((user, i) => {
            const isEnvUserAdmin =
              user.baseRole.id <= userRoles.PRIVILEGED_MANAGER;
            return (
              <Grid key={i}>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={9}>
                    <Box display="flex" flexDirection="row" textAlign={"left"}>
                      <Box p={1}>
                        <Typography
                          id={`INVITE_ENV_USERS_USERNAME_${i}`}
                          variant="subtitle2"
                          className={classes.username}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          id={`INVITE_ENV_USERS_EMAIL_${i}`}
                          variant="body2"
                          className={classes.email}
                        >
                          {user.login}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={3} container alignItems="center">
                    {!isEnvUserAdmin && !isLoginUserRestrictedManager && (
                      <Button
                        id={`INVITE_USERS_REMOVE_BUTTON_${user.id}`}
                        color="primary"
                        onClick={() => {
                          setDeleteUser(user);
                          setIsUserDelete(true);
                        }}
                      >
                        {t("Remove")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </Grid>
            );
          })}
        </Box>
      </Dialog>

      {isUserDelete && (
        <Dialog
          onClose={() => {
            setIsUserDelete(false);
          }}
          title={t("Confirmation Request")}
          onExec={removeSubTenantFromManager}
          content={t("Are you sure you want to delete user?", {
            name: deleteUser?.name,
          })}
        />
      )}

      {showUserInvite && (
        <Dialog
          onExec={associateSubTenantToManager}
          maxWidth="xs"
          onClose={closeUserInviteEmailDialog}
          execLabel={t("Ok")}
          title={t("Add Users")}
        >
          <Box>
            {getNonUsersList().length === 0 ? (
              <Grid container justifyContent="center" alignContent="center">
                <Typography className={classes.username}>
                  {" "}
                  No users to add{" "}
                </Typography>
              </Grid>
            ) : (
              <FormGroup>
                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  direction="column"
                >
                  {getNonUsersList().map((nonUser, i) => {
                    return (
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id={`add-user-to-env-${nonUser.id}`}
                              onChange={(e) =>
                                e.target.checked
                                  ? addItemsCallBack(nonUser.id)
                                  : removeItemsCallBack(nonUser.id)
                              }
                            />
                          }
                          label={
                            <Typography className={classes.username}>
                              {nonUser.name}
                            </Typography>
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </FormGroup>
            )}
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default ListUsers;
