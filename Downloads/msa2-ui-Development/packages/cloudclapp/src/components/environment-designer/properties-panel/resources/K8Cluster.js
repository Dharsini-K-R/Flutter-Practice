import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isEqual } from "lodash";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import { CircularProgress, Grid, makeStyles } from "@material-ui/core";

import { getWorkflowByUri } from "cloudclapp/src/store/designations";
import MSAConsole from "cloudclapp/src/components/ccla-console";
import useWorkflowContext from "cloudclapp/src/hooks/useWorkflowContext";
import Process from "msa2-ui/src/services/Process";
import { ENV_DESIGNER } from "cloudclapp/src/Constants";
import { getServicesByImageType } from "cloudclapp/src/services/CloudVendor";

const useStyles = makeStyles(() => ({
  emptyBlock: {
    padding: 20,
    minHeight: 200,
  },
  container: {
    padding: 20,
    paddingBottom: 5,
    minHeight: 500,
  },
  loading: {
    marginBottom: 30,
  },
  formHeading: {
    marginBottom: 35,
  },
  formField: {
    marginBottom: 35,
    width: "100%",
  },
  formRadio: {
    marginBottom: 10,
    width: "100%",
  },
}));

const K8Cluster = ({ modelerState, modelerActions, moddle, readOnly }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { activeElement } = modelerState;

  const {
    writeToK8Element,
    getInputParameterFromElement,
    updateActiveElement,
    findParentElementByType,
  } = modelerActions;

  const bpmElementValues = getInputParameterFromElement(activeElement);
  const [clusterElementValues, setClusterElementValues] = useState(
    bpmElementValues,
  );

  const workflowPath = (() => {
    const cloudProviderElement = findParentElementByType(
      activeElement,
      ENV_DESIGNER.INFRASTRUCTURES.PROVIDER,
    );
    if (!cloudProviderElement) return "";

    const services = getServicesByImageType(cloudProviderElement.data.value);
    if (!services.length) return "";
    return services[0].workflow.env;
  })();

  const workflow = useSelector(getWorkflowByUri(workflowPath));

  const isSameWorkflowSelected =
    clusterElementValues?.data?.workflowPath === workflowPath;

  const {
    isLoading: isWorkflowLoading,
    initContext,
    processVariables: processVariableTypesByTask,
  } = useWorkflowContext({
    workflowPath,
    useFirstCreateProcess: true,
    wait: isSameWorkflowSelected,
  });

  // Initial Call to set processVariables in local state
  useEffect(() => {
    if (!isSameWorkflowSelected && workflowPath && workflow && initContext) {
      const processName = workflow.process.find(({ type }) =>
        Process.isCreate(type),
      )?.name;

      setClusterElementValues({
        ...clusterElementValues,
        data: { processName, workflowPath, processVariables: initContext },
      });
    }
  }, [
    isSameWorkflowSelected,
    workflowPath,
    workflow,
    initContext,
    clusterElementValues,
    setClusterElementValues,
  ]);

  const updateClusterBpmElement = useCallback(
    (data = {}) => {
      const payload = {
        ...data,
        moddle,
      };
      const updatedBpmElement = writeToK8Element(payload);
      const businessObject = getBusinessObject(updatedBpmElement);
      updateActiveElement(businessObject);
    },
    [writeToK8Element, updateActiveElement, moddle],
  );

  // Update BPM Element whenever local state changes
  useEffect(() => {
    if (!isEqual(clusterElementValues?.data, bpmElementValues?.data)) {
      updateClusterBpmElement({ ...clusterElementValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterElementValues]);

  // Callback when we update MSAConsole variables
  const onChangeVariables = (processVariables = {}) => {
    setClusterElementValues({
      ...clusterElementValues,
      data: {
        ...clusterElementValues.data,
        processVariables,
      },
    });
  };

  const renderMSAConsole = () => {
    if (isWorkflowLoading || !workflow) return <CircularProgress />;
    return (
      <MSAConsole
        data={clusterElementValues?.data?.processVariables || {}}
        processVariables={processVariableTypesByTask}
        variables={workflow?.variables?.variable}
        editMode={Process.processDefinitions.CREATE.type}
        onChange={onChangeVariables}
      />
    );
  };

  const emptyBlockCondition = !workflowPath;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={emptyBlockCondition ? classes.emptyBlock : classes.container}
    >
      {emptyBlockCondition ? (
        <div>{t("Please select a provider")}</div>
      ) : (
        renderMSAConsole()
      )}
    </Grid>
  );
};

export default K8Cluster;
