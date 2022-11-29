import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Deployment from "cloudclapp/src/services/Deployment";
import CloudVendor, {
  getServiceFromEnvironment,
} from "cloudclapp/src/services/CloudVendor";
import {
  getOrganisation,
  getCloudVendors,
} from "cloudclapp/src/store/designations";

import CloudConnectionStep from "../quick-deployment-steps/CloudConnectionStep";
import EnvironmentStep from "../quick-deployment-steps/EnvironmentStep";
import DeploymentStep from "../quick-deployment-steps/DeploymentStep";
import DeployStep from "../quick-deployment-steps/DeployStep";
import Completed from "../quick-deployment-steps/Completed";
import useWorkflowContext from "cloudclapp/src/hooks/useWorkflowContext";
import useWorkflowInstance from "cloudclapp/src/hooks/useWorkflowInstance";
import { QUICK_DEPLOYMENT_STEPS } from "cloudclapp/src/Constants";

import { styled } from "@material-ui/styles";
import {
  makeStyles,
  Grid,
  Button,
  Box,
  Stepper,
  StepLabel,
  Step,
  Divider,
  Tooltip,
} from "@material-ui/core";
import {
  CloudIcon,
  CloudUploadAltIcon,
  PlugIcon,
  StreamIcon,
  CheckIcon,
} from "react-line-awesome";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { isEmpty } from "lodash";

const useStyles = makeStyles(({ palette }) => {
  return {
    stepComplete: {
      color: palette.background.checkGreen,
    },
    activeStep: {
      color: palette.primary.main,
    },
    checkIcon: {
      marginTop: "20px",
      backgroundColor: palette.background.checkGreen,
      marginLeft: "25px",
      borderRadius: "20px",
      fontSize: "6px",
      color: palette.background.paper,
      WebkitTextStroke: "1px white",
      padding: "2px",
      position: "absolute",
    },
    stepperStyle: {
      paddingTop: "0px",
    },
    fixHeighforLater: {
      minHeight: "400px",
    },
    dialogBtn: {
      marginRight: "5px",
    },
    DividerMargin: {
      marginBottom: "20px",
    },
  };
});

const steps = [
  {
    initial: "Add a Cloud Connection",
    completed: "Cloud Connected",
    iconTag: <PlugIcon />,
  },
  {
    initial: "Add an Environment",
    completed: "Environment Created",
    iconTag: <CloudIcon />,
  },
  {
    initial: "Add a Deployment",
    completed: "Deployment Created",
    iconTag: <StreamIcon />,
  },
  {
    initial: "Confirmation Step",
    completed: "Completed",
    iconTag: <CloudUploadAltIcon />,
  },
];

