import React, { useState, useRef } from "react";
import {
  Grid,
  Typography,
  makeStyles,
  Button,
  Popover,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import SelectSearch from "msa2-ui/src/components/SelectSearch";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles.js";
import { useTranslation } from "react-i18next";
import Process from "msa2-ui/src/services/Process";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import classnames from "classnames";
import useWorkflowContext from "cloudclapp/src/hooks/useWorkflowDialog";

const useStyles = makeStyles(({ palette, typography, breakpoints }) => {
  return {
    buttonText: {
      borderRadius: 4,
      padding: "6px 10px",
      fontSize: 15,
      boxSizing: "border-box",
      alignItems: "center",
    },
    deploymentActions: {
      display: "flex",
      alignItems: "center",
    },
    actionsButtonText: {
      border: "1px solid #384052",
      color: palette.text.primary,
    },
    disabledButtonText: {
      border: `1px solid ${palette.text.support}`,
      color: palette.text.secondary,
      backgroundColor: "rgba(68,93,110,0.1)",
    },
    disableMoreActions: {
      cursor: "default",
      color: palette.text.secondary,
    },
    moreActionsWrapper: {
      cursor: "pointer",
      width: "fit-content",
      alignItems: "center",
    },
    moreActions: {
      fontSize: 13,
      letterSpacing: 0.3,
      fontWeight: typography.fontWeightMedium,
      color: palette.primary.main,
      cursor: "pointer",
      [breakpoints.only("xs")]: {
        marginLeft: 0,
      },
      margin: 4,
    },
  };
});

const WorkflowInstance = ({
  workflowData,
  envUbiqubeId,
  instanceId,
  afterExec,
  disableProcessButton = false,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const commonClasses = useCommonStyles();
  const [shouldShowProcessPicker, setShouldShowProcessPicker] = useState(false);
  const processPickerAnchorRef = useRef(null);

  const nonCreateProcesses =
    workflowData?.process.filter(
      (processObject) => !Process.isCreate(processObject.type),
    ) ?? [];
  const workflowPath = workflowData?.metaInformationList[0].serviceName;
  const {
    showWorkflowDialog,
    WorkflowDialog,
    ...workflowDialogProps
  } = useWorkflowContext({
    workflowPath,
    ubiqubeId: envUbiqubeId,
    instanceId: instanceId,
    afterExec,
  });

  const xl = useMediaQuery(theme.breakpoints.up("xl"), { noSsr: true });
  const lg = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const md = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const sm = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const ACTION_COUNT = [6, 5, 2, 0, 0];
  const processesCount =
    ACTION_COUNT[[xl, lg, md, sm, true].findIndex((bp) => bp)];

  return (
    <Grid container xs item className={commonClasses.commonXSOnlyFlexStart}>
      <WorkflowDialog {...workflowDialogProps} />
      {nonCreateProcesses?.slice(0, processesCount)?.map((process, index) => (
        <Button
          disabled={disableProcessButton}
          variant="text"
          key={process.displayName}
          id={`DEPLOYMENT_DETAILS_ACTION_BUTTON_${index}`}
          onClick={() => {
            showWorkflowDialog(process);
          }}
          style={{ maxWidth: 200 }}
        >
          <Typography
            id={`DEPLOYMENT_DETAILS_ACTION_NAME_${index}`}
            className={`${classes.buttonText} ${
              commonClasses.commonTextEllipsis
            } ${
              disableProcessButton
                ? classes.disabledButtonText
                : classes.actionsButtonText
            }`}
          >
            {process.displayName}
          </Typography>
        </Button>
      ))}
      {nonCreateProcesses?.length > processesCount && (
        <Grid item className={classes.deploymentActions}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */}
          <Grid
            container
            id={`DEPLOYMENT_DETAILS_BTN_MORE_ACTIONS`}
            className={classnames(
              commonClasses.commonFlexStart,
              disableProcessButton
                ? classes.disableMoreActions
                : classes.moreActionsWrapper,
            )}
            onClick={() =>
              disableProcessButton
                ? setShouldShowProcessPicker(false)
                : setShouldShowProcessPicker(true)
            }
            role="button"
            ref={processPickerAnchorRef}
          >
            <Typography
              variant="body1"
              className={classnames(
                disableProcessButton
                  ? classes.disableMoreActions
                  : classes.moreActions,
                {},
              )}
            >
              {t("More Actions")}
            </Typography>
            {shouldShowProcessPicker ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown
                className={classnames(classes.arrowIcon, {})}
              />
            )}
          </Grid>
          <Popover
            id={`DEPLOYMENT_DETAILS_PO_MORE_ACTIONS`}
            open={shouldShowProcessPicker}
            anchorEl={processPickerAnchorRef.current}
            onClose={() => setShouldShowProcessPicker(false)}
            classes={{ paper: classes.paper }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div className={commonClasses.commonPopoverContainer}>
              <SelectSearch
                id={`DEPLOYMENT_DETAILS_SS_MORE_ACTIONS`}
                options={nonCreateProcesses.map((prc, i) => {
                  const { icon } = Process.processDefinitions[prc.type];
                  return {
                    id: i,
                    label: prc.displayName,
                    name: prc.name,
                    icon,
                    workflowProcess: prc,
                  };
                })}
                noOptionText={t("Process not found.")}
                onSelect={(_, { workflowProcess }) => {
                  showWorkflowDialog(workflowProcess);
                }}
              />
            </div>
          </Popover>
        </Grid>
      )}
    </Grid>
  );
};

export default WorkflowInstance;
