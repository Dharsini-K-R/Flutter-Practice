import React, { useMemo } from "react";

import {
  Box,
  Typography,
  Grid,
  makeStyles,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import AddApplicationDialog from "cloudclapp/src/components/deployments/AddApplicationDialog";
import ApplicationSummaryTile from "cloudclapp/src/components/deployments/ApplicationSummaryTile";
import AddApplicationTile from "cloudclapp/src/components/deployments/AddApplicationTile";
import MSAConsole from "cloudclapp/src/components/ccla-console";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import { WORKFLOW_STATUS } from "cloudclapp/src/Constants";
import Variable from "msa2-ui/src/services/Variable";

const useStyles = makeStyles(({ palette }) => ({
  topPadding: {
    paddingBottom: "5%",
  },
  boxWidthPadding: {
    width: "100%",
    paddingTop: "1%",
    paddingBottom: "1%",
  },
  buttonText: {
    fontSize: 16,
    color: palette.primary.main,
    marginLeft: 6,
    boxSizing: "border-box",
    textAlign: "left",
  },
}));

const AddDeployment = ({ workflowContext, showOnlyVMs }) => {
  const showOnlyVMTab = showOnlyVMs === "virtual-machine";

  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [showAddApplicationDialog, setShowAddApplication] = React.useState(
    false,
  );
  const [scanIds, setScanIds] = React.useState([]);
  const [scanAllClicked, setScanAllClicked] = React.useState([false]);

  const openAddApplicationDialog = () => {
    setShowAddApplication(true);
  };
  const closeAddApplicationDialog = () => {
    setShowAddApplication(false);
  };

  const deleteSelectedApplication = (removeSlug) => {
    context[DEPLOYMENT_VARIABLES_NAME.APPLICATION].splice(
      context[DEPLOYMENT_VARIABLES_NAME.APPLICATION].findIndex(
        (dockerImage) =>
          dockerImage[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG] ===
          removeSlug,
      ),
      1,
    );
    setContext(
      context[DEPLOYMENT_VARIABLES_NAME.APPLICATION],
      DEPLOYMENT_VARIABLES_NAME.APPLICATION,
    );
  };

  const getIndexOnScanArray = (slug) => {
    return scanIds.findIndex((scanData) => scanData["slug"] === slug);
  };

  const updateScanData = (applicationSlug, scanId) => {
    const scanIndex = getIndexOnScanArray(applicationSlug);
    if (scanIndex < 0) {
      //add a new entry to scanId array - first time scan of an image
      let scanEntry = {};
      scanEntry = {
        slug: applicationSlug,
        scanIdentifier: scanId,
        scanStatus: WORKFLOW_STATUS.RUNNING.status,
        scanResult: {},
      };
      scanIds.push(scanEntry);
    } else {
      //update new scan id and start scan - to address paused or failed scans
      scanIds[scanIndex].scanIdentifier = scanId;
      scanIds[scanIndex].scanStatus = WORKFLOW_STATUS.RUNNING.status;
    }
    setScanIds(scanIds);
  };

  const stopSelectedScan = (slug) => {
    scanIds[getIndexOnScanArray(slug)].scanStatus = "STOPPED";
    setScanIds(scanIds);
  };

  const updateResultOfScan = (slug, runStatus, runDate, vulnerabilityData) => {
    scanIds[getIndexOnScanArray(slug)].scanStatus = runStatus;
    scanIds[getIndexOnScanArray(slug)].scanResult = {
      scanDate: runDate,
      vulnerabilities: vulnerabilityData,
    };
    setScanIds(scanIds);
  };

  const scanAllImages = () => {
    context[DEPLOYMENT_VARIABLES_NAME.APPLICATION].forEach((data) => {
      const scanIndex = getIndexOnScanArray(
        data[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
      );
      if (scanIndex < 0) {
        //for first time scan of an image
        let scanEntry = {};
        scanEntry = {
          slug: data[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
          scanIdentifier: "",
          scanStatus: WORKFLOW_STATUS.NONE.status,
          scanResult: {},
        };
        scanIds.push(scanEntry);
        setScanIds(scanIds);
      } else if (
        scanIds[scanIndex].scanStatus !== "SUCCESS" &&
        scanIds[scanIndex].scanStatus !== WORKFLOW_STATUS.RUNNING.status
      ) {
        //reset scan status to NONE - lets useEffect on ApplicationSummaryTile trigger new scan [to address paused or failed scans]
        scanIds[scanIndex].scanIdentifier = "";
        scanIds[scanIndex].scanStatus = WORKFLOW_STATUS.NONE.status;
        setScanIds(scanIds);
      }
    });
    // trick to force component to reload when scan all is clicked - lets summarytile read array and start scan
    setScanAllClicked(scanAllClicked ? false : true);
  };

  const {
    context,
    setContext,
    variables,
    processVariables,
    editMode,
    processInstance,
    isLoading,
  } = workflowContext;

  // We are caching application variable default values
  const applicationDefaultValues = useMemo(() => {
    return Variable.getDefaultValueByDeepTableSection({
      data: context,
      deepTableVariable: DEPLOYMENT_VARIABLES_NAME.APPLICATION,
      variables,
    });
  }, [context, variables]);

  const handleAddApplicationsToContext = (applicationsToAdd) => {
    const applications = context[DEPLOYMENT_VARIABLES_NAME.APPLICATION] ?? [];
    const updatedApplicationsToAdd = applicationsToAdd.map((application) => {
      return { ...applicationDefaultValues, ...application };
    });

    const contextData = applications.concat(
      updatedApplicationsToAdd.filter(
        (item) =>
          applications.findIndex(
            (contextItem) =>
              contextItem[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG] ===
              item[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
          ) < 0,
      ),
    );

    setContext(contextData, DEPLOYMENT_VARIABLES_NAME.APPLICATION);
  };

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : processInstance ? (
        <WorkflowLiveConsole processInstance={processInstance} />
      ) : (
        <Box>
          <Grid
            className={classes.topPadding}
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
          >
            <Typography
              variant="h4"
              className={commonClasses.commonDialogHeaderTitle}
              id="Add_Deployment_Form_Applications_Text"
            >
              {t("Application Images")}
            </Typography>
            <Grid
              container
              spacing={2}
              justifyContent="flex-end"
              alignItems="flex-end"
              direction="row"
            >
              {showOnlyVMs === "docker-hub" &&
                context[DEPLOYMENT_VARIABLES_NAME.APPLICATION]?.length > 0 && (
                  <Button
                    id="PRESCAN_ALL_IMAGES"
                    onClick={() => scanAllImages()}
                  >
                    <Typography
                      id="docker_all_image_scan"
                      className={classes.buttonText}
                    >
                      {" "}
                      {t("Scan All Images")}{" "}
                    </Typography>
                  </Button>
                )}
            </Grid>

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
                {context[DEPLOYMENT_VARIABLES_NAME.APPLICATION]?.map(
                  (data, index) => {
                    const imageId =
                      data[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG];
                    return (
                      <ApplicationSummaryTile
                        key={imageId}
                        input={data}
                        deleteItemCallBack={deleteSelectedApplication}
                        scanItemCallBack={updateScanData}
                        stopScanCallBack={stopSelectedScan}
                        getScanResultCallBack={updateResultOfScan}
                        showScan={showOnlyVMs === "docker-hub"}
                        scanDetail={scanIds}
                      />
                    );
                  },
                )}
                {((showOnlyVMTab &&
                  !context[DEPLOYMENT_VARIABLES_NAME.APPLICATION]?.length) ||
                  !showOnlyVMTab) && (
                  <AddApplicationTile
                    addApplicationCallBack={openAddApplicationDialog}
                  />
                )}
              </Grid>
            </Box>
          </Grid>

          <Grid
            className={classes.topPadding}
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
          >
            <Typography
              variant="h4"
              className={commonClasses.commonDialogHeaderTitle}
              id="Add_Deployment_Form_Deployment_Text"
            >
              {t("Create a Deployment")}
            </Typography>

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
                  data={context}
                  variables={variables}
                  processVariables={processVariables}
                  editMode={editMode}
                  onChange={setContext}
                />
              </Grid>
            </Box>
          </Grid>
        </Box>
      )}

      {showAddApplicationDialog && (
        <AddApplicationDialog
          visibleTab={showOnlyVMs}
          onClose={closeAddApplicationDialog}
          addApplicationsToContext={handleAddApplicationsToContext}
        />
      )}
    </Box>
  );
};

export default AddDeployment;
