import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { getUserById } from "cloudclapp/src/store/designations";

import { makeStyles } from "@material-ui/core";
import { Avatar, Button, Typography } from "@material-ui/core";

import { UserAltIcon } from "react-line-awesome";

const useStyles = makeStyles(({ palette }) => {
  return {
    avatar: (color) => ({
      height: 24,
      width: 24,
      color: color === "white" ? palette.common.white : palette.text.primary,
    }),
    name: {
      marginLeft: 6,
      color: palette.text.primary,
      textTransform: "initial",
    },
    buttonRoot: {
      borderRadius: 30,
    },
  };
});

const UserButton = ({
  name,
  userId,
  username,
  icon,
  color = "white",
  onClickCallback,
  userRef,
  disabled,
  ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ color: color });
  const user =
    useSelector(
      getUserById(username ? username : userId, username ? "login" : "id"),
    ) ?? {};

  const getUserName = () => {
    const UNKNOWN_USER = t("Unknown User");
    if (!name && !userId && !username) return "";
    if (user.name) return user.name;
    if (name) return name;
    if (username) return `${UNKNOWN_USER} - ${username}`;
    return UNKNOWN_USER;
  };

  const Icon = icon ?? UserAltIcon;
  return (
    // Try to overwrite id as this can appear on DOM multiple times
    <Button
      id={"USER_BUTTON"}
      classes={{ root: classes.buttonRoot }}
      onClick={onClickCallback}
      ref={userRef}
      disabled={disabled || !onClickCallback}
      {...props}
    >
      <Avatar className={classes.avatar}>
        <Icon />
      </Avatar>
      <Typography className={classes.name}>{getUserName()}</Typography>
    </Button>
  );
};

UserButton.propTypes = {
  name: PropTypes.string,
  actorId: PropTypes.string,
  username: PropTypes.string,
  icon: PropTypes.element,
};

export default UserButton;
