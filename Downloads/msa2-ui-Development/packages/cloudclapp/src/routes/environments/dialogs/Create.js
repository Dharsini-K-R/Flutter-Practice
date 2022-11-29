import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import i18n from "cloudclapp/src/localisation/i18n";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import produce from "immer";
import { useSnackbar } from "notistack";

import Repository from "msa2-ui/src/services/Repository";
import Validation from "msa2-ui/src/services/Validation";
import Variable from "msa2-ui/src/services/Variable";
import { executeService } from "msa2-ui/src/api/workflow";
import useWorkflowContext, {
  getFirstCreateProcess,
} from "cloudclapp/src/hooks/useWorkflowContext";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import {
  makeStyles,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { InfoCircleIcon } from "react-line-awesome";

import {
  createEnvironment,
  createEnvironmentFromBlueprint,
} from "cloudclapp/src/api/environment";
import { getToken } from "cloudclapp/src/store/auth";
import {
  getOrganisation,
  getCloudVendors,
  fetchCloudVendors,
  getWorkflowByUri,
  fetchEnvironments,
} from "cloudclapp/src/store/designations";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";
import Details from "./tabs/Details";
import Configuration from "./tabs/Configuration";

const emptyFormErrors = {
  details: {
    name: false,
    description: false,
    cloudType: false,
    ipAddress: false,
    newRootUsername: false,
    password: false,
    confirmPassword: false,
  },
  configuration: {},
  createEnvironment: false,
};

const useStyles = makeStyles(({ colors, palette }) => {
  return {
    loadingWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      backgroundColor: "#00000033",
    },
    errorsBlockWrapper: {
      marginTop: 25,
    },
    errorsBlock: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: palette.error.main,
      borderRadius: "4px",
      padding: 10,
      display: "inline-flex",
    },
    errorsBlockIcon: {
      color: palette.error.main,
      fontSize: "24px",
      marginRight: 5,
    },
  };
});

const TABS = [
  {
    id: "CREATE_ENVIRONMENT_DETAILS_TAB",
    label: i18n.t("Details"),
    Component: Details,
    formKey: "details",
  },
  {
    id: "CREATE_ENVIRONMENT_CONFIGURATION_TAB",
    label: i18n.t("Configuration"),
    Component: Configuration,
    formKey: "configuration",
  },
];

