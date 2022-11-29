import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Grid, Button, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import Process from "msa2-ui/src/services/Process";
import CloudVendorIcon from "../../cloud-vendor-icon";
import {
  getCloudVendors,
  getWorkflows,
} from "cloudclapp/src/store/designations";
import { getCloudVendorServices } from "cloudclapp/src/services/CloudVendor";
import { useCommonStyles } from "./styles/commonStyles";

import classnames from "classnames";

const Service = ({ modelerActions, onClickHandler, onMouseDownHandler }) => {
  const { t } = useTranslation();

  const { generateElementFromWorkflow } = modelerActions;

  const classes = useCommonStyles();

  const cloudVendors = useSelector(getCloudVendors);
  const cloudVendorServices = getCloudVendorServices(cloudVendors);
  const workflows = useSelector(getWorkflows);

  return (
    <Grid container>
      {cloudVendorServices.map((service, index) => {
        const { cloudVendorName, cloudServiceName } = service;
        const id = [cloudVendorName, cloudServiceName].join("_").toUpperCase();
        const cloudVendor = cloudVendors[cloudVendorName];
        const cloudService = cloudVendor?.services[cloudServiceName];
        const workflowPath = cloudService.workflow.env;
        const workflow = workflows[workflowPath];
        const processName = workflow.process.find(({ type }) =>
          Process.isCreate(type),
        )?.name;
        const element = generateElementFromWorkflow({
          workflowPath,
          processName,
          label: service.displayName,
          extraProps: {
            cloudVendor: cloudVendorName,
            cloudService: cloudServiceName,
          },
        });

        return (
          <Grid item xs={12} className={classes.node} key={id}>
            <Tooltip title={service.displayName} arrow>
              <Button
                id={`ENVIRONMENT_DESIGNER_PALETTE_SERVICES_${id}`}
                onClick={(event) => {
                  onClickHandler(event, element);
                }}
                onMouseDown={(event) => {
                  onMouseDownHandler(event, element);
                }}
                className={classes.resourceButton}
              >
                <CloudVendorIcon
                  vendor={service.cloudVendorName}
                  service={service.cloudServiceName}
                />
                <Typography
                  className={classnames(
                    classes.upperCase,
                    classes.resourceTitle,
                  )}
                >
                  {t(service.cloudServiceName)}
                </Typography>
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default Service;
