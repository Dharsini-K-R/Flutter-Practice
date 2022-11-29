import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import InviteUserEmailDialog from "cloudclapp/src/routes/dashboard/InviteUserEmailDialog";
import { Tooltip } from "@material-ui/core";

import {
  makeStyles,
  Box,
  Button,
  Divider,
  Chip,
  Grid,
  Typography,
} from "@material-ui/core";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import AddItemsButton from "cloudclapp/src/components/add-items-button/AddItemsButton";
import { MAXIMUM_USER_LIMIT } from "cloudclapp/src/Constants";

import { userRoles, getUserRole } from "cloudclapp/src/store/auth";
import {
  getUserList,
  fetchEnvironmentSummary,
} from "cloudclapp/src/store/designations";
import { deleteUser } from "cloudclapp/src/api/user";
import usePostApi from "cloudclapp/src/hooks/usePostApi";
import { LockIcon, LockOpenIcon } from "react-line-awesome";
import EditPermissions from "cloudclapp/src/components/edit-permissions/EditPermissions";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => {
  return {
    flexCenter: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: "20px",
    },
    firstBox: {
      marginLeft: 20,
    },
    addItem: {
      padding: "10px 20px",
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
    orgIcon: {
      fontSize: "28px",
      color: palette.background.appBar,
    },
    tableWrapper: {
      paddingBottom: 20,
    },
  };
});

const UsersList = ({ id, showPermissions = false }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const userList = useSelector(getUserList);
  const userRole = useSelector(getUserRole);
  const isLoginUserManager = userRole <= userRoles.ADMINISTRATOR;
  const [user, setUser] = useState();
  const [isUserDelete, setIsUserDelete] = useState();
  const [showUserInvite, setShowUserInvite] = useState(false);
  const [showUserPermissions, setShowUserPermissions] = useState(false);
  const disableAddUsers =
    userList?.length > MAXIMUM_USER_LIMIT.count ? true : false;

  const openUserInviteEmailDialog = () => {
    setShowUserInvite(true);
  };
  const closeUserInviteEmailDialog = () => {
    setShowUserInvite(false);
  };

  const onDeleteSuccess = () => {
    setIsUserDelete(false);
  };

  const [handleDelete, isDeleting, deleteError] = usePostApi(
    deleteUser,
    { id: user?.id },
    onDeleteSuccess,
  );

  useEffect(() => {
    dispatch(fetchEnvironmentSummary);
  }, [dispatch]);

  const canInviteUers = useSelector(
    getPermission("governance", "user", "invite"),
  );
  const canEditPermission = useSelector(
    getPermission("governance", "user", "editPermission"),
  );

  return (
    <>
      {canInviteUers && (
         <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          className={classes.addItem}
        >
          <Tooltip
            title={
              disableAddUsers
                ? t("With a Community Account, you cannot add more than 3 users.")
                : ""
            }
          >
            <span>
              <AddItemsButton
                id={`${id}_INVITE_USERS_BUTTON`}
                onClickCallBack={openUserInviteEmailDialog}
                buttonLabel={t("Invite Users")}
                disabled={disableAddUsers}
              />
            </span>
          </Tooltip>
        </Box>
      )}
      <Box className={classes.tableWrapper}>
        {userList?.map((user, i) => {
          const isManager = user.baseRole.id <= userRoles.ADMINISTRATOR;
          return (
            <>
              <Grid key={i}>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={9}>
                    <Box display="flex" flexDirection="row" textAlign={"left"}>
                      <Box p={1} className={classes.firstBox}>
                        <Typography
                          id={`${id}_INVITE_USERS_USERNAME_${i}`}
                          variant="subtitle2"
                          className={classes.username}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          id={`${id}_INVITE_USERS_EMAIL_${i}`}
                          variant="body2"
                          className={classes.email}
                        >
                          {user.address.mail}
                        </Typography>
                      </Box>
                      <Box p={1}>
                        {isManager && (
                          <Chip
                            id={`${id}_INVITE_USERS_MANAGER_BADGE_${i}`}
                            label={t("Admin")}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={showPermissions ? 2 : 3}
                    container
                    alignItems="center"
                  >
                    {isLoginUserManager && !isManager && (
                      <Button
                        id={`${id}_INVITE_USERS_DELETE_ACCOUNT_BUTTON_${i}`}
                        color="primary"
                        onClick={() => {
                          setUser(user);
                          setIsUserDelete(true);
                        }}
                      >
                        {t("Delete Account")}
                      </Button>
                    )}
                  </Grid>
                  {showPermissions && canEditPermission && (
                    <Grid item xs={1} container alignItems="center">
                      {
                        <Tooltip
                          title={
                            user.delegationProfileId === 0
                              ? t(
                                  "You cannot edit the Permission for this user",
                                )
                              : t("Edit Permissions")
                          }
                        >
                          <span>
                            <Button
                              id={`${id}_INVITE_USERS_PERMISSION_BUTTON_${i}`}
                              color="primary"
                              onClick={() => {
                                setUser(user);
                                setShowUserPermissions(true);
                              }}
                              disabled={user.delegationProfileId === 0}
                            >
                              {user.delegationProfileId === 0 ? (
                                <LockIcon className={classes.orgIcon} />
                              ) : (
                                <LockOpenIcon className={classes.orgIcon} />
                              )}
                            </Button>
                          </span>
                        </Tooltip>
                      }
                    </Grid>
                  )}
                </Grid>
                <Divider />
              </Grid>
            </>
          );
        })}
      </Box>

      {isUserDelete && (
        <Dialog
          onClose={() => {
            setIsUserDelete(false);
          }}
          title={t("Confirmation Request")}
          onExec={async () => {
            await handleDelete();
            dispatch(fetchEnvironmentSummary);
          }}
          content={t("Are you sure you want to delete this user?", {
            name: user?.name,
          })}
          disabled={isDeleting}
          errorContent={deleteError?.getMessage(t("Unable to delete User"))}
        />
      )}
      {showUserInvite && (
        <InviteUserEmailDialog onClose={closeUserInviteEmailDialog} />
      )}
      {showUserPermissions && (
        <Dialog>
          <EditPermissions
            profileId={user.delegationProfileId}
            onClose={() => {
              setShowUserPermissions(false);
            }}
          />
        </Dialog>
      )}
    </>
  );
};

export default UsersList;
