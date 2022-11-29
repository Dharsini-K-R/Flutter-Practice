import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import flow from "lodash/flow";
import flatten from "lodash/flatten";
import countBy from "lodash/countBy";
import { isEmpty } from "lodash";

import { getToken } from "cloudclapp/src/store/auth";
import { readRepository } from "msa2-ui/src/api/repository";
import SecurityChip from "cloudclapp/src/components/security-chip/SecurityChip";

import {
  SECURITY_VARIABLES_NAME,
  SECURITY_SEVERITIES,
  workflowStatus,
  WORKFLOW_STATUS,
} from "cloudclapp/src/Constants";
import { downloadArchive } from "msa2-ui/src/api/repository";

import {
  makeStyles,
  Box,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { DownloadIcon } from "react-line-awesome";

const TABLE_HEADER_COLUMNS = [
  {
    id: SECURITY_VARIABLES_NAME.RESULT_TYPE,
    label: "Type",
    align: "left",
    width: "20%",
  },
  {
    id: SECURITY_VARIABLES_NAME.ROW_NAME,
    label: "Name",
    align: "left",
  },
  {
    id: SECURITY_VARIABLES_NAME.ROW_VULNERABILITIES,
    label: "Vulnerabilities",
    align: "left",
    width: "35%",
  },
  {
    id: SECURITY_VARIABLES_NAME.ROW_STATUS,
    label: "Status",
    align: "left",
    width: "20%",
  },
  {
    id: SECURITY_VARIABLES_NAME.ROW_RESULT,
    label: "Report",
    icon: true,
    align: "left",
    width: "5%",
  },
];

const useStyles = makeStyles(() => ({
  titleWrapper: {
    paddingRight: 16,
    paddingLeft: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: 500,
  },
  chip: {
    borderRadius: 12,
    marginLeft: 8,
    fontWeight: 400,
  },
}));

const SecurityDetails = ({ instance, webAppScanInstance }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const token = useSelector(getToken);
  const [severities, setSeverities] = useState();
  const status =
    webAppScanInstance?.status.status ?? WORKFLOW_STATUS.NONE.status;
  const { securityLabel } =
    workflowStatus.find((wf) => wf.status === status) ?? {};

  const showMultipleType = Boolean(instance) && Boolean(webAppScanInstance);
  const columnsToShow = TABLE_HEADER_COLUMNS.filter(({ id }) =>
    id === SECURITY_VARIABLES_NAME.RESULT_TYPE ? showMultipleType : true,
  );

  useEffect(() => {
    // Collect severities
    const collectSeverity = ({ content }) =>
      content.vulnerabilities.map(({ severity }) => severity);
    const getReports = async () => {
      // return if there are no apps scanned
      if (!instance?.variables[SECURITY_VARIABLES_NAME.ROW]?.length) return;

      const reports = await Promise.all(
        instance.variables[SECURITY_VARIABLES_NAME.ROW].map((variable) =>
          readRepository({
            token,
            uri: variable[SECURITY_VARIABLES_NAME.ROW_RESULT],
            transforms: [collectSeverity],
          }),
        ),
      );
      const severities = flow(
        (reports) => reports.map(([, severities]) => severities),
        flatten,
        countBy,
      )(reports);
      setSeverities(severities);
    };
    getReports();
  }, [instance, token]);

  const getDownloadIcon = (label, idPrefix, id, downloadPath) => {
    return (
      <Tooltip title={t("Download item", { item: label })}>
        <IconButton
          id={`${idPrefix}_${id}`}
          className={classes.tableIcon}
          disabled={
            isEmpty(downloadPath) || downloadPath === "No Vulnerabilities Found"
              ? true
              : false
          }
          onClick={() => {
            enqueueSnackbar(t("Downloading..."));
            downloadArchive({
              path: downloadPath,
              token,
              onError: ({ getMessage }) => {
                enqueueSnackbar(getMessage(t("Unable to download contents")), {
                  variant: "error",
                });
              },
            });
          }}
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Grid container p={1}>
      <Grid item xs={12} className={classes.titleWrapper}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box p={1}>
            <Typography variant="subtitle2" className={classes.title}>
              {t("Risk Level")}
            </Typography>
          </Box>
          <Box p={1}>
            {Object.values(SECURITY_SEVERITIES).map(
              ({ id, label, color, countKey }) => {
                const count =
                  (severities?.[id] ?? 0) +
                  (webAppScanInstance?.variables[countKey] ?? 0);
                return (
                  <SecurityChip
                    count={count}
                    idPrefix="SECURITY_DETAILS_SEVERITY_"
                    severityId={id}
                    color={color}
                    label={label}
                  />
                );
              },
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Table>
          <colgroup>
            {columnsToShow.map(({ id, width }) => (
              <col key={id} style={{ width }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow>
              {columnsToShow.map(({ id, label }) => (
                <TableCell key={id}>
                  <Typography
                    id={`SECURITY_DETAILS_TABLE_HEADER_${id}`}
                    variant="subtitle2"
                    className={classes.tableHeader}
                  >
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {instance?.variables[SECURITY_VARIABLES_NAME.ROW]?.map(
              (variable, index) => {
                return (
                  <TableRow key={index}>
                    {columnsToShow.map(({ id, align, icon, label }) => (
                      <TableCell key={id} align={align}>
                        {icon ? (
                          getDownloadIcon(
                            label,
                            "SECURITY_DETAILS_TABLE_ICON",
                            `${id}_${index}`,
                            variable[id],
                          )
                        ) : (
                          <Typography
                            variant="body1"
                            id={`SECURITY_DETAILS_TABLE_${id}_${index}`}
                          >
                            {id ===
                              SECURITY_VARIABLES_NAME.ROW_VULNERABILITIES &&
                              Object.values(SECURITY_SEVERITIES).map(
                                ({ id, color, countKey }) => {
                                  const count = variable[countKey]
                                    ? variable[countKey]
                                    : 0;
                                  return (
                                    <SecurityChip
                                      count={count}
                                      idPrefix={`SECURITY_DETAILS_SEVERITY_SPLITUP_${index}`}
                                      severityId={id}
                                      color={color}
                                    />
                                  );
                                },
                              )}
                            {id === SECURITY_VARIABLES_NAME.ROW_NAME &&
                              variable[id]}
                            {id === SECURITY_VARIABLES_NAME.RESULT_TYPE &&
                              t("Image Scan")}
                            {id === SECURITY_VARIABLES_NAME.ROW_STATUS &&
                              variable[id]}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              },
            )}
            {webAppScanInstance && (
              <TableRow key={"WEB_APP_SCAN_ROW"}>
                {columnsToShow.map(({ id, align, icon, label }) => (
                  <TableCell key={id} align={align}>
                    {icon ? (
                      getDownloadIcon(
                        label,
                        "SECURITY_DETAILS_TABLE_WEB_APP_SCAN_ICON",
                        id,
                        webAppScanInstance.variables.alerts_json_file,
                      )
                    ) : (
                      <Typography
                        variant="body1"
                        id={`SECURITY_DETAILS_TABLE_WEB_APP_SCAN_${id}`}
                      >
                        {id === SECURITY_VARIABLES_NAME.ROW_VULNERABILITIES &&
                          Object.values(SECURITY_SEVERITIES).map(
                            ({ id, color, countKey }) => {
                              const count = webAppScanInstance.variables[
                                countKey
                              ]
                                ? webAppScanInstance.variables[countKey]
                                : 0;
                              return (
                                <SecurityChip
                                  count={count}
                                  idPrefix="WEBAPP_SECURITY_DETAILS_SEVERITY_SPLITUP"
                                  severityId={id}
                                  color={color}
                                />
                              );
                            },
                          )}
                        {id === SECURITY_VARIABLES_NAME.ROW_NAME &&
                          webAppScanInstance.variables.target}
                        {id === SECURITY_VARIABLES_NAME.RESULT_TYPE &&
                          t("Web App Scan")}
                        {id === SECURITY_VARIABLES_NAME.ROW_STATUS &&
                          securityLabel}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default SecurityDetails;
