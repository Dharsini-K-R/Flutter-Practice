import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getToken } from "cloudclapp/src/store/auth";
import {
  getWorkflowByUri,
  fetchWorkflows,
} from "cloudclapp/src/store/designations";

import useWorkflowContextUtil from "msa2-ui/src/utils/useWorkflowContext";
export {
  getFirstCreateProcess,
  getWorkflowContext,
} from "msa2-ui/src/utils/useWorkflowContext";

const useWorkflowContext = (props) => {
  const { workflowPath } = props;
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const storedWorkflow = useSelector(getWorkflowByUri(workflowPath));

  useEffect(() => {
    if (workflowPath) {
      dispatch(fetchWorkflows([workflowPath]));
    }
  }, [dispatch, workflowPath]);

  return useWorkflowContextUtil({
    token,
    workflow: storedWorkflow,
    ...props,
  });
};

export default useWorkflowContext;
