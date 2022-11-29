import React from "react";
import { useParams } from "react-router";

import { formatDateOrString } from "msa2-ui/src/utils/date";

import useWorkflowDialog from "cloudclapp/src/hooks/useWorkflowDialog";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useTranslation } from "react-i18next";

import {
  DEPLOYMENT_VARIABLES_NAME,
  SECURITY_VARIABLES_NAME,
  workflowStatus,
  WORKFLOW_STATUS,
} from "cloudclapp/src/Constants";

import { makeStyles, Button, Grid, Typography } from "@material-ui/core";

import SecurityStatusIcon from "cloudclapp/src/components/security-status-icon";

const useStyles = makeStyles(({ palette }) => ({
  iconWrapper: {
    width: 75,
    marginBottom: 20,
  },
  lastScannedTime: {
    fontStyle: "italic",
    color: palette.text.support,
  },
  processButton: {
    marginLeft: 25,
  },
  buttonText: {
    fontSize: 14,
    color: palette.primary.main,
  },
  viewButton: {
    padding: 0,
  },
}));

const SecuritySummary = ({
  instance,
  processes,
  workflowPath,
  envUbiqubeId,
  applications = [],
  onCloseWorkflowDialog,
}) => {
  const isSecurityResultAvailable = Boolean(instance);
  const { t } = useTranslation();
  const { instanceId } = useParams();
  const {
    showWorkflowDialog,
    WorkflowDialog,
    ...workflowDialogProps
  } = useWorkflowDialog({
    onClose: onCloseWorkflowDialog,
    workflowPath,
    ubiqubeId: envUbiqubeId,
    instanceId: instance?.instanceId,
    defaultContext: isSecurityResultAvailable
      ? {}
      : {
          [SECURITY_VARIABLES_NAME.ROW]: applications.map((application) => ({
            [SECURITY_VARIABLES_NAME.ROW_NAME]:
              application[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
          })),
          [SECURITY_VARIABLES_NAME.SERVICE_ID]: instanceId,
        },
  });

  const status = instance?.status.status ?? WORKFLOW_STATUS.NONE.status;
  const { securityLabel, color } =
    workflowStatus.find((wf) => wf.status === status) ?? {};
  const classes = useStyles();

  const [showWFLiveConsole, setWFLiveConsole] = React.useState(false);

  const openWFLiveConsoleDialog = () => {
    setWFLiveConsole(true);
  };
  const closeWFLiveConsoleDialog = () => {
    setWFLiveConsole(false);
    onCloseWorkflowDialog();
  };

  return (
    <Grid container spacing={2}>
      <WorkflowDialog {...workflowDialogProps} />
      <Grid item xs={8} container>
        <Grid
          item
          className={classes.iconWrapper}
          container
          alignContent="center"
        >
          <SecurityStatusIcon
            id="SECURITY_SUMMARY_STATUS_ICON"
            status={status}
          />
        </Grid>
        <Grid item>
          <Typography
            id="SECURITY_SUMMARY_STATUS"
            variant="h5"
            style={{ color }}
          >
            {securityLabel}
          </Typography>
          <Typography
            id="SECURITY_SUMMARY_LAST_SCANNED"
            variant="body1"
            className={classes.lastScannedTime}
          >
            {formatDateOrString(
              instance?.status.endingDate,
              "dd MMM yyyy HH:mm:ss",
            )}
          </Typography>
          {status !== WORKFLOW_STATUS.NONE.status && (
            <Button
              id="SECURITY_SUMMARY_WFLIVECONSOLE_BUTTON"
              className={classes.viewButton}
              onClick={() => {
                openWFLiveConsoleDialog();
              }}
            >
              <Typography
                id="SECURITY_SUMMARY_DETAILS_BUTTON"
                className={classes.buttonText}
              >
                {t("View Details")}
              </Typography>
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={4}
        container
        justifyContent="flex-end"
        alignContent="flex-start"
      >
        {showWFLiveConsole && (
          <Dialog
            maxWidth="md"
            onClose={closeWFLiveConsoleDialog}
            title={t("Scan Status")}
          >
            <WorkflowLiveConsole
              processId={instance.status.processInstanceId}
            />
          </Dialog>
        )}

        {processes?.map((securityProcess, i) => {
          const { displayName } = securityProcess;
          return (
            <Button
              key={i}
              id={`SECURITY_SUMMARY_PROCESS_BUTTON_${i}_${instance?.instanceId}`}
              className={classes.processButton}
              onClick={() => {
                showWorkflowDialog(securityProcess);
              }}
            >
              <Typography>{displayName}</Typography>
            </Button>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default SecuritySummary;
