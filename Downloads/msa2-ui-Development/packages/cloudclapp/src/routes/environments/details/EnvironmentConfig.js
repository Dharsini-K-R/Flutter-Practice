import React from "react";
import { useSelector } from "react-redux";

import CloudVendor from "cloudclapp/src/services/CloudVendor";
import { getCloudVendors } from "cloudclapp/src/store/designations";

import { Grid, makeStyles } from "@material-ui/core";
import useWorkflowInstance from "cloudclapp/src/hooks/useWorkflowInstance";
import PropTypes from "prop-types";
import EnvironmentCloudVendor from "./instances/EnvironmentCloudVendor";
import MSAConsole from "cloudclapp/src/components/ccla-console";
import EnvironmentSectionHeader from "./instances/EnvironmentSectionHeader";
import EnvironmentConfigConsoleView from "./EnvironmentConfigConsoleView";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    marginTop: "1%",
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: palette.text.support,
  },
  environmentWrapper: {
    marginTop: "2%",
    background: "rgba(68,93,110,0.1)",
    boxSizing: "border-box",
    padding: "1%",
  },
  appContainer: {
    marginTop: "1%",
  },
  consoleWrapper: {
    marginTop: "1%",
  },
}));

const EnvironmentConfig = ({ environment }) => {
  const classes = useStyles();

  const deviceId = environment.envEntityId || 0;

  const cloudVendors = useSelector(getCloudVendors);
  const { envWFUri } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );

  const { workflow, workflowInstance } = useWorkflowInstance({
    workflowPath: envWFUri,
    instanceId: environment.serviceId,
  });

  return (
    <Grid
      container
      className={classes.container}
      data-testid="environment-config-container"
    >
      {deviceId > 0 && <EnvironmentConfigConsoleView deviceId={deviceId} />}
      <Grid container className={classes.environmentWrapper}>
        <EnvironmentSectionHeader
          title={"Version 1.0.0"} //replace with environment.version once available from API
          status={environment.status}
          owner={environment.cclapOwner}
        />
        <Grid container className={classes.appContainer}>
          <EnvironmentCloudVendor environment={environment} />
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            direction="row"
            className={classes.consoleWrapper}
          >
            {workflow && workflowInstance && (
              <MSAConsole
                style={{ background: "inherit" }}
                data={workflowInstance}
                variables={workflow.variables.variable}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

EnvironmentConfig.propTypes = {
  environment: PropTypes.object.isRequired,
};

export default EnvironmentConfig;
