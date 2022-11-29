import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import { Button, Typography } from "@material-ui/core";

import { TrashAltIcon } from "react-line-awesome";

const useStyles = makeStyles(({ palette }) => {
  return {
    icon: {
      fontSize: 18,
      color: palette.error.main,
    },
    text: {
      fontSize: 14,
      fontWeight: 400,
      color: palette.error.main,
      marginLeft: 5,
    },
  };
});

const DeleteButton = ({ label, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    // Try to overwrite id as this can appear on DOM multiple times
    <Button id={"DELETE_BUTTON"} {...props}>
      <TrashAltIcon className={classes.icon} />
      <Typography className={classes.text}>{label ?? t("Delete")}</Typography>
    </Button>
  );
};

export default DeleteButton;
