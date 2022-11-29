import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Grid, Button, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { getCloudVendors } from "cloudclapp/src/store/designations";
import CloudVendor, {
  getServiceFromEnvironment,
} from "cloudclapp/src/services/CloudVendor";
import { CloudIcon, MapMarkedIcon, StreamIcon } from "react-line-awesome";
import {
  INFRASTRUCTURES,
  DEPLOYMENT_VARIABLES_NAME,
  ENV_DESIGNER,
} from "cloudclapp/src/Constants";
import AddApplicationDialog from "cloudclapp/src/components/deployments/AddApplicationDialog";
import { useCommonStyles } from "./styles/commonStyles";

const infrastructures = [
  {
    id: INFRASTRUCTURES.PROVIDER,
    name: "Provider",
    Icon: CloudIcon,
    iconStyles: {
      border: "1px solid #7288BA",
      borderRadius: 4,
      padding: 2,
      background: "rgba(114, 136, 186, 0.1)",
    },
  },
  {
    id: INFRASTRUCTURES.REGION,
    name: "Region",
    Icon: MapMarkedIcon,
    iconStyles: {
      border: "1px solid #6647ED",
      borderRadius: 4,
      padding: 2,
      background: "rgba(102, 71, 237, 0.1)",
    },
  },
  {
    id: INFRASTRUCTURES.APP_DEPLOYMENT,
    name: "App Deployment",
    Icon: StreamIcon,
    iconStyles: {
      border: "1px solid #327BF6",
      borderRadius: 4,
      padding: 2,
      background: "rgba(50, 123, 246, 0.1)",
    },
  },
];

const Infrastructure = ({
  environment,
  modelerActions,
  onClickHandler,
  onMouseDownHandler,
}) => {
  const classes = useCommonStyles();
  const { t } = useTranslation();

  const {
    generateInfraElement,
    generateApplicationElement,
    findElementByBusinessType,
  } = modelerActions;

  const [showAddApplicationDialog, setShowAddApplicationDialog] = useState(
    false,
  );

  const cloudVendors = useSelector(getCloudVendors);
  const cloudService = getServiceFromEnvironment(environment, cloudVendors);
  // todo: get appWFUri based on selected Provider
  const { appWFUri: workflowPath } = CloudVendor.getWFUrisFromEnvironment(
    environment,
    cloudVendors,
  );

  // 1. If there is one Region Subprocess, include apps in it.
  // 2. Else if there is one Provider Subprocess, include apps in it
  // 3. Else place apps to the canvas directly
  // 1. find a K8 cluster
  // 2. connect to an individual application
  const addApplicationToDesigner = (applicationsToAdd = []) => {
    const parent = (() => {
      const region = findElementByBusinessType(
        ENV_DESIGNER.INFRASTRUCTURES.REGION,
      )[0];

      if (region) return region;

      const provider = findElementByBusinessType(
        ENV_DESIGNER.INFRASTRUCTURES.PROVIDER,
      )[0];

      if (provider) return provider;

      return null;
    })();

    const source = findElementByBusinessType(
      ENV_DESIGNER.RESOURCES.K8_CLUSTER,
    )?.[0];

    applicationsToAdd.forEach((application) => {
      const appElement = generateApplicationElement({
        displayName: application[DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME],
        data: {
          application,
        },
        workflowPath,
        // todo
        // processName: getFirstCreateProcess(workflow),
        processVariables: {
          [DEPLOYMENT_VARIABLES_NAME.APPLICATION]: [application],
        },
        parent,
        source,
      });
      if (!parent && !source) {
        onClickHandler({}, appElement);
      }
    });
  };

  const closeDialog = () => {
    setShowAddApplicationDialog(false);
  };

  return (
    <Grid container>
      {infrastructures.map((infra) => {
        const { id, name, Icon, iconStyles } = infra;
        const element = generateInfraElement(id);
        return (
          <Grid item xs={12} className={classes.node} key={id}>
            <Tooltip title={name} arrow>
              <Button
                id={`ENVIRONMENT_DESIGNER_PALETTE_INFRASTRUCTURE_${id}`}
                onClick={(event) => {
                  id === INFRASTRUCTURES.APP_DEPLOYMENT
                    ? setShowAddApplicationDialog(true)
                    : onClickHandler(event, element);
                }}
                onMouseDown={(event) => {
                  if (id === INFRASTRUCTURES.APP_DEPLOYMENT) {
                    setShowAddApplicationDialog(true);
                  }
                  onMouseDownHandler(event, element);
                }}
                className={classes.resourceButton}
              >
                <Icon className={classes.resourceIcon} style={iconStyles} />
                <Typography className={classes.resourceTitle}>
                  {t(name)}
                </Typography>
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
      {showAddApplicationDialog && (
        <AddApplicationDialog
          onClose={closeDialog}
          visibleTab={
            cloudService?.imageType === "vm" ? "virtual-machine" : "docker-hub"
          }
          addApplicationsToContext={addApplicationToDesigner}
        />
      )}
    </Grid>
  );
};

export default Infrastructure;
