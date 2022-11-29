import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router";

import classnames from "classnames";

import useApi from "cloudclapp/src/hooks/useApi";
import { getSecurityInstance } from "cloudclapp/src/api/security";

import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import CloudVendor from "cloudclapp/src/services/CloudVendor";
import { getCloudVendors } from "cloudclapp/src/store/designations";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import { makeStyles, Box, Divider, Typography } from "@material-ui/core";
import SecuritySummary from "./SecuritySummary";
import SecurityDetails from "./SecurityDetails";

const useStyles = makeStyles(() => ({
  box: {
    marginTop: 24,
    marginBottom: 24,
  },
  securitySummary: {
    padding: 12,
    paddingRight: 24,
  },
  securityDetails: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  errorMessage: {
    margin: 20,
    fontWeight: 500,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    paddingBottom: 15,
  },
  boxBorder: {
    width: "100%",
    boxSizing: "border-box",
    margin: 16,
  },
  divider: {
    width: "100%",
  },
}));

const DeploymentSecurity = ({
  environment,
  deployment = {},
  scanApp = true,
  scanWebApp = true,
}) => {
  const { t } = useTranslation();
  const { instanceId } = useParams();
  const cloudVendors = useSelector(getCloudVendors);
  const {
    scanApp: scanAppWorkflowPath,
    scanWebApp: scanWebAppWorkflowPath,
  } = CloudVendor.getWFUrisFromEnvironment(environment, cloudVendors);

  // When called from 'View Details' of EnvironmentSummary, depending upon 'scanApp' and 'scanWebApp' parameter - this displays webapp or image scan summary
  // On Security tab from deployments, this displays both image scan summary and web app scan summary
  const shouldShowImageScan = Boolean(scanAppWorkflowPath) && scanApp;
  const shouldShowWebAppScan = Boolean(scanWebAppWorkflowPath) && scanWebApp;

  const [
    isLoadingScanAppResult,
    ,
    scanAppResult = {},
    ,
    reloadScanAppResult,
  ] = useApi(
    getSecurityInstance,
    {
      ubiqubeId: environment.envUbiqubeId,
      workflowPath: decodeURIComponent(scanAppWorkflowPath),
      deploymentInstanceId: instanceId,
    },
    !shouldShowImageScan || !environment.envUbiqubeId,
  );

  const [
    isLoadingScanWebAppResult,
    ,
    scanWebAppResult = {},
    ,
    reloadWebScanAppResult,
  ] = useApi(
    getSecurityInstance,
    {
      ubiqubeId: environment.envUbiqubeId,
      workflowPath: decodeURIComponent(scanWebAppWorkflowPath),
      deploymentInstanceId: instanceId,
    },
    !shouldShowWebAppScan || !environment.envUbiqubeId,
  );

  const commonClasses = useCommonStyles();
  const classes = useStyles();

  if (!shouldShowImageScan && !shouldShowWebAppScan) {
    return (
      <Typography
        variant="subtitle2"
        id="DEPLOYMENT_SECURITY_ERROR_MESSAGE"
        className={classes.errorMessage}
      >
        {t("No scan available for this Environment")}
      </Typography>
    );
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        className={classnames(
          commonClasses.commonContainer,
          classes.box,
          classes.securitySummary,
        )}
      >
        {shouldShowImageScan && (
          <Box className={classes.boxBorder}>
            <Typography
              variant="subtitle2"
              id="WEB_IMAGE_SCAN_SUMMARY_TITLE"
              className={classes.title}
            >
              {t("Image Scan Summary")}
            </Typography>
            {!isLoadingScanAppResult && (
              <SecuritySummary
                instance={scanAppResult.securityInstance}
                processes={scanAppResult.availableProcesses}
                workflowPath={scanAppWorkflowPath}
                envUbiqubeId={environment.envUbiqubeId}
                applications={deployment[DEPLOYMENT_VARIABLES_NAME.APPLICATION]}
                onCloseWorkflowDialog={reloadScanAppResult}
              />
            )}
          </Box>
        )}

        {shouldShowImageScan && shouldShowWebAppScan && (
          <Divider className={classes.divider} />
        )}

        {shouldShowWebAppScan && (
          <Box className={classes.boxBorder}>
            <Typography
              variant="subtitle2"
              id="WEB_APP_SCAN_SUMMARY_TITLE"
              className={classes.title}
            >
              {t("Web App Scan Summary")}
            </Typography>
            {!isLoadingScanWebAppResult && (
              <SecuritySummary
                instance={scanWebAppResult.securityInstance}
                processes={scanWebAppResult.availableProcesses}
                workflowPath={scanWebAppWorkflowPath}
                envUbiqubeId={environment.envUbiqubeId}
                applications={deployment[DEPLOYMENT_VARIABLES_NAME.APPLICATION]}
                onCloseWorkflowDialog={reloadWebScanAppResult}
              />
            )}
          </Box>
        )}
      </Box>

      {(scanAppResult?.securityInstance ||
        scanWebAppResult?.securityInstance) && (
        <Box
          className={classnames(
            commonClasses.commonContainer,
            classes.box,
            classes.securityDetails,
          )}
        >
          <SecurityDetails
            instance={scanAppResult?.securityInstance}
            webAppScanInstance={scanWebAppResult?.securityInstance}
          />
        </Box>
      )}
    </>
  );
};

DeploymentSecurity.propTypes = {
  environment: PropTypes.object.isRequired,
  deployment: PropTypes.object,
  cloudVendor: PropTypes.object.isRequired,
};

export default DeploymentSecurity;
