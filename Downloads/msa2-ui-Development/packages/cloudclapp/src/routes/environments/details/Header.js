import React, { useState } from "react";
import {
  Box,
  Grid,
  makeStyles,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import UserButton from "cloudclapp/src/components/user-button";
import DeleteButton from "cloudclapp/src/components/delete-button";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon";
import ChangeOwnershipDialog from "./ChangeOwnershipDialog";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { userRoles, getUserRole } from "cloudclapp/src/store/auth";
import UserAuditLogs from "./UserAuditLogs";

const useStyles = makeStyles(({ breakpoints }) => {
  return {
    title: {
      fontSize: 28,
      marginLeft: 6,
      fontWeight: 500,
    },
    wrapper: {
      [breakpoints.up("sm")]: {
        height: 60,
      },
    },
  };
});
const Header = ({
  name,
  icon,
  userId,
  envId,
  status,
  isEnvironment = true,
  onDeleteEvent,
  owner,
  isLoading = true,
  onChangeOwnership,
  deleteButtonLabel,
  shouldHideDeleteButton,
}) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = React.useRef(null);

  const [changeOwnershipDialog, setChangeOwnershipDialog] = useState(false);
  const [userLogs, showUserLogs] = useState(false);
  const menuIdPrefix = isEnvironment ? "ENVIRONMENT" : "DEPLOYMENT";
  const userRole = useSelector(getUserRole);
  const isManager = userRole >= userRoles.MANAGER;
  const options = [
    {
      id: `${menuIdPrefix}_CHANGE_OWNERSHIP`,
      label: t("Change Ownership"),
      onClick: () => setChangeOwnershipDialog(true),
      visible: isManager,
    },
    {
      id: `${menuIdPrefix}_VIEW_USER_LOGS`,
      label: t("View User Logs"),
      onClick: () => showUserLogs(true),
    },
  ];

  return (
    <Grid
      item
      xs={12}
      container
      justifyContent="space-between"
      alignItems={"center"}
      className={classes.wrapper}
    >
      <Grid item xs={12} sm={6}>
        <Box display="flex" flexDirection="row" alignItems={"center"}>
          <Box>
            <StatusBadgeIcon
              size="large"
              icon={icon}
              status={status}
              type={isEnvironment ? "environment" : "deployment"}
            />
          </Box>
          <Box p={1} style={{ maxWidth: "90%" }}>
            <Typography
              id="ENVIRONMENT_DETAILS_ENVIRONMENT_NAME"
              className={`${commonClasses.commonTextEllipsis} ${classes.title}`}
            >
              {name}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sm={6}
        className={commonClasses.commonXSOnlyFlexStart}
      >
        <Box display="flex" flexDirection="row" alignItems={"center"}>
          {!shouldHideDeleteButton && isEnvironment && (
            <Box p={1}>
              <DeleteButton
                id="ENVIRONMENT_DETAILS_DELETE_BUTTON"
                onClick={onDeleteEvent}
                disabled={isLoading}
                label={deleteButtonLabel}
              />
            </Box>
          )}
          <Box p={1}>
            <Grid item>
              <UserButton
                aria-label="user-button"
                id="ENVIRONMENT_DETAILS_OWNER_BUTTON"
                username={owner}
                userId={userId}
                disabled={isLoading}
                onClickCallback={
                  isEnvironment ? () => setIsOpen(true) : undefined
                }
                userRef={isEnvironment ? anchorRef : undefined}
              />
            </Grid>
            <Menu
              open={isOpen}
              anchorEl={anchorRef.current}
              onClose={() => setIsOpen(false)}
              variant="menu"
              style={{
                marginTop: anchorRef.current?.offsetHeight + 5 ?? undefined,
              }}
            >
              {options
                .filter(({ visible }) => !visible)
                .map(({ label, onClick, id }, index) => (
                  <MenuItem
                    aria-label="menu-item"
                    key={index}
                    id={id}
                    onClick={() => {
                      setIsOpen(false);
                      onClick();
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
            </Menu>
            {changeOwnershipDialog && (
              <ChangeOwnershipDialog
                currentOwner={userId}
                envName={name}
                envId={envId}
                onClose={() => setChangeOwnershipDialog(false)}
                onExec={onChangeOwnership}
              />
            )}
            {userLogs && (
              <UserAuditLogs
                onClose={() => showUserLogs(false)}
                userId={userId}
              />
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Header;
