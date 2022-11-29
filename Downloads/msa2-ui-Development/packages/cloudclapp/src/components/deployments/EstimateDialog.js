import React from "react";
import { useTranslation } from "react-i18next";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import DeployStep from "cloudclapp/src/components/quick-deployment-steps/DeployStep";

const EstimateDialog = ({
  title = "Deployment Estimation",
  selectedEnv,
  workflowContext,
  environmentContext,
  selectedCloudCnt,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const dialogTitle = t(title);

  return (
    <Dialog
      id={t("DEPLOYMENT_ESTIMATION")}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      title={dialogTitle}
    >
      <DeployStep
        selectedEnv={selectedEnv}
        selectedCloudCnt={selectedCloudCnt}
        deploymentContext={workflowContext.context}
        environmentContext={environmentContext}
      />
    </Dialog>
  );
};

export default EstimateDialog;
