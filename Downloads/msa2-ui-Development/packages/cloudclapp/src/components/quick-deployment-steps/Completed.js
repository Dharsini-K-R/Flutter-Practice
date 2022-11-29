import React, { useEffect } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";
import { fetchEnvironments } from "cloudclapp/src/store/designations";

const Completed = ({ workflowContext }) => {
  const { processInstance } = workflowContext;
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(fetchEnvironments);
    };
  });

  return (
    <Box>
      {processInstance ? (
        <WorkflowLiveConsole processInstance={processInstance} />
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default Completed;