const QuickDeploymentDialog = ({
  onClose,
  currentStep = 0,
  defaultContext: defaultContextFromProp = {},
  environmentSelected = {},
  cloudConnectionSelected = {},
  connectionSummary,
  environments,
  selectedCloud,
  imageType,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { prefix } = useSelector(getOrganisation);
  const cloudVendors = useSelector(getCloudVendors);

  /**
   * If cloudconnection is already present - mark step as complete,
   * If there is only one environment present, select it by default and mark step as complete
   */
  const preCompletedSteps = {};
  if (currentStep > 0) {
    for (let i = 0; i < currentStep; i++) {
      preCompletedSteps[i] = true;
    }
  }

  const [activeStep, setActiveStep] = useState(currentStep);
  const [completed, setCompleted] = useState(preCompletedSteps);

  const cloudConnections = isEmpty(selectedCloud)
    ? connectionSummary
    : connectionSummary.filter(
        (connection) => connection.cloudVendor === selectedCloud,
      );

  const [selectedEnv, setSelectedEnv] = useState(environmentSelected);
  const [selectedCloudCnt, setSelectedCloudCnt] = useState(
    cloudConnectionSelected,
  );
  const { envWFUri, appWFUri } = CloudVendor.getWFUrisFromEnvironment(
    selectedEnv,
    cloudVendors,
  );

  const defaultContext = Deployment.buildDefaultContext({
    prefix,
    entityId: selectedEnv?.envEntityId,
  });
  const workflowContext = useWorkflowContext({
    workflowPath: appWFUri,
    useFirstCreateProcess: true,
    ubiqubeId: selectedEnv.envUbiqubeId,
    defaultContext: { ...defaultContext, ...defaultContextFromProp },
  });

  const { workflowInstance: environmentContext } = useWorkflowInstance({
    workflowPath: envWFUri,
    instanceId: selectedEnv?.serviceId,
    wait: { workflow: true, workflowStatus: true },
  });

  /*Next button's default state is enabled if either of the following is true:
   * 1. it's CloudConnection and there is a cloud connection selected by default
   * 2. if the CloudConnection and the Environment steps are skipped and the default step is the Deployment Step
   */
  const [nxtBtn, setNxtBtn] = useState(
    activeStep !== 2 &&
      activeStep !== 0 &&
      activeStep === 1 &&
      isEmpty(selectedEnv),
  );

  const totalSteps = () => {
    return steps.length;
  };

  const ColorlibStepIconRoot = styled("div")(({ theme, ownerstate }) => ({
    fontSize: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerstate.active && {
      color: theme.palette.primary.main,
    }),
    ...(ownerstate.completed && {
      color: theme.palette.background.checkGreen,
    }),
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <ColorlibStepIconRoot
        ownerstate={{ completed, active }}
        className={className}
      >
        {steps[String(props.icon - 1)].iconTag}{" "}
        {completed && <CheckIcon className={classes.checkIcon} />}
      </ColorlibStepIconRoot>
    );
  }

  // Custom Dialog Actions that will be passed as props to the Dialog component
  const ActionsWrapper = () => {
    return (
      <>
        {allStepsCompleted() ? (
          <Grid container justifyContent="flex-start" alignContent="center">
            <Button
              onClick={onClose}
              id="QUICK_DEPLOY_DIALOG_DISCARD_SUCCESS"
              variant="contained"
              color="primary"
            >
              {t("Complete")}
            </Button>
          </Grid>
        ) : (
          <>
            <Grid container justifyContent="flex-start" alignContent="center">
              <Button
                color="inherit"
                disabled={
                  activeStep === QUICK_DEPLOYMENT_STEPS.CLOUD_CONNECTION_STEP
                }
                onClick={handleBack}
                className={classes.dialogBtn}
                variant="outlined"
                id="QUICK_DEPLOY_DIALOG_BACK"
              >
                {t("Back")}
              </Button>
              <Button
                color="inherit"
                onClick={onClose}
                className={classes.dialogBtn}
                id="QUICK_DEPLOY_DIALOG_DISCARD"
              >
                {t("Discard")}
              </Button>
            </Grid>
            <Grid container justifyContent="flex-end" alignContent="center">
              {completed[activeStep] && (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  className={classes.dialogBtn}
                  id="QUICK_DEPLOY_DIALOG_NEXT"
                >
                  {t("Next")}
                </Button>
              )}
              {activeStep !== steps.length &&
                (completed[activeStep] ? null : (
                  <Tooltip
                    title={
                      selectedEnv?.serviceId === null ||
                      selectedEnv?.envEntityId === 0
                        ? t("You cannot add Deployment on this Environment")
                        : ""
                    }
                  >
                    <div>
                      <Button
                        onClick={handleComplete}
                        variant="contained"
                        color="primary"
                        className={classes.dialogBtn}
                        id="QUICK_DEPLOY_DIALOG_COMPLETE"
                        disabled={
                          nxtBtn ||
                          selectedEnv?.serviceId === null ||
                          selectedEnv?.envEntityId === 0
                        }
                      >
                        {completedSteps() === totalSteps() - 1
                          ? `${t("Deploy")}`
                          : `${t("Next")}`}
                      </Button>
                    </div>
                  </Tooltip>
                ))}
            </Grid>
          </>
        )}
      </>
    );
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    if (newActiveStep === 4) {
      workflowContext.runProcess();
    }
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    if (activeStep < 1) {
      setNxtBtn(true);
    }
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  return (
    <>
      <Dialog
        maxWidth="lg"
        onClose={onClose}
        title={t("Quick Deployment")}
        noActions={true}
        data-testid="quick-deployment-dialog"
        dialogActions={ActionsWrapper}
      >
        <Grid>
          <Box sx={{ width: "100%" }}>
            <Stepper
              nonLinear
              activeStep={activeStep}
              alternativeLabel
              className={classes.stepperStyle}
            >
              {steps.map((step, index) => (
                <Step key={index} completed={completed[index]}>
                  <StepLabel key={index} StepIconComponent={ColorlibStepIcon}>
                    {completed[index] ? (
                      <span
                        className={
                          index !== activeStep
                            ? classes.stepComplete
                            : classes.activeStep
                        }
                      >
                        {t(step.completed)}
                      </span>
                    ) : (
                      <span
                        className={
                          activeStep === index ? classes.activeStep : null
                        }
                      >
                        {t(step.initial)}
                      </span>
                    )}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider className={classes.DividerMargin} />

            {activeStep === QUICK_DEPLOYMENT_STEPS.CLOUD_CONNECTION_STEP ? (
              <div className={classes.fixHeighforLater}>
                <CloudConnectionStep
                  selectedCloud={(data) => {
                    setSelectedCloudCnt(data);
                    setSelectedEnv({});
                    setCompleted((prev) => ({
                      ...prev,
                      1: false,
                    }));
                  }}
                  isDisabled={(data) => {
                    setNxtBtn(data);
                  }}
                  setSelectedCloud={selectedCloudCnt}
                  connectionSummary={cloudConnections}
                />
              </div>
            ) : null}

            {activeStep === QUICK_DEPLOYMENT_STEPS.ENVIRONMENT_STEP ? (
              <div className={classes.fixHeighforLater}>
                <EnvironmentStep
                  environment={(data) => setSelectedEnv(data)}
                  isDisabled={(data) => setNxtBtn(data)}
                  selectedEnv={selectedEnv}
                  cloudVendor={selectedCloudCnt.cloudVendor}
                  environments={environments}
                  imageType={imageType}
                />
              </div>
            ) : null}

            {activeStep === QUICK_DEPLOYMENT_STEPS.DEPLOYMENT_STEP ? (
              <div className={classes.fixHeighforLater}>
                <DeploymentStep
                  isDisabled={(data) => setNxtBtn(data)}
                  workflowContext={workflowContext}
                  cloudService={getServiceFromEnvironment(
                    selectedEnv,
                    cloudVendors,
                  )}
                />
              </div>
            ) : null}

            {activeStep === QUICK_DEPLOYMENT_STEPS.DEPLOY_STEP ? (
              <div className={classes.fixHeighforLater}>
                <DeployStep
                  selectedEnv={selectedEnv}
                  selectedCloudCnt={selectedCloudCnt}
                  deploymentContext={workflowContext.context}
                  environmentContext={environmentContext}
                />
              </div>
            ) : null}
            {activeStep === QUICK_DEPLOYMENT_STEPS.COMPLETION_STEP ? (
              <div className={classes.fixHeighforLater}>
                <Completed workflowContext={workflowContext} />
              </div>
            ) : null}
          </Box>
        </Grid>
      </Dialog>
    </>
  );
};

export default QuickDeploymentDialog;
