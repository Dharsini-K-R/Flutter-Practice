import { useEffect, useReducer } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { classes as svgClasses } from "tiny-svg";

import { is } from "bpmn-js/lib/util/ModelUtil";
import Bpm, { PLACEHOLDER_UBIQUBE_ID_STRING } from "msa2-ui/src/services/Bpm";
import { getIsReadonlyElement } from "cloudclapp/src/services/EnvironmentDesigner";
import {
  ENV_DESIGNER,
  INFRASTRUCTURES,
  DEPLOYMENT_VARIABLES_NAME,
  ENVIRONMENT_VARIABLES_NAME,
} from "cloudclapp/src/Constants";

export const initialModelerState = {
  activeElement: null,
  touched: false,
  xml: null,
  xmlError: null,
};

const modelerStateReducer = (state, action) => {
  if (action.type === "setActiveElement") {
    const activeElement = action.payload;

    if (!activeElement) {
      return {
        ...state,
        activeElement: null,
      };
    }

    return { ...state, activeElement };
  }

  if (action.type === "setXml") {
    const { xml, error: xmlError } = action.payload;
    return { ...state, xml, xmlError };
  }
  if (action.type === "touch") {
    return { ...state, touched: true };
  }

  return state;
};

const useBpmModeler = (modelerInstance) => {
  const [modelerState, dispatch] = useReducer(
    modelerStateReducer,
    initialModelerState,
  );

  /**
   * Listeners
   */
  const onSelectionChanged = (event) => {
    const { newSelection } = event;
    // Set ActiveElement as null before selection to unmount PropertiesPanel
    // Otherwise it will keep some local states when you switch BPM nodes back and forth
    dispatch({ type: "setActiveElement", payload: null });
    if (newSelection.length === 1) {
      dispatch({ type: "setActiveElement", payload: newSelection[0] });
    }
  };

  const onBpmChange = (modelerInstance) => {
    modelerInstance.saveXML({ format: true }, (error, xml) => {
      dispatch({ type: "setXml", payload: { error, xml } });
      dispatch({ type: "touch" });
    });
  };

  const onShapeAdded = ({ context: { shape: element } }, modelerInstance) => {
    if (is(element, "bpmn:Task")) {
      // Connect Start Event and End Event
      const modeling = modelerInstance.get("modeling");
      const elementRegistry = modelerInstance.get("elementRegistry");

      const startEvent = elementRegistry.get("StartEvent_1");
      const endEvent = elementRegistry.get("EndEvent_1");

      modeling.connect(startEvent, element);
      modeling.connect(element, endEvent);
    }
  };

  const onElementMarkerUpdate = ({ element, gfx, originalEvent }) => {
    if (getIsReadonlyElement(element)) {
      // Remove marker classes from invisible elements
      svgClasses(gfx).remove("selected");
      svgClasses(gfx).remove("hover");
    }
  };

  const onConnectionChanged = ({ element, gfx, type }, modelerInstance) => {
    const moddle = modelerInstance.get("moddle");
    const replace = modelerInstance.get("replace");
    const { source, target } = element;
    const inputParameter = Bpm.getInputParameterFromElement(target);

    if (
      inputParameter.type === ENV_DESIGNER.INFRASTRUCTURES.APP_DEPLOYMENT &&
      is(source, "bpmn:ServiceTask")
    ) {
      const workflow = Bpm.readAttachedWorkflowValuesFromBpmElement(target);
      const { processVariables, workflowPath } = workflow;

      if (
        Boolean(workflowPath) &&
        !processVariables[
          DEPLOYMENT_VARIABLES_NAME.ENVIRONMENT_MANAGED_ENTITY
        ]?.includes(source.id)
      ) {
        const defaultContext = {
          [DEPLOYMENT_VARIABLES_NAME.ENVIRONMENT_MANAGED_ENTITY]: Bpm.buildCamundaJsonParser(
            {
              variableName: source.id,
              props: ["variables", ENVIRONMENT_VARIABLES_NAME.CLUSTER_ME_ID],
            },
          ),
        };

        const updatedElement = Bpm.writeAttachedWorkflowValuesToBpmElement({
          ...workflow,
          processVariables: { ...processVariables, ...defaultContext },
          moddle,
        });
        replace.replaceElement(target, updatedElement);
      }
    }
  };

  // Set listeners here, find commands in
  //  - https://github.com/bpmn-io/docs.bpmn.io/tree/master/docs/Events/common-events
  //  - https://github.com/bpmn-io/docs.bpmn.io/tree/master/docs/Events/bpmn-events
  useEffect(() => {
    if (modelerInstance) {
      modelerInstance.on("selection.changed", (event) => {
        onSelectionChanged(event);
      });
      modelerInstance.on("commandStack.changed", () => {
        onBpmChange(modelerInstance);
      });
      modelerInstance.on("commandStack.shape.create.postExecute", (event) => {
        onShapeAdded(event, modelerInstance);
      });
      modelerInstance.on("element.marker.update", (event) => {
        onElementMarkerUpdate(event);
      });
      modelerInstance.on("connection.changed", (event) => {
        onConnectionChanged(event, modelerInstance);
      });
    }
  }, [modelerInstance]);

  /**
   * Actions
   */
  const selectElement = (elementId) => {
    if (!elementId) return;

    const targetElement = modelerInstance.get("elementRegistry").get(elementId);
    const selection = modelerInstance.get("selection");
    selection.select(targetElement);
  };

  const unselectElement = () => {
    const selection = modelerInstance.get("selection");
    dispatch({ type: "setActiveElement", payload: null });
    selection.select(null);
  };

  const getBpmElementById = (elementId) => {
    if (!elementId) return;
    return modelerInstance.get("elementRegistry").get(elementId);
  };

  const updateActiveElement = (businessObject) => {
    if (!modelerInstance || !businessObject) return;

    const modeling = modelerInstance.get("modeling");
    const activeElement = modelerState.activeElement;
    modeling.updateProperties(activeElement, businessObject);
  };

  const startDraggingElement = (event, elements) => {
    if (!modelerInstance) return;
    const create = modelerInstance.get("create");
    create.start(event, elements);
  };

  const generateElementFromWorkflow = ({
    workflowPath,
    processName,
    label,
    extraProps,
  }) => {
    if (!modelerInstance) return;

    const elementFactory = modelerInstance.get("elementFactory");
    const moddle = modelerInstance.get("moddle");

    const workflowElement = Bpm.writeAttachedWorkflowValuesToBpmElement({
      displayName: label,
      workflowPath,
      processName,
      // todo
      processType: "CREATE",
      processVariables: {},
      moddle,
      extraProps,
    });

    return elementFactory.createShape(workflowElement);
  };

  const writeToK8Element = ({
    id,
    displayName = "",
    data,
    extraProps = {},
    moddle,
  }) => {
    if (!modelerInstance) return;

    const type = "bpmn:ServiceTask";
    const businessObject = {
      type: ENV_DESIGNER.RESOURCES.K8_CLUSTER,
      data,
      extraProps: isEmpty(extraProps) ? undefined : extraProps,
    };
    return {
      type,
      businessObject: moddle.create(type, {
        name: displayName || "K8 Cluster",
        id,
        "camunda:type": "external",
        "camunda:topic": "msa_workflow",
        extensionElements: moddle.create("bpmn:ExtensionElements", {
          values: [
            moddle.create("camunda:InputOutput", {
              inputParameters: [
                moddle.create("camunda:InputParameter", {
                  name: "workflow_data",
                  definition: Bpm.convertObjectToCamundaMap(moddle, {
                    ubiqubeId: PLACEHOLDER_UBIQUBE_ID_STRING,
                    serviceName: data.workflowPath,
                    processName: data.processName,
                    processType: "CREATE",
                    processVariables: data.processVariables,
                    resumeOnFail: "false",
                  }),
                }),
                moddle.create("camunda:InputParameter", {
                  name: "k8_cluster_data",
                  definition: Bpm.convertObjectToCamundaMap(
                    moddle,
                    businessObject,
                  ),
                }),
              ],
            }),
          ],
        }),
      }),
    };
  };

  const generateK8Element = ({ displayName, data, extraProps }) => {
    if (!modelerInstance) return;

    const elementFactory = modelerInstance.get("elementFactory");
    const moddle = modelerInstance.get("moddle");
    const id = `ServiceTask_${Date.now()}`;

    return elementFactory.createShape(
      writeToK8Element({ id, displayName, data, extraProps, moddle }),
    );
  };

  const writeToApplicationElement = ({
    id,
    displayName = "",
    data,
    workflowPath,
    processName,
    processVariables,
    extraProps = {},
    moddle,
  }) => {
    if (!modelerInstance) return;

    const type = "bpmn:ServiceTask";
    const businessObject = {
      type: ENV_DESIGNER.INFRASTRUCTURES.APP_DEPLOYMENT,
      data: {
        ...data,
        context: processVariables,
      },
      extraProps: isEmpty(extraProps) ? undefined : extraProps,
      displayName:
        processVariables?.[DEPLOYMENT_VARIABLES_NAME.APPLICATION]?.[0]?.[
          DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME
        ],
    };

    return {
      type,
      businessObject: moddle.create(type, {
        name: displayName,
        id,
        "camunda:type": "external",
        "camunda:topic": "msa_workflow",
        extensionElements: moddle.create("bpmn:ExtensionElements", {
          values: [
            moddle.create("camunda:InputOutput", {
              inputParameters: [
                moddle.create("camunda:InputParameter", {
                  name: "workflow_data",
                  definition: Bpm.convertObjectToCamundaMap(moddle, {
                    ubiqubeId: PLACEHOLDER_UBIQUBE_ID_STRING,
                    serviceName: workflowPath,
                    processName,
                    processType: "CREATE",
                    processVariables,
                    resumeOnFail: "false",
                  }),
                }),
                moddle.create("camunda:InputParameter", {
                  name: "application_data",
                  definition: Bpm.convertObjectToCamundaMap(
                    moddle,
                    businessObject,
                  ),
                }),
              ],
            }),
          ],
        }),
      }),
    };
  };

  const generateApplicationElement = ({
    displayName,
    data,
    processVariables,
    workflowPath,
    extraProps,
    parent,
    source,
  }) => {
    if (!modelerInstance) return;

    const elementFactory = modelerInstance.get("elementFactory");
    const moddle = modelerInstance.get("moddle");
    const modeling = modelerInstance.get("modeling");
    const autoPlace = modelerInstance.get("autoPlace");
    const id = `ServiceTask_${Date.now()}`;

    const appElement = writeToApplicationElement({
      id,
      displayName,
      data,
      processVariables,
      workflowPath,
      extraProps,
      moddle,
    });

    const element = (() => {
      if (source) {
        const shape = elementFactory.createShape(appElement);
        autoPlace.append(source, shape);
        return shape;
      }
      if (parent) {
        // It will create shape and draw in designer
        return modeling.createShape(
          appElement,
          { x: 10, y: 10 }, // position - @TODO
          parent,
        );
      }
      return elementFactory.createShape(appElement);
    })();

    selectElement(element.id);
    return element;
  };

  const writeToProviderElement = ({
    id,
    displayName = "",
    data,
    moddle,
    extraProps = {},
  }) => {
    const type = "bpmn:SubProcess";
    const provideData = {
      type: INFRASTRUCTURES.PROVIDER,
      data,
      extraProps: isEmpty(extraProps) ? undefined : extraProps,
    };
    return {
      type,
      isExpanded: true,
      businessObject: moddle.create(type, {
        name: displayName,
        id,
        extensionElements: moddle.create("bpmn:ExtensionElements", {
          values: [
            moddle.create("camunda:InputOutput", {
              inputParameters: [
                moddle.create("camunda:InputParameter", {
                  name: "provider_data",
                  definition: Bpm.convertObjectToCamundaMap(
                    moddle,
                    provideData,
                  ),
                }),
              ],
            }),
          ],
        }),
      }),
    };
  };

  const generateProviderElement = ({
    data = {},
    extraProps = {},
    moddle,
    displayName = "",
  }) => {
    if (!modelerInstance) return;

    const elementFactory = modelerInstance.get("elementFactory");
    const id = `SubProcess_${Date.now()}`;
    return elementFactory.createShape(
      writeToProviderElement({ id, displayName, data, extraProps, moddle }),
    );
  };

  const writeToRegionElement = ({
    id,
    displayName = "",
    data,
    moddle,
    extraProps = {},
  }) => {
    const type = "bpmn:SubProcess";
    const provideData = {
      type: INFRASTRUCTURES.REGION,
      data,
      extraProps: isEmpty(extraProps) ? undefined : extraProps,
    };
    return {
      type,
      isExpanded: true,
      businessObject: moddle.create(type, {
        name: displayName,
        id,
        extensionElements: moddle.create("bpmn:ExtensionElements", {
          values: [
            moddle.create("camunda:InputOutput", {
              inputParameters: [
                moddle.create("camunda:InputParameter", {
                  name: "region_data",
                  definition: Bpm.convertObjectToCamundaMap(
                    moddle,
                    provideData,
                  ),
                }),
              ],
            }),
          ],
        }),
      }),
    };
  };

  const generateRegionElement = ({
    data = {},
    displayName = "",
    extraProps = {},
    moddle,
  }) => {
    if (!modelerInstance) return;

    const elementFactory = modelerInstance.get("elementFactory");
    const id = `SubProcess_${Date.now()}`;
    return elementFactory.createShape(
      writeToRegionElement({ id, displayName, data, extraProps, moddle }),
    );
  };

  const generateInfraElement = (id) => {
    if (!modelerInstance) return;
    const moddle = modelerInstance.get("moddle");

    switch (id) {
      case INFRASTRUCTURES.PROVIDER: {
        return generateProviderElement({ moddle });
      }
      case INFRASTRUCTURES.REGION: {
        return generateRegionElement({ moddle });
      }
      case INFRASTRUCTURES.APP_DEPLOYMENT:
      default: {
        return null;
      }
    }
  };

  // Function to get business object from bpmElement
  // we are using 'definition' as parent key for all bpmElement in CCLA
  const getInputParameterFromElement = (bpmElement) => {
    const inputParameters =
      get(
        bpmElement,
        "businessObject.extensionElements.values[0].inputParameters",
      ) ?? [];
    // Todo: temporary function! as we only have workflow_data or one other inputParameter now
    const inputParameter = inputParameters.find(
      ({ name }) => name !== "workflow_data",
    );
    try {
      return Bpm.convertCamundaMapToObject(inputParameter.definition);
    } catch (e) {
      return {};
    }
  };

  const placeElement = (element) => {
    if (!modelerInstance) return;

    const autoPlace = modelerInstance.get("autoPlace");
    const elementRegistry = modelerInstance.get("elementRegistry");
    const modeling = modelerInstance.get("modeling");

    const startEvent = elementRegistry.get("StartEvent_1");
    const endEvent = elementRegistry.get("EndEvent_1");
    autoPlace.append(startEvent, element);
    modeling.connect(element, endEvent);
  };

  const replaceActiveElement = (updatedElement) => {
    if (!modelerInstance || !updatedElement) return;

    const replace = modelerInstance.get("replace");
    replace.replaceElement(modelerState.activeElement, updatedElement);

    selectElement(updatedElement.businessObject?.id);
  };

  // Recursive Function to get parent data by type
  // element - bpm element, elementType - ENV_DESIGNER types
  const findParentElementByType = (element, elementType) => {
    if (!element) return null;

    const businessObject = Bpm.getInputParameterFromElement(element);

    return businessObject?.type === elementType
      ? businessObject
      : findParentElementByType(element.parent, elementType);
  };

  const connectToById = (firstElementId, secondElementId) => {
    const elementRegistry = modelerInstance.get("elementRegistry");

    const firstElement = elementRegistry.get(firstElementId);
    const secondElement = elementRegistry.get(secondElementId);

    connectToByElements(firstElement, secondElement);
  };

  const connectToByElements = (firstElement, secondElement) => {
    const modeling = modelerInstance.get("modeling");
    if (firstElement && secondElement) {
      modeling.connect(firstElement, secondElement);
    }
  };

  // Find Elements by business BPMN type (i.e - 'bpmn:StartEvent')
  // return - array of elements
  const findElementByType = (type) => {
    const elementRegistry = modelerInstance.get("elementRegistry");
    return elementRegistry.filter((element) => element.type === type);
  };

  // Find Elements by business object type (i.e - 'K8_CLUSTER')
  // return - array of elements
  const findElementByBusinessType = (type) => {
    const elementRegistry = modelerInstance.get("elementRegistry");

    return elementRegistry.filter((element) => {
      const businessObject = Bpm.getInputParameterFromElement(element);
      return businessObject?.type === type;
    });
  };

  // Get Business object by type
  const getBusinessObjectByBusinessType = (type) => {
    return findElementByBusinessType(type).map((element) =>
      Bpm.getInputParameterFromElement(element),
    );
  };

  const moddle = modelerInstance ? modelerInstance.get("moddle") : null;

  return {
    modelerState,
    modelerActions: {
      selectElement,
      unselectElement,
      getBpmElementById,
      updateActiveElement,
      startDraggingElement,
      generateElementFromWorkflow,
      generateProviderElement,
      generateInfraElement,
      placeElement,
      replaceActiveElement,
      getInputParameterFromElement,
      writeToProviderElement,
      writeToRegionElement,
      generateK8Element,
      writeToK8Element,
      generateApplicationElement,
      writeToApplicationElement,
      findParentElementByType,
      connectToById,
      connectToByElements,
      findElementByType,
      findElementByBusinessType,
      getBusinessObjectByBusinessType,
    },
    moddle,
  };
};

export default useBpmModeler;
