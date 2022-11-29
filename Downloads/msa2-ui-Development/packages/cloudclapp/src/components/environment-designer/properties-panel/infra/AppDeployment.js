import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Box,
  Typography,
  Grid,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import MSAConsole from "cloudclapp/src/components/ccla-console";
import Process from "msa2-ui/src/services/Process";
import Bpm from "msa2-ui/src/services/Bpm";

import { getCloudVendors } from "cloudclapp/src/store/designations";
import CloudVendor from "cloudclapp/src/services/CloudVendor";
import useWorkflowContext from "cloudclapp/src/hooks/useWorkflowContext";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: 200,
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

const AppDeployment = ({
  environment,
  modelerState,
  modelerActions,
  moddle,
  readOnly,
}) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { t } = useTranslation();

  const { activeElement } = modelerState;

  const bpmElementValues = Bpm.readAttachedWorkflowValuesFromBpmElement(
    activeElement,
  );

  const cloudVendors = useSelector(getCloudVendors);

  const { appWFUri: workflowPath } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );

  const { envUbiqubeId } = environment;

  const workflowContext = useWorkflowContext({
    workflowPath,
    ubiqubeId: envUbiqubeId,
    useFirstCreateProcess: true,
    wait: bpmElementValues?.processName,
  });

  const {
    isLoading,
    variables,
    processVariables,
    editMode,
    processName,
  } = workflowContext;

  const onChange = (contextData = {}) => {
    const updatedElement = Bpm.writeAttachedWorkflowValuesToBpmElement({
      ...bpmElementValues,
      processVariables: contextData,
      // todo: remove this and set it when generated
      processName,
      moddle,
    });
    modelerActions.replaceActiveElement(updatedElement);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classes.container}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid
            className={classes.topPadding}
            container
            item
            alignItems="center"
            justifyContent="center"
            direction="row"
          >
            <Typography
              variant="h4"
              className={commonClasses.commonDialogHeaderTitle}
              id="Add_Deployment_Form_Deployment_Text"
            >
              {t("Create a Deployment")}
            </Typography>
          </Grid>
          <Grid container item>
            <Box
              className={classes.boxWidthPadding}
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                direction="row"
              >
                <MSAConsole
                  data={bpmElementValues?.processVariables}
                  variables={variables}
                  processVariables={processVariables}
                  editMode={editMode || Process.processDefinitions.CREATE.type}
                  onChange={onChange}
                />
              </Grid>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AppDeployment;
