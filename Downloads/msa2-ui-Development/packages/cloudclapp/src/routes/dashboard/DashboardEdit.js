import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "cloudclapp/src/components/dialog/Dialog";

import { makeStyles } from "@material-ui/core";

import { DASHBOARD_EDIT_DROPDOWN } from "cloudclapp/src/Constants";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";

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

const DashboardEdit = ({ onClose, DashView, currentView }) => {
  const { t } = useTranslation();
  const [editInput, setEditInput] = useState(currentView);
  const classes = useStyles();

  const onSave = () => {
    DashView(editInput);
    onClose();
  };

  return (
    <>
      <Dialog
        id="DASHBOARD_EDIT_DIALOG"
        maxWidth="xs"
        onClose={onClose}
        title={t("Select Template")}
        onExec={onSave}
        execLabel={t("Save")}
      >
        <SelectField
          id="DASHBOARD_EDIT_VALUE"
          options={Object.values(DASHBOARD_EDIT_DROPDOWN)}
          className={classes.selectInput}
          value={editInput}
          onChange={(event) => {
            setEditInput(event);
          }}
        />
      </Dialog>
    </>
  );
};

export default DashboardEdit;
