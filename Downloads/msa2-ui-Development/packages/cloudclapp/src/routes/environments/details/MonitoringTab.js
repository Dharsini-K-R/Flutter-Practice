import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCloudVendors } from "cloudclapp/src/store/designations";
import { getServiceFromEnvironment } from "cloudclapp/src/services/CloudVendor";
import { MONITORING_MICROSERVICE } from "cloudclapp/src/Constants";

import useApi from "msa2-ui/src/hooks/useApi";
import { getInstanceDataForMicroservicesOfManagedEntity } from "msa2-ui/src/api/microservices";

import {
  makeStyles,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";

import SelectField from "cloudclapp/src/components/controls/select/SelectField";

const useStyles = makeStyles(({ palette }) => {
  return {
    container: {
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: "0 1%",
    },
    message: {
      textAlign: "center",
      paddingBottom: 150,
    },
  };
});

const MonitoringTab = ({ environment }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const cloudVendors = useSelector(getCloudVendors);
  const cloudService = getServiceFromEnvironment(environment, cloudVendors);

  const { envEntityId } = environment;
  const { imageType } = cloudService;
  const { msUri, searchQuery, msName, variableName, services = [] } =
    MONITORING_MICROSERVICE[imageType] ?? {};
  const [isLoading, error, microserviceData = {}] = useApi(
    getInstanceDataForMicroservicesOfManagedEntity,
    {
      id: envEntityId,
      msUri,
      searchQuery,
    },
    !envEntityId,
  );

  const embeddedService = services.find(({ iframe }) => iframe);
  const monitoringUrls =
    msName && embeddedService?.objectId && variableName?.endpoint
      ? Object.entries(microserviceData).reduce((acc, [key, value]) => {
          // create pattern to collect all ms objects
          // eg. "k8_services_list.grafana-service-loadbalancer.ingress.2.endpoints.3.link" should match to "params.ingress.0.endpoints.0.link"
          const variablePattern = [
            msName,
            embeddedService.objectId,
            variableName.endpoint.replaceAll(".0.", "\\.[0-9]+\\."),
          ].join(".");
          const re = new RegExp(variablePattern, "g");
          const isPatternMatched = re.test(key);
          return isPatternMatched ? [...acc, value] : acc;
        }, [])
      : [];

  const monitoringUrl = monitoringUrls.find((url) => url.startsWith("https"));

  const monitoringTools = services
    .filter(({ objectId }) =>
      Boolean(
        microserviceData[[msName, objectId, variableName?.endpoint].join(".")],
      ),
    )
    .map((service) => {
      const { label, objectId } = service;
      return {
        label,
        value:
          service === embeddedService
            ? monitoringUrl
            : microserviceData[
                [msName, objectId, variableName?.endpoint].join(".")
              ],
      };
    });
  const shouldShowMonitoringSelect = Boolean(monitoringTools.length);
  const [selectedMonitoringTool, setSelectedMonitoringTool] = useState();

  return (
    <Grid container className={classes.container}>
      {shouldShowMonitoringSelect && (
        <Grid
          item
          xs={12}
          container
          className={classes.environmentTitleWrapper}
        >
          <Grid item xs>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box p={1}>
                <Typography variant="body1">
                  {t("Open Monitoring Tool")}:
                </Typography>
              </Box>
              <Box p={1}>
                <SelectField
                  id="ENVIRONMENT_MONITORING_TOOL"
                  className={classes.selectInput}
                  width={170}
                  options={monitoringTools}
                  value={selectedMonitoringTool}
                  onChange={(tool) => setSelectedMonitoringTool(tool)}
                />
              </Box>
              <Box p={1}>
                <Button
                  id="ENVIRONMENT_MONITORING_LAUNCH_BUTTON"
                  variant={"contained"}
                  size="small"
                  color="primary"
                  target="_blank"
                  href={selectedMonitoringTool?.value}
                  disabled={isLoading || Boolean(error)}
                >
                  {"Launch"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: shouldShowMonitoringSelect ? "89%" : "100%" }}
      >
        {(() => {
          if (isLoading) {
            return <CircularProgress />;
          }
          if (error) {
            return (
              <Typography>
                {error.getMessage(t("Unable to load Services."))}
              </Typography>
            );
          }
          if (!monitoringUrls.length) {
            return (
              <Grid item xs={12} className={classes.message}>
                <Typography>
                  {t(
                    "There are no embedded monitoring service available for this Environment.",
                  )}
                </Typography>
              </Grid>
            );
          }
          if (!monitoringUrl) {
            return (
              <Grid item xs={12} className={classes.message}>
                <Typography>
                  {t("The service not configured as https cannot be shown.")}
                </Typography>
                <Typography>
                  {t(
                    "Please open it in the other window from the select box on the top right.",
                    { name: embeddedService?.label },
                  )}
                </Typography>
              </Grid>
            );
          }
          return (
            <iframe
              src={monitoringUrl}
              width="100%"
              height="100%"
              title={t("Monitoring Dashboard")}
              style={{ border: 0 }}
            />
          );
        })()}
      </Grid>
    </Grid>
  );
};

MonitoringTab.propTypes = {
  environment: PropTypes.object.isRequired,
};

export default MonitoringTab;
