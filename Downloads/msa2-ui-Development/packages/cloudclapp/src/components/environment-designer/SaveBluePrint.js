import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { getToken } from "cloudclapp/src/store/auth";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import Repository from "msa2-ui/src/services/Repository";

import {
  Typography,
  TextField,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import AdornedTextField from "msa2-ui/src/components/AdornedTextField";
import {
  createBluePrint,
  updateBluePrint,
} from "cloudclapp/src/api/blueprints";
import { ENV_DESIGNER } from "cloudclapp/src/Constants";

const useStyles = makeStyles(({ palette }) => ({
  createDialogContent: {
    padding: "0 20px",
  },
  formField: {
    marginBottom: 20,
    width: "100%",
  },
  subtenantSelect: {
    textAlign: "left",
  },
  errorMessage: {
    color: palette.error.main,
  },
}));

const SaveBluePrint = ({
  modelerActions,
  xmlContent,
  xmlError,
  onClose,
  updateDesign = false,
  blueprintPath,
  reloadEnvironment,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { getBusinessObjectByBusinessType } = modelerActions;
  const token = useSelector(getToken);

  const { enqueueSnackbar } = useSnackbar();

  const [bpmName, setBpmName] = useState("");
  const [bpmFilename, setBpmFilename] = useState(".bpmn");
  const [createBpmIsLoading, setCreateBpmIsLoading] = useState(false);
  const [updateBpmIsLoading, setUpdateBpmIsLoading] = useState(false);
  const [createBpmErrorMessage, setCreateBpmErrorMessage] = useState("");
  const [updateBpmErrorMessage, setUpdateBpmErrorMessage] = useState("");

  const getBluePrintData = () => {
    const providerBusinessObjects = getBusinessObjectByBusinessType(
      ENV_DESIGNER.INFRASTRUCTURES.PROVIDER,
    );
    const providers = providerBusinessObjects.map(
      (provider) => provider.data.value?.cloudVendor,
    );
    const applicationBusinessObjects = getBusinessObjectByBusinessType(
      ENV_DESIGNER.INFRASTRUCTURES.APP_DEPLOYMENT,
    );
    const applications = applicationBusinessObjects.map(
      (app) => app.data.context.apps_to_deploy[0].app_name,
    );
    return {
      providers,
      applications,
    };
  };

  const onSavingBluePrint = async () => {
    if (xmlError) {
      return setCreateBpmErrorMessage(
        t("XML error. Please update diagram and try again."),
      );
    }

    if (!bpmName) {
      return setCreateBpmErrorMessage(t("Please enter a name"));
    }

    if (bpmFilename === ".bpmn") {
      return setCreateBpmErrorMessage(t("Please enter a file name"));
    }

    setCreateBpmErrorMessage("");
    setCreateBpmIsLoading(true);

    const data = getBluePrintData();

    const [upsertError] = await createBluePrint({
      name: bpmFilename,
      blueprintPath: `/Blueprints/local/${bpmFilename}`,
      content: xmlContent,
      token,
      ...data,
    });
    setCreateBpmIsLoading(false);

    if (upsertError) {
      const message = upsertError.getMessage();
      const errorMessage = `${t("Error creating x", {
        x: t("BPM diagram"),
      })}. ${message || t("Please try again")}`;
      setCreateBpmIsLoading(false);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
      return setCreateBpmErrorMessage(errorMessage);
    } else {
      enqueueSnackbar(t("x created successfully", { x: t("Bpm diagram") }), {
        variant: "success",
        autoHideDuration: 3000,
      });
      onClose();
    }
  };

  const onUpdatingBlueprint = async () => {
    if (xmlError) {
      return setUpdateBpmErrorMessage(
        t("XML error. Please update diagram and try again."),
      );
    }
    setUpdateBpmErrorMessage("");
    setUpdateBpmIsLoading(true);
    const data = getBluePrintData();
    const bpmnPathArray = blueprintPath?.split("/");
    const bpmnName = bpmnPathArray[bpmnPathArray.length - 1];

    const [upsertError] = await updateBluePrint({
      name: bpmnName,
      blueprintPath: blueprintPath,
      content: xmlContent,
      token,
      ...data,
    });
    setUpdateBpmIsLoading(false);

    if (upsertError) {
      const message = upsertError.getMessage();
      const errorMessage = `${t("Error updating x", {
        x: bpmnName,
      })}. ${message || t("Please try again")}`;
      setUpdateBpmIsLoading(false);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
      return setUpdateBpmErrorMessage(errorMessage);
    } else {
      enqueueSnackbar(t("x updated successfully", { x: bpmnName }), {
        variant: "success",
        autoHideDuration: 3000,
      });
      reloadEnvironment();
      onClose();
    }
  };

  return (
    <>
      {updateDesign ? (
        <Dialog
          title={t("Save Design")}
          execLabel={t("Save")}
          onExec={() => {
            onUpdatingBlueprint();
          }}
          onClose={onClose}
          // content={}
          disabled={updateBpmIsLoading}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            className={classes.createDialogContent}
          >
            {updateBpmIsLoading && <CircularProgress />}
            {updateBpmErrorMessage ? (
              <Typography
                id="UPDATE_DESIGN_ERROR"
                variant="body1"
                className={classes.errorMessage}
              >
                {updateBpmErrorMessage}
              </Typography>
            ) : (
              !updateBpmIsLoading && (
                <Typography id="UPDATE_DESIGN_CONFIRMATION" variant="body1">
                  {t("Are you sure you want to save the design?")}
                </Typography>
              )
            )}
          </Grid>
        </Dialog>
      ) : (
        <Dialog
          title={t("New Blueprint")}
          execLabel={t("Create Blueprint")}
          onExec={() => {
            onSavingBluePrint();
          }}
          onClose={onClose}
          shouldHideOnExec={false}
          disabled={createBpmIsLoading || !bpmName}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            className={classes.createDialogContent}
          >
            {createBpmIsLoading ? (
              <CircularProgress />
            ) : (
              <>
                <TextField
                  size="medium"
                  label={t("Name")}
                  id="bpm-name-field"
                  className={classes.formField}
                  variant="outlined"
                  value={bpmName}
                  onChange={({ target: { value } }) => {
                    setBpmName(value);
                    setBpmFilename(
                      Repository.convertStringToFilename(value, "bpmn"),
                    );
                  }}
                />
                <AdornedTextField
                  size="medium"
                  label={t("File Name")}
                  id="bpm-name-field"
                  className={classes.formField}
                  variant="outlined"
                  value={bpmFilename}
                  suffix={".bpmn"}
                  onChange={({ target: { value } }) => {
                    setBpmFilename(
                      Repository.convertStringToFilename(value, "bpmn"),
                    );
                  }}
                />
                {createBpmErrorMessage && (
                  <Typography
                    id="CREATE_DESIGN_ERROR"
                    variant="body1"
                    className={classes.errorMessage}
                  >
                    {createBpmErrorMessage}
                  </Typography>
                )}
              </>
            )}
          </Grid>
        </Dialog>
      )}
    </>
  );
};

SaveBluePrint.propTypes = {
  onClose: PropTypes.func,
};

export default SaveBluePrint;
