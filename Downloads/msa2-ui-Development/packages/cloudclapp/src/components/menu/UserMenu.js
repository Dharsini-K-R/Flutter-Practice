import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useDialog from "cloudclapp/src/hooks/useDialog";
import {
  // BellIcon,
  CogIcon,
  DoorOpenIcon,
  // LanguageIcon,
  // ListIcon,
  ToggleOffIcon,
  InfoIcon,
} from "react-line-awesome";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  useTheme,
} from "@material-ui/core";

import innerBus from "cloudclapp/src/utils/InnerBus";

import About from "cloudclapp/src/components/About";
import AccountSettings from "cloudclapp/src/components/menu/AccountSettings";
import { deactivateUser } from "cloudclapp/src/api/user";

import usePostApi from "cloudclapp/src/hooks/usePostApi";

import {
  useSelector,
  // , useDispatch
} from "react-redux";

import {
  getUserDetails,
  userRoles,
  getUserRole,
} from "cloudclapp/src/store/auth";

/*
import {
  changeLanguage,
  getLanguage,
  SETTINGS,
} from "cloudclapp/src/store/settings";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
*/

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
  selectInput: {
    marginLeft: 10,
  },
}));

const UserMenu = () => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const classes = useStyles();

  const [accSettDialog, setAccSettDialog] = useState(false);
  const [showAboutDialog, AboutDialog] = useDialog();
  const [showDeleteDialog, DeleteDialog] = useDialog();
  /*
  const selectedLanguageFromStore = useSelector(getLanguage);
  const [showLanguageDialog, LanguageDialog] = useDialog();
  const [selectedLanguage, setSelectedLanguage] = useState({
    label: selectedLanguageFromStore,
    value: selectedLanguageFromStore,
  });
 
  const dispatch = useDispatch();
   */

  const userDetails = useSelector(getUserDetails);
  const { id } = userDetails;

  const userRole = useSelector(getUserRole);
  const isLoginUserSuperAdmin = userRole === userRoles.PRIVILEGED_ADMINISTRATOR;

  /*
  const LanguageList = SETTINGS.language.options.map((language, index) => {
    return {
      label: language,
      value: language,
    };
  });

  const changeLanguageInStore = () => {
    dispatch(changeLanguage(selectedLanguage.value));
  };
*/

  const logoutFromAllTabs = () => {
    innerBus.emit(innerBus.evt.LOGOUT);
  };

  const deleteSuccess = () => {
    showDeleteDialog(false);
    logoutFromAllTabs();
  };

  const [handleDelete, isDeleting, deleteError] = usePostApi(
    deactivateUser,
    { id },
    deleteSuccess,
  );

  const MenuItems = [
    {
      id: "USER_MENU_ACCOUNT_SETTINGS",
      label: "Account Settings",
      icon: CogIcon,
      onClick: setAccSettDialog,
    },
    // {
    //   id: "USER_MENU_PERMISSIONS",
    //   label: "Permissions",
    //   icon: ListIcon,
    // },
    // {
    //   id: "USER_MENU_NOTIFICATIONS",
    //   label: "Notifications",
    //   icon: BellIcon,
    // },
    // {
    //   id: "USER_MENU_LANGUAGES",
    //   label: "Languages",
    //   icon: LanguageIcon,
    //   onClick: showLanguageDialog,
    // },
    {
      id: "USER_MENU_About",
      label: "About Cloudclapp",
      icon: InfoIcon,
      onClick: showAboutDialog,
    },
    {
      id: "USER_MENU_DEACTIVATE_ACCOUNT",
      label: "Deactivate Account",
      icon: ToggleOffIcon,
      itemStyle: { marginTop: 30, color: palette.text.error },
      onClick: showDeleteDialog,
      disabled: isLoginUserSuperAdmin,
    },
    {
      id: "USER_MENU_LOG_OUT",
      label: "Log Out",
      icon: DoorOpenIcon,
      onClick: logoutFromAllTabs,
    },
  ];

  return (
    <>
      <AboutDialog title={t("About Cloudclapp")} maxWidth={"sm"}>
        <About />
      </AboutDialog>
      {accSettDialog && (
        <AccountSettings
          initialValues={userDetails}
          onClose={() => setAccSettDialog(false)}
        />
      )}
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
            <ListItemIcon
              className={classes.listItemIcon}
              style={item.iconStyle}
            >
              <item.icon />
            </ListItemIcon>
            <ListItemText
              className={classes.listItemText}
              primary={t(item.label)}
            />
          </ListItem>
        ))}
      </List>
      <DeleteDialog
        title={t("Deactivate Account")}
        content={t("Are you sure you want to deactivate your account?")}
        onExec={async () => {
          await handleDelete();
        }}
        disabled={isDeleting}
        errorContent={deleteError?.getMessage(
          t("Unable to deactivate Account"),
        )}
      />
      {/* <LanguageDialog
        title={t("Select Language")}
        content={
          <SelectField
            id="SETTINGS_LANGUAGE_SELECTOR"
            className={classes.selectInput}
            width={250}
            options={LanguageList}
            value={selectedLanguage}
            onChange={(event) =>
              setSelectedLanguage({ label: event.label, value: event.value })
            }
          />
        }
        onExec={changeLanguageInStore}
      /> */}
    </>
  );
};

export default UserMenu;
