import {
  getWorkflow,
  getWorkflowInstanceVariableValues,
  getWorkflowInstanceHistory,
} from "msa2-ui/src/api/workflow";
import useApi from "./useApi";

const useWorkflowInstance = ({ workflowPath, instanceId, wait = {} }) => {
  const [isWorkflowLoading, , workflow] = useApi(
    getWorkflow,
    {
      pathToWorkflowDefinitionFile: workflowPath,
      addServiceName: true,
    },
    !workflowPath || wait.workflow,
  );

  const [isWorkflowInstanceLoading, , workflowInstance] = useApi(
    getWorkflowInstanceVariableValues,
    {
      instanceId,
    },
    !instanceId || wait.workflowInstance,
  );

  const [isWorkflowStatusLoading, , [workflowStatus] = []] = useApi(
    getWorkflowInstanceHistory,
    {
      instanceId,
      rowsPerPage: 1,
    },
    !instanceId || wait.workflowStatus,
  );

  const isLoading =
    isWorkflowLoading || isWorkflowInstanceLoading || isWorkflowStatusLoading;

  return {
    workflow,
    workflowInstance,
    workflowStatus,
    isLoading,
    loading: {
      isWorkflowLoading,
      isWorkflowInstanceLoading,
      isWorkflowStatusLoading,
    },
  };
};

export default useWorkflowInstance;
