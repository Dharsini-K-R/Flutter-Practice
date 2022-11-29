import React from "react";
import PropTypes from "prop-types";

import { Grid, makeStyles } from "@material-ui/core";
import MSConfigConsole from "cloudclapp/src/components/ccla-console/MSConfigConsole";

import { getManagedEntityData } from "msa2-ui/src/api/managedEntity";
import useApi from "cloudclapp/src/hooks/useApi";

const useStyles = makeStyles(({ palette }) => ({
  boxWrapper: {
    borderRadius: "8px",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
    margin: "10px 0px",
    boxShadow:
      "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
  },
}));

const EnvironmentConfigConsoleView = ({ deviceId }) => {
  const classes = useStyles();
  const [, , managedEntity] = useApi(getManagedEntityData, {
    managedEntityId: deviceId,
  });

  return (
    <Grid container alignItems="center">
      {managedEntity && managedEntity.configProfileId > 0 && (
        <Grid container className={classes.boxWrapper}>
          <MSConfigConsole
            deviceId={deviceId}
            deploymentSettingId={managedEntity.configProfileId}
          />
        </Grid>
      )}
    </Grid>
  );
};

EnvironmentConfigConsoleView.propTypes = {
  deviceId: PropTypes.number,
};

export default EnvironmentConfigConsoleView;
