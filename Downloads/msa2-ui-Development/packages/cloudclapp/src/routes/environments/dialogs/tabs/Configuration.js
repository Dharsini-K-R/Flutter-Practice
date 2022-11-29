import React from "react";
import PropTypes from "prop-types";
import { Grid, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import Process from "msa2-ui/src/services/Process";

import MSAConsole from "cloudclapp/src/components/ccla-console";

const useStyles = makeStyles(() => {
  return {
    adjustVariables: {
      margin: -16,
    },
  };
});

const Configuration = ({
  formData,
  setFormData,
  workflow,
  processVariableTypesByTask,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid container className={classes.adjustVariables}>
      {!workflow || !processVariableTypesByTask ? (
        t("There are no configuration data to show.")
      ) : (
        <MSAConsole
          data={formData}
          variables={workflow.variables.variable}
          processVariables={processVariableTypesByTask}
          editMode={Process.processDefinitions.CREATE.type}
          onChange={setFormData}
        />
      )}
    </Grid>
  );
};

Configuration.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  processVariableTypesByTask: PropTypes.object.isRequired,
};

export default Configuration;
