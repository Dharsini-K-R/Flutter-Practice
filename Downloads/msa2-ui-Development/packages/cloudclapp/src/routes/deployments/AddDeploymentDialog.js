import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import Validation from "msa2-ui/src/services/Validation";
import Deployment from "cloudclapp/src/services/Deployment";
import CloudVendor from "cloudclapp/src/services/CloudVendor";

import {
  getEnvironments,
  getOrganisation,
  getCloudVendors,
} from "cloudclapp/src/store/designations";
import useWorkflowContext from "cloudclapp/src/hooks/useWorkflowContext";
import useWorkflowInstance from "cloudclapp/src/hooks/useWorkflowInstance";

import AddDeployment from "cloudclapp/src/components/deployments/AddDeployment";
import EstimateDialog from "cloudclapp/src/components/deployments/EstimateDialog";
import { isEmpty } from "lodash";

const EstimateDialogView = ({ entityId, onClose, open, workflowContext }) => {
  const environments = useSelector(getEnvironments());
  const cloudVendors = useSelector(getCloudVendors);

  const selectedEnv = environments.find((e) => e.envEntityId === entityId);

  const { envWFUri } = CloudVendor.getWFUrisFromEnvironment(
    selectedEnv,
    cloudVendors,
  );

  const { workflowInstance: environmentContext } = useWorkflowInstance({
    workflowPath: envWFUri,
    instanceId: selectedEnv?.serviceId,
    wait: { workflow: true, workflowStatus: true },
  });

  return (
    <EstimateDialog
      open={open}
      selectedEnv={selectedEnv}
      workflowContext={workflowContext}
      environmentContext={environmentContext}
      onClose={onClose}
    />
  );
};

const AddDeploymentDialog = ({
  onClose,
  ubiqubeId,
  workflowPath,
  entityId,
  showOnlyVMs,
  showEstimate = true,
}) => {
  const { t } = useTranslation();
  const { prefix } = useSelector(getOrganisation);

  const [isOpenEstimateDialog, setIsOpenEstimateDialog] = useState(false);
  const defaultContext = Deployment.buildDefaultContext({ prefix, entityId });

  const workflowContext = useWorkflowContext({
    workflowPath,
    useFirstCreateProcess: true,
    defaultContext,
    ubiqubeId,
  });
  const { isLoading, runProcess, processInstance } = workflowContext;

  const toggleEstimateDialog = () => {
    setIsOpenEstimateDialog(!isOpenEstimateDialog);
  };

  const showEstimateCondition = showEstimate && !processInstance;

  const formValidation = () => {
    const { variables, context } = workflowContext;
    return context && Validation.variables(context, variables);
  };

  return (
    <>
      <Dialog
        id={t("ADD_DEPLOYMENT")}
        maxWidth="lg"
        onClose={onClose}
        title={t("Create New Deployment")}
        onExec={() => {
          if (!processInstance) {
            runProcess();
          } else {
            onClose();
          }
        }}
        extraAction={
          showEstimateCondition ? () => toggleEstimateDialog() : undefined
        }
        extraLabel={showEstimateCondition ? t("Estimate") : undefined}
        execLabel={!processInstance ? t("Create") : t("Complete")}
        disabled={isLoading || !ubiqubeId || !isEmpty(formValidation())}
      >
        <AddDeployment
          workflowContext={workflowContext}
          showOnlyVMs={showOnlyVMs}
        />
      </Dialog>
      {showEstimateCondition && isOpenEstimateDialog && (
        <EstimateDialogView
          entityId={entityId}
          onClose={toggleEstimateDialog}
          open={isOpenEstimateDialog}
          workflowContext={workflowContext}
        />
      )}
    </>
  );
};

AddDeploymentDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default AddDeploymentDialog;