const CreateDialog = (props) => {
  const { setClose, createEnvironmetFromBlueprint, path } = props;
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const { externalReference } = useSelector(getOrganisation);
  const cloudVendors = useSelector(getCloudVendors);

  const [currentTab, setCurrentTab] = useState(0);
  const [createProgress, setCreateProgress] = useState();
  const isCompleted = Boolean(createProgress);
  const isOnFirstTab = currentTab === 0;
  const isOnLastTab = createEnvironmetFromBlueprint
    ? true
    : currentTab + 1 === TABS.length;
  const { Component: TabComponent, formKey } = TABS[currentTab];
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [details, setDetails] = useState({
    name: "",
    description: "",
    cloudType: {},
    ipAddress: "",
    dnsEntry: "",
    newRootUsername: "",
    password: "",
    confirmPassword: "",
    importFlag: false,
    activation: false,
    productionEnvironment: false,
  });
  const [configuration, setConfiguration] = useState({});
  const formData = { details, configuration };
  const setFormData = { details: setDetails, configuration: setConfiguration };

  const [formErrors, setFormErrors] = useState(emptyFormErrors);

  const cloudOptions = Object.entries(cloudVendors)
    .filter(([cloudVendor]) =>
      props.cloudVendor ? cloudVendor === props.cloudVendor : true,
    )
    .reduce(
      (
        acc,
        [
          cloudVendor,
          { category, displayName: cloudDisplayName, services = [] },
        ],
      ) => {
        const serviceOptions = Object.entries(services).map(
          ([cloudService, { displayName, workflow }]) => ({
            value: {
              cloudVendor,
              cloudService,
              envWFUri: Repository.stripFileExtensionFromString(workflow?.env),
              appWFUri: Repository.stripFileExtensionFromString(
                workflow?.appsDeployment,
              ),
              envImportWFUri: Repository.stripFileExtensionFromString(
                workflow?.envImport,
              ),
            },
            label: `${cloudDisplayName} - ${displayName}`,
          }),
        );
        const categoryIndex = acc.findIndex(({ label }) => label === category);
        if (categoryIndex < 0) {
          const cloudOption = { label: category, options: serviceOptions };
          return [...acc, cloudOption];
        } else {
          return produce(acc, (draft) => {
            serviceOptions.forEach((option) => {
              draft[categoryIndex].options.push(option);
            });
          });
        }
      },
      [],
    );

  const workflowPath = details.importFlag
    ? details.cloudType.value?.envImportWFUri
    : details.cloudType.value?.envWFUri;
  const workflow = useSelector(getWorkflowByUri(workflowPath));
  const {
    isLoading: isWorkflowLoading,
    initContext,
    processVariables: processVariableTypesByTask,
  } = useWorkflowContext({
    workflowPath,
    workflow,
    useFirstCreateProcess: true,
    wait: !workflowPath,
  });

  const noCreateSupported = createEnvironmetFromBlueprint
    ? false
    : !details.cloudType.value?.envImportWFUri &&
      !details.cloudType.value?.envWFUri;

  useEffect(() => {
    if (initContext) {
      setConfiguration(initContext);
    }
  }, [initContext]);

  useEffect(() => {
    dispatch(fetchCloudVendors);
  }, [dispatch]);

  const onClose = () => {
    setClose ? setClose(false) : history.goBack();
  };
  const goToPreviousTab = () => {
    setCurrentTab(currentTab - 1);
  };
  const goToNextTab = () => {
    if (!validationErrors()) {
      setCurrentTab(currentTab + 1);
    }
  };

  const validationErrors = () => {
    const errors = {
      ...formErrors,
      details: {
        ...formErrors.details,
        name:
          (formData.details.name.length <= 0 ||
            formData.details.name.length > 40) &&
          t("Name length should be between 1 and 40 characters"),
        description:
          (formData.details.description.length <= 0 ||
            formData.details.description.length > 100) &&
          t("Description length should be between 1 and 100 characters"),
        cloudType:
          (isEmpty(formData.details.cloudType) &&
            t("Cloud type is required")) ||
          ((!workflow || !processVariableTypesByTask) &&
            t("Please contact to your System Administrator.", {
              context: t("Configuration for this Cloud is not set properly."),
              reason: t("Workflow Not Found"),
            })),
      },
    };

    setFormErrors(errors);

    return !Object.values(errors.details).every((value) => value === false);
  };

  const validationErrorsForCreatingFromBluePrint = () => {
    const errors = {
      ...formErrors,
      details: {
        ...formErrors.details,
        name:
          (formData.details.name.length <= 0 ||
            formData.details.name.length > 40) &&
          t("Name length should be between 1 and 40 characters"),
        description:
          (formData.details.description.length <= 0 ||
            formData.details.description.length > 100) &&
          t("Description length should be between 1 and 100 characters"),
      },
    };

    setFormErrors(errors);

    return !Object.values(errors.details).every((value) => value === false);
  };

  const formFeildErrors = () => {
    return Validation.variables(
      configuration,
      Variable.filterVariablesBasedOnProcess(
        workflow.variables.variable,
        processVariableTypesByTask,
      ),
    );
  };

  const onSubmit = async () => {
    if (createEnvironmetFromBlueprint) {
      const result = validationErrorsForCreatingFromBluePrint();
      if (result) return;
      setIsLoading(true);
      const [error, response = {}] = await createEnvironmentFromBlueprint({
        blueprintPath: path.startsWith("/") ? path.substring(1) : path,
        body: {
          ...formData.details,
          orgName: externalReference,
        },
        token,
      });
      if (error) {
        setFormErrors({
          ...emptyFormErrors,
          createEnvironment: response?.message,
        });
        setIsLoading(false);
        return;
      } else {
        enqueueSnackbar(t("Environment created successfully"), {
          variant: "success",
        });
        setClose(false);
        await dispatch(fetchEnvironments);
        history.push(`/environments/${response.envId}/design`);
      }

      setIsLoading(false);
    } else {
      if (!isEmpty(formFeildErrors())) return;
      setIsLoading(true);
      const [error, response = {}] = await createEnvironment({
        body: {
          ...formData.details,
          orgName: externalReference,
          envWFUri: formData.details.cloudType.value.envWFUri,
          appWFUri: formData.details.cloudType.value.appWFUri,
        },
        token,
      });

      if (error) {
        setFormErrors({
          ...emptyFormErrors,
          createEnvironment: response?.message,
        });

        setIsLoading(false);
        return;
      }

      const serviceName = workflow.metaInformationList[0].serviceName;
      const { envUbiqubeId: ubiqubeId } = response;
      const [, executionResponse] = await executeService({
        token,
        ubiqubeId,
        serviceName,
        processName: getFirstCreateProcess(workflow),
        body: formData.configuration,
      });
      setCreateProgress(executionResponse);
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      title={t("New Environment")}
      onCancel={isOnFirstTab || isCompleted ? undefined : goToPreviousTab}
      cancelLabel={isOnFirstTab || isCompleted ? undefined : t("Back")}
      onExec={!isCompleted && (isOnLastTab ? onSubmit : goToNextTab)}
      execLabel={isOnLastTab ? t("Complete") : t("Next")}
      disabled={
        isLoading ||
        isWorkflowLoading ||
        noCreateSupported ||
        (isOnLastTab &&
          !createEnvironmetFromBlueprint &&
          !isEmpty(formFeildErrors()))
      }
      isLoading={isWorkflowLoading}
      validation={
        noCreateSupported
          ? t("No Environment creation is supported for this Cloud Type")
          : undefined
      }
    >
      <Grid>
        {isCompleted ? (
          <WorkflowLiveConsole processInstance={createProgress} />
        ) : (
          <TabComponent
            workflow={workflow}
            processVariableTypesByTask={processVariableTypesByTask}
            isLoading={isLoading}
            formData={formData[formKey]}
            setFormData={(value) => {
              setFormData[formKey](value);
            }}
            formErrors={formErrors[formKey]}
            setFormErrors={(errors) => {
              setFormErrors({ ...formErrors, [formKey]: errors });
            }}
            cloudOptions={cloudOptions}
            createEnvironmetFromBlueprint={createEnvironmetFromBlueprint}
          />
        )}
        {formErrors.createEnvironment && (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            className={classes.errorsBlockWrapper}
          >
            <Grid item className={classes.errorsBlock}>
              <InfoCircleIcon className={classes.errorsBlockIcon} />
              <Typography
                align="left"
                color="error"
                variant="caption"
                className={commonClasses.commonTextItalic}
              >
                {formErrors.createEnvironment}
              </Typography>
            </Grid>
          </Grid>
        )}
        {isLoading && (
          <Grid
            container
            className={classes.loadingWrapper}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </Dialog>
  );
};

CreateDialog.propTypes = {
  setClose: PropTypes.func,
  cloudVendor: PropTypes.string,
  createEnvironmetFromBlueprint: PropTypes.bool,
  path: PropTypes.string,
};

export default CreateDialog;
