import React, { useEffect, useCallback, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { useSnackbar } from "notistack";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";

import { getToken } from "cloudclapp/src/store/auth";
import {
  getWorkflowByUri,
  fetchWorkflows,
  fetchEnvironments,
} from "cloudclapp/src/store/designations";

import Variable from "msa2-ui/src/services/Variable";

import Dialog from "cloudclapp/src/components/dialog/Dialog";

import MSAConsole from "cloudclapp/src/components/ccla-console";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";

import useWorkflowContextUtil from "msa2-ui/src/utils/useWorkflowContext";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
export {
  getFirstCreateProcess,
  getWorkflowContext,
} from "msa2-ui/src/utils/useWorkflowContext";

/**
 * A Hook to show Workflow Console on the Dialog
 *
 * @example
 * const Component = ({ environment }) => {
 *   const {
 *     showWorkflowDialog,
 *     WorkflowDialog,
 *     ...workflowDialogProps
 *   } = useWorkflowDialog({
 *     workflowPath: appWFUri,
 *     ubiqubeId: environment.envUbiqubeId,
 *   });
 *
 *   return (
 *     <>
 *       <WorkflowDialog {...workflowDialogProps} />
 *       <Button
 *         onClick={() => {
 *           showWorkflowDialog(processName);
 *         }}
 *       />
 *     </>
 *   );
 * };
 *
 * @param {object} props see packages\msa2-ui\src\utils\useWorkflowContext\useWorkflowContext.js
 * @returns {object} see @example
 */

const useWorkflowDialog = (props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { workflowPath, onClose } = props;
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const storedWorkflow = useSelector(getWorkflowByUri(workflowPath));
  const [workflowProcess, setWorkflowProcess] = useState({});
  const [show, setShow] = useState(false);

  const workflowContext = useWorkflowContextUtil({
    token,
    workflow: storedWorkflow,
    processName: workflowProcess.name,
    wait: !show,
    ...props,
  });

  useEffect(() => {
    // Update store
    if (workflowPath && show) {
      dispatch(fetchWorkflows([workflowPath]));
    }
  }, [dispatch, show, workflowPath]);

  const isExecuted = useRef(false);

  const WorkflowDialog = useCallback(
    (workflowContext) => {
      const {
        processVariables,
        editMode,
        context,
        setContext,
        workflow,
        runProcess,
        isLoading,
        processInstance,
      } = workflowContext;
      if (!show) return null;
      const noParameter =
        workflow &&
        Variable.filterVariablesBasedOnProcess(
          workflow.variables.variable,
          processVariables ?? {},
        )?.length === 0;

      const onError = (error) => {
        enqueueSnackbar(error.getMessage(), {
          variant: "error",
          action: (key) => (
            <SnackbarAction id={key} handleClose={closeSnackbar} />
          ),
          preventDuplicate: true,
        });
      };

      const handleChange = () => {
        runProcess(onError);
        isExecuted.current = true;
      };

      const handleCloseDialog = () => {
        onClose && onClose();
        isExecuted.current && dispatch(fetchEnvironments);
        setWorkflowProcess({});
        setShow(false);
      };

      return (
        <Dialog
          title={workflowProcess?.displayName}
          onExec={processInstance ? undefined : handleChange}
          execLabel={processInstance ? undefined : t("Run")}
          onClose={handleCloseDialog}
          disabled={isLoading}
          maxWidth={noParameter && !processInstance ? "sm" : "lg"}
        >
          {(() => {
            if (isLoading)
              return (
                <Grid container alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Grid>
              );

            if (!processInstance) {
              if (noParameter) {
                return (
                  <Typography>
                    {t("Are you sure you want to trigger the action?", {
                      action: workflowProcess?.displayName,
                    })}
                  </Typography>
                );
              }
              return (
                <MSAConsole
                  data={context}
                  variables={workflow?.variables.variable}
                  processVariables={processVariables}
                  editMode={editMode}
                  onChange={setContext}
                />
              );
            }

            return (
              <WorkflowLiveConsole
                processId={processInstance.processId.id}
                processName={processInstance?.processId.name}
                processInstance={processInstance}
                token={token}
              />
            );
          })()}
        </Dialog>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show, workflowProcess],
  );

  return {
    ...workflowContext,
    showWorkflowDialog: (workflowProcess) => {
      setShow(true);
      setWorkflowProcess(workflowProcess);
    },
    WorkflowDialog,
  };
};

export default useWorkflowDialog;
