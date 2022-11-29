import React from "react";
import { PropTypes } from "prop-types";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useTranslation } from "react-i18next";

import DeploymentSecurity from "./DeploymentSecurity";

const SecurityDialog = ({
  onClose,
  environment,
  deployment,
  cloudVendor,
  scanApp = false,
  scanWebApp = false,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      title={t("Security Scan")}
      noActions
      textAlignment="start"
    >
      <DeploymentSecurity
        environment={environment}
        deployment={deployment}
        cloudVendor={cloudVendor}
        scanApp={scanApp}
        scanWebApp={scanWebApp}
      />
    </Dialog>
  );
};

SecurityDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default SecurityDialog;
