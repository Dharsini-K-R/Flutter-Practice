import React, { useEffect } from "react";
import { ImageIcon, TrashAltIcon, StopCircleIcon } from "react-line-awesome";
import {
  Box,
  Typography,
  Grid,
  makeStyles,
  Button,
  Tooltip,
  Avatar,
} from "@material-ui/core";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { useInterval } from "react-use";
import {
  WORKFLOW_STATUS,
  SECURITY_SEVERITIES,
  workflowStatus,
} from "cloudclapp/src/Constants";
import SecurityStatusIcon from "cloudclapp/src/components/security-status-icon";
import { formatDateOrString } from "msa2-ui/src/utils/date";
import {
  postImageScanRequest,
  getScanResult,
} from "cloudclapp/src/api/security";
import SecurityChip from "cloudclapp/src/components/security-chip/SecurityChip";
import { getToken } from "cloudclapp/src/store/auth";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import classnames from "classnames";

const useStyles = makeStyles(({ palette, typography }) => ({
  dockerImageBoxBorder: {
    width: "50%",
    boxSizing: "border-box",
    borderRadius: "4px",
    "&.MuiBox-root": {
      padding: "10px 10px 10px 1px",
    },
  },
  dockerGridBorder: {
    border: "1px solid #B2BCCE",
    width: "100%",
    height: "150px",
    boxSizing: "border-box",
    borderRadius: "4px",
    backgroundColor: "rgba(68,93,110,0.1)",
    padding: "20px 10px 10px 1px",
  },
  text: {
    boxSizing: "border-box",
    textAlign: "left",
  },
  versionText: {
    color: palette.text.support,
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  dockerDescriptionText: {
    paddingTop: "1%",
    color: typography.body1.color,
    lineHeight: "16px",
    paddingBottom: "1%",
  },
  icon: {
    fontSize: "25px",
    boxSizing: "border-box",
    color: palette.background.appBar,
    paddingLeft: "1%",
    paddingBottom: "1%",
  },
  dockerName: {
    fontWeight: "500",
    color: typography.body1.color,
    textAlign: "left",
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  buttonText: {
    fontSize: 16,
    color: palette.primary.main,
    marginLeft: 6,
  },
  lastScannedTime: {
    fontStyle: "italic",
    color: palette.text.support,
  },
  scanResultWrapper: {
    paddingTop: "1%",
  },
  statusAvatar: {
    width: 40,
    height: 40,
    marginRight: 15,
    boxShadow: "0 4px 16px 0px rgb(0 0 0 / 10%)",
    backgroundColor: palette.background.paper,
  },
  disabledButton: {
    cursor: "default",
    color: palette.text.secondary,
  },
  footer: {
    alignSelf: "flex-end",
  },
}));

const ApplicationSummaryTile = ({
  input,
  deleteItemCallBack,
  showScan,
  scanItemCallBack,
  stopScanCallBack,
  getScanResultCallBack,
  scanDetail,
  Footer,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const indexAtScanData = scanDetail
    ? scanDetail.findIndex(
        (scanData) =>
          scanData["slug"] ===
          input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
      )
    : -1;

  const scanId =
    indexAtScanData < 0 ? "" : scanDetail[indexAtScanData]?.scanIdentifier;

  const scanStatus =
    indexAtScanData < 0 ? "" : scanDetail[indexAtScanData].scanStatus;

  const disableScanButton =
    indexAtScanData >= 0 &&
    (scanDetail[indexAtScanData].scanStatus === "SUCCESS" ||
      scanDetail[indexAtScanData].scanStatus === "RUNNING");

  const [componentState, setComponentState] = React.useState("");
  const token = useSelector(getToken);
  const processStatus =
    workflowStatus.find(
      (arr) => arr.status === WORKFLOW_STATUS.RUNNING.status,
    ) ?? {};
  const { securityLabel, iconBig: ProcessStatusIcon, color } = processStatus;

  const startScan = async () => {
    if (
      indexAtScanData < 0 ||
      scanDetail[indexAtScanData].scanStatus !== "SUCCESS"
    ) {
      const [error, response] = await postImageScanRequest({
        containerName: input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
        token,
      });
      if (error) {
        enqueueSnackbar(error.getMessage(t("Unable to start Scan.")), {
          variant: "error",
        });
        return;
      }
      scanItemCallBack(
        input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
        response.scanId,
      );
      setComponentState(WORKFLOW_STATUS.RUNNING.status);
    }
  };

  const stopScan = () => {
    stopScanCallBack(input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]);
    setComponentState("STOPPED");
  };

  useInterval(
    async () => {
      const [error, scanResult] = await getScanResult({ scanId, token });
      if (error) {
        enqueueSnackbar(error.getMessage(t("Unable to get Scan result.")), {
          variant: "error",
        });
        return;
      }
      if (
        scanResult?.body?.runStatus !== "RUNNING" &&
        scanResult?.body?.runStatus !== "NOT_STARTED"
      ) {
        getScanResultCallBack(
          input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
          scanResult?.body?.runStatus,
          scanResult.body.end,
          scanResult.body.vulnerabilities,
        );
        setComponentState(scanResult?.body?.runStatus);
      }
    },
    isEmpty(scanId) || scanStatus !== WORKFLOW_STATUS.RUNNING.status
      ? null
      : 1000,
  );

  useEffect(() => {
    if (
      indexAtScanData >= 0 && // clicking on scan all images, adds image to scan data array
      componentState !== "WORKFLOW_STATUS.RUNNING.status" && //  the component is not already running scan
      scanDetail[indexAtScanData].scanStatus === "NONE"
    ) {
      // to ensure start scan runs automatically only when scan all images options is used
      startScan();
    }
  });

  return (
    <Box component="span" p={6} className={classes.dockerImageBoxBorder}>
      <Grid
        container
        justifyContent="center"
        alignItems="flex-start"
        direction="row"
        className={classes.dockerGridBorder}
      >
        <Grid item xs={2}>
          {!isEmpty(input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]) ? (
            <img
              alt="Docker Logo"
              width="50px"
              height="50px"
              src={input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]}
            />
          ) : (
            <ImageIcon className={classes.icon} />
          )}
        </Grid>

        <Grid item xs={10}>
          <Grid item>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  id={`docker_image_name_${
                    input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                  }`}
                  className={`${classes.text} ${classes.dockerName}`}
                >
                  {" "}
                  {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]}{" "}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                {showScan && (
                  <Box>
                    <Button
                      id={`application_summary_tile_scan_button_${
                        input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                      }`}
                      onClick={() => startScan()}
                      disabled={disableScanButton}
                    >
                      <Typography
                        id={`docker_image_scan_${
                          input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                        }`}
                        className={classnames(
                          classes.buttonText,
                          classes.text,
                          {
                            [classes.disabledButton]: disableScanButton,
                          },
                        )}
                      >
                        {" "}
                        {t("Scan")}{" "}
                      </Typography>
                    </Button>
                  </Box>
                )}

                {deleteItemCallBack && (
                  <Box>
                    <Button
                      id={`application_summary_tile_delete_button_${
                        input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                      }`}
                      onClick={() =>
                        deleteItemCallBack(
                          input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
                        )
                      }
                    >
                      <TrashAltIcon className={classes.icon} />{" "}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Typography
              id={`docker_image_version_${
                input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
              }`}
              className={`${classes.text} ${classes.versionText}`}
            >
              {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_VERSION]}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              id={`docker_image_description_${
                input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
              }`}
              className={`${classes.text} ${classes.dockerDescriptionText}`}
            >
              {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="center"
          alignItems="flex-end"
          direction="row"
        >
          {scanStatus === WORKFLOW_STATUS.RUNNING.status && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyItems="flex-end"
            >
              <Box>
                <Avatar
                  className={classes.statusAvatar}
                  style={{
                    color,
                    animation:
                      // reusing anim from line-awesome
                      "la-spin 1s infinite linear",
                  }}
                >
                  {" "}
                  <ProcessStatusIcon />
                </Avatar>
              </Box>
              <Typography
                id={`PRE_DEPLOYMENT_SCAN_STATUS_ICON_${
                  input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                }`}
                variant="h5"
                style={{ color }}
              >
                {securityLabel}
              </Typography>
              <Tooltip title={t("Stop Scanning")}>
                <Button
                  id={`PRE_DEPLOYMENT_SCAN_STOP_${
                    input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                  }`}
                  onClick={() => stopScan()}
                >
                  <StopCircleIcon className={classes.icon} />{" "}
                </Button>
              </Tooltip>
            </Box>
          )}
          {scanStatus === "SUCCESS" && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyItems="flex-end"
            >
              <Box>
                <SecurityStatusIcon
                  id={`PRE_DEPLOYMENT_SCAN_STATUS_ICON_${
                    input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                  }`}
                  status="ENDED"
                />
              </Box>
              <Typography
                className={classes.scanResultWrapper}
                id={`PRE_DEPLOYMENT_SCAN_RESULT_LABEL_${
                  input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                }`}
                variant="subtitle2"
              >
                {" "}
                {t("Last Scanned")} {":"}{" "}
              </Typography>
              <Typography
                className={`${classes.scanResultWrapper} ${classes.lastScannedTime}`}
                id={`PRE_DEPLOYMENT_SCAN_LAST_SCANNED_${
                  input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                }`}
                variant="subtitle2"
              >
                {" "}
                {formatDateOrString(
                  scanDetail[indexAtScanData].scanResult.scanDate,
                  "dd MMM yyyy HH:mm:ss",
                )}{" "}
              </Typography>
              <Box>
                {Object.values(SECURITY_SEVERITIES).map(({ id, color }) => {
                  const count = scanDetail[
                    indexAtScanData
                  ].scanResult.vulnerabilities.filter(
                    ({ severity }) => severity === id,
                  ).length;
                  return (
                    <SecurityChip
                      count={count}
                      idPrefix={`${
                        input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                      }_PRESCAN_SEVERITY_`}
                      severityId={id}
                      color={color}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
          {scanStatus === "FAILED" && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyItems="flex-end"
            >
              <Box>
                <SecurityStatusIcon
                  id={`PRE_DEPLOYMENT_SCAN_STATUS_ICON_${
                    input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                  }`}
                  status="FAIL"
                />
              </Box>
              <Typography
                className={classes.scanResultWrapper}
                id={`PRE_DEPLOYMENT_SCAN_RESULT_LABEL_${
                  input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                }`}
                variant="subtitle2"
              >
                {" "}
                {t("Scan Failed")}{" "}
              </Typography>
            </Box>
          )}
        </Grid>

        {Footer && (
          <Grid
            item
            xs={12}
            container
            justifyContent="flex-end"
            className={classes.footer}
          >
            <Footer />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ApplicationSummaryTile;
