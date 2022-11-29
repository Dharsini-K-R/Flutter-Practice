import React from "react";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useTranslation } from "react-i18next";
import Applications from "../../routes/applications/Applications";
import { makeStyles } from "@material-ui/core";
import { PropTypes } from "prop-types";

const useStyles = makeStyles(({ colors }) => ({
  applicationButton: {
    padding: "12px 20px 12px 20px",
    borderRadius: "4px",
    border: "1px solid #000000",
    boxSizing: "border-box",
    fontWeight: "500",
    textAign: "center",
    lineHeight: "normal",
    textTransform: "none",
    "&.MuiButton-root": {
      color: "black",
      backgroundColor: "white",
    },
  },
}));

const AddApplicationDialog = ({
  onClose,
  addApplicationsToContext,
  visibleTab,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [
    imagesArrayForDeployment,
    setImagesArrayForDeployment,
  ] = React.useState([]);

  const setApplicationsCallBack = (applicationsArray) => {
    setImagesArrayForDeployment(applicationsArray);
  };

  const addSelectedDeploymentsToContext = () => {
    addApplicationsToContext(imagesArrayForDeployment);
    onClose();
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      title={t("Add Application Images")}
      execLabel={t("Add Application Images")}
      onExec={addSelectedDeploymentsToContext}
      buttonClasses={classes.applicationButton}
      id={t("ADD_APPLICATION")}
    >
      <Applications
        showPageHeader={false}
        showQuickDeployment={false}
        setApplicationsCallBack={setApplicationsCallBack}
        visibleTab={visibleTab}
      />
    </Dialog>
  );
};

AddApplicationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  addApplicationsToContext: PropTypes.func.isRequired,
  visibleTab: PropTypes.string,
};

export default AddApplicationDialog;
