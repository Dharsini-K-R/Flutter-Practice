import React, { useRef, useEffect, useState } from "react";
import { makeStyles, useTheme, Grid, Paper, Button } from "@material-ui/core";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getToken } from "cloudclapp/src/store/auth";
import { getCloudVendors } from "cloudclapp/src/store/designations";

import useBpmModeler from "cloudclapp/src/hooks/useBpmModeler";

import Modeler from "bpmn-js/lib/Modeler";
import { isEmpty } from "lodash";
import Viewer from "bpmn-js/lib/NavigatedViewer";
import { bpmStarterDiagram } from "cloudclapp/src/components/bpm/bpmStarterDiagram";
import CustomModules from "cloudclapp/src/components/bpm/customModules";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import CustomPalette from "cloudclapp/src/components/bpm/customModules/CustomPalette";
import PropertiesPanel from "./properties-panel";
import { SaveIcon } from "react-line-awesome";
import SaveBluePrint from "./SaveBluePrint";

const useStyles = makeStyles(({ palette }) => ({
  modelerContainer: {
    backgroundColor: palette.bpm.background,
    color: palette.common.black,
    height: "800px",
  },
  headerContainer: {
    padding: 8,
    backgroundColor: "#fff",
    borderBottom: "1px solid #B2BCCE",
  },
  overlayPanel: {
    maxHeight: "calc(100% - 200px)",
    overflowY: "scroll",
    position: "absolute",
    right: 30,
    top: 250,
    width: 500,
  },
  overlayPanel2: {
    maxHeight: "calc(100% - 200px)",
    overflowY: "scroll",
    position: "absolute",
    right: 370,
    top: 84,
    width: 330,
  },
  buttonsContainer: {
    paddingLeft: "10px",
  },
}));

const EnvironmentDesigner = ({
  environment,
  envWFLogoMapping,
  reloadEnvironment,
  envBlueprintPath,
  envBlueprintContent,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const diagramXml = envBlueprintContent;

  const modeler = useRef();
  const { modelerState, modelerActions, moddle } = useBpmModeler(
    modeler.current,
  );
  const { activeElement, xml, xmlError, touched } = modelerState;

  const [, setIsLoaded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [updateDesign, setUpdateDesign] = useState(false);

  const token = useSelector(getToken);

  const cloudVendors = useSelector(getCloudVendors);
  const readOnly = false;
  const BPMComponent = readOnly ? Viewer : Modeler;

  const updateDesignClicked = () => {
    setUpdateDesign(true);
    setShowDialog(true);
  };

  const checkIfEmpty = (data) => {
    const filter = [];
    data &&
      Object.values(data).forEach((val) => {
        if (
          val.element.type === "bpmn:ServiceTask" ||
          val.element.type === "bpmn:SubProcess"
        ) {
          filter.push(val.element.type);
        }
      });
    return isEmpty(filter);
  };

  useEffect(() => {
    modeler.current = new BPMComponent({
      additionalModules: [
        {
          ...CustomModules,
          cloudclappContext: ["value", { cloudVendors, envWFLogoMapping }],
          cloudVendors: ["value", cloudVendors],
        },
      ],
      container: "#bpm-canvas",
      height: "100%",
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
      // node_modules/bpmn-js/lib/draw/TextRenderer.js - config
      textRenderer: {
        defaultStyle: {
          fontFamily: theme.typography.fontFamily,
          fontWeight: 500,
          mixBlendMode: "luminosity",
        },
      },
      // node_modules/bpmn-js/lib/draw/BpmnRenderer.js - config
      bpmnRenderer: {
        defaultFillColor: "#EFF1F5",
        defaultStrokeColor: "#3D475A",
      },
    });
    setIsLoaded(true);
    return () => modeler.current.destroy();
  }, [
    theme.palette.bpm.background,
    theme.palette.bpm.path,
    theme.typography.fontFamily,
    BPMComponent,
    cloudVendors,
    envWFLogoMapping,
    token,
  ]);

  useEffect(() => {
    if (modeler && modeler.current) {
      if (!diagramXml) {
        modeler.current.importXML(bpmStarterDiagram);
      } else {
        modeler.current.importXML(diagramXml);
      }
    }
  }, [modeler, diagramXml]);

  return (
    <Grid container>
      <Grid
        container
        className={classes.headerContainer}
        xs={12}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid item className={classes.buttonsContainer}>
          <Button
            startIcon={<SaveIcon />}
            variant="outlined"
            onClick={updateDesignClicked}
            disabled={!touched}
          >
            {t("Save Design")}
          </Button>
        </Grid>
        <Grid item className={classes.buttonsContainer}>
          <Button
            startIcon={<SaveIcon />}
            variant="outlined"
            onClick={() => setShowDialog(true)}
            disabled={checkIfEmpty(
              modeler?.current?.get("elementRegistry")._elements,
            )}
          >
            {t("Save Environment As Blueprint")}
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid container item xs={2}>
          <CustomPalette
            environment={environment}
            modelerActions={modelerActions}
          />
        </Grid>
        <Grid container item className={classes.modelerContainer} xs={10}>
          <Grid item id="bpm-canvas" data-testid="bpm-canvas" xs={12} />
          {activeElement && !readOnly && (
            <Paper className={classes.overlayPanel}>
              <PropertiesPanel
                environment={environment}
                modelerState={modelerState}
                modelerActions={modelerActions}
                moddle={moddle}
                workflows={[]}
                readOnly={readOnly}
              />
            </Paper>
          )}
        </Grid>
        {showDialog && (
          <SaveBluePrint
            modelerActions={modelerActions}
            onClose={() => {
              setShowDialog(false);
              setUpdateDesign(false);
            }}
            xmlContent={xml}
            xmlError={xmlError}
            updateDesign={updateDesign}
            blueprintPath={envBlueprintPath}
            reloadEnvironment={reloadEnvironment}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EnvironmentDesigner;
