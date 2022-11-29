import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getToken } from "cloudclapp/src/store/auth";

import { Box, makeStyles } from "@material-ui/core";

import InputField from "cloudclapp/src/components/controls/InputField";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import PasswordField from "cloudclapp/src/components/controls/password/PasswordField";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useSnackbar } from "notistack";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";

import WorkflowLiveConsole from "msa2-ui/src/components/workflow-live-console";
import VariableField from "cloudclapp/src/components/variables/VariableField";
import { workflowStatus } from "cloudclapp/src/Constants";

const useStyles = makeStyles(() => {
  return {
    adjustMargin: {
      margin: -25,
    },
  };
});

const CCLAWorkflowLiveConsole = ({
  processId,
  processInstance,
  onEvent,
  ...rest
}) => {
  const classes = useStyles();
  const token = useSelector(getToken);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onEventDefault = ({ message, isError }) => {
    enqueueSnackbar(message, {
      variant: isError ? "error" : "success",
      action: (key) => <SnackbarAction id={key} handleClose={closeSnackbar} />,
    });
  };

  return (
    <Box className={classes.adjustMargin}>
      <WorkflowLiveConsole
        processId={processId ?? processInstance?.processId.id}
        processName={processInstance?.processId.name}
        processInstance={processInstance}
        onEvent={onEvent ?? onEventDefault}
        token={token}
        pollingInterval={1000}
        components={{
          Dialog,
          TextField: InputField,
          Select: SelectField,
          Password: PasswordField,
          MSAVariable: VariableField,
        }}
        workflowStatus={workflowStatus}
        singleColumnView
        useAvatar
        {...rest}
      />
    </Box>
  );
};

CCLAWorkflowLiveConsole.propTypes = {
  processId: PropTypes.number,
  processInstance: PropTypes.object.isRequired,
  onEvent: PropTypes.func,
};

export default CCLAWorkflowLiveConsole;
