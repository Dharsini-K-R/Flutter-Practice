import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { is } from "bpmn-js/lib/util/ModelUtil";

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove,
  classes as svgClasses,
} from "tiny-svg";

import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";

import { getSemantic, getStrokeColor } from "bpmn-js/lib/draw/BpmnRenderUtil";

import Bpm from "msa2-ui/src/services/Bpm";
import {
  getIsReadonlySequenceFlow,
  getIsReadonlyElement,
} from "cloudclapp/src/services/EnvironmentDesigner";
import {
  ENV_DESIGNER,
  INFRASTRUCTURES,
  DEPLOYMENT_VARIABLES_NAME,
} from "cloudclapp/src/Constants";

const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer {
  constructor(
    eventBus,
    bpmnRenderer,
    config,
    textRenderer,
    canvas,
    cloudclappContext,
  ) {
    super(eventBus, HIGH_PRIORITY);
    this.eventBus = eventBus;
    this.bpmnRenderer = bpmnRenderer;
    this.config = config;
    this.textRenderer = textRenderer;
    this.canvas = canvas;
    this.cloudclappContext = cloudclappContext;
  }

  // return true to override CustomRenderer functions below
  canRender(element) {
    if (element.labelTarget) {
      return false;
    }

    const types = ["bpmn:Task", "bpmn:SubProcess"];
    if (isAny(element, types)) {
      // Apply our own styles
      return true;
    }

    if (
      process.env.NODE_ENV !== "development" &&
      getIsReadonlyElement(element)
    ) {
      // make it invisible
      // but not for development build for the testing purpose
      return true;
    }

    return false;
  }

  drawConnection(parentNode, element) {
    if (getIsReadonlySequenceFlow(element)) {
      // Hide arrows from Start Event and to End Event.
      return null;
    }
    return this.bpmnRenderer.drawConnection(parentNode, element);
  }

  drawProvider(parentNode, element) {
    const rect = drawRegionElement(parentNode, element);
    const textRect = drawRect({
      parentNode,
      width: rect.width.baseVal.value,
      height: 30,
      borderRadius: 4,
      strokeColor: "",
      fillColor: "#6647ED",
    });

    svgAppend(parentNode, textRect);
    prependTo(rect, parentNode);
    renderEmbeddedLabel(
      parentNode,
      element,
      "left-center",
      "#384052",
      this.textRenderer,
    );
    return rect;
  }

  drawRegion(parentNode, element) {
    const rect = drawRegionElement(parentNode, element);
    const textRect = drawRect({
      parentNode,
      width: rect.width.baseVal.value,
      height: 30,
      borderRadius: 4,
      strokeColor: "",
      fillColor: "#33C4CC",
    });

    svgAppend(parentNode, textRect);
    prependTo(rect, parentNode);
    renderEmbeddedLabel(
      parentNode,
      element,
      "left-center",
      "#384052",
      this.textRenderer,
    );
    return rect;
  }

  drawSubProcess(parentNode, element) {
    const businessObject = Bpm.getInputParameterFromElement(element);

    switch (businessObject?.type) {
      case INFRASTRUCTURES.PROVIDER: {
        return this.drawProvider(parentNode, element);
      }

      case INFRASTRUCTURES.REGION: {
        return this.drawRegion(parentNode, element);
      }

      case INFRASTRUCTURES.APP_DEPLOYMENT: {
        // TODO
        return null;
      }
      default: {
        return null;
      }
    }
  }

  // Following elements are being generated from this function
  // 1. App Deployment
  // 2. K8 CLuster
  // 3. Services(EKS, EC2, AWS, GKE)
  drawTask(parentNode, element) {
    const businessObject = Bpm.getInputParameterFromElement(element);

    const rect = drawRect({
      parentNode,
      width: 100,
      height: 80,
      borderRadius: 4,
      strokeColor: "#616B83",
      fillColor: "#B2BCCE",
    });

    let logo_url = null;

    switch (businessObject?.type) {
      case ENV_DESIGNER.RESOURCES.K8_CLUSTER: {
        break;
      }
      case ENV_DESIGNER.INFRASTRUCTURES.APP_DEPLOYMENT: {
        const {
          processVariables,
        } = Bpm.readAttachedWorkflowValuesFromBpmElement(element);
        // logo_url = businessObject?.data?.application.logo_url;
        logo_url =
          processVariables[DEPLOYMENT_VARIABLES_NAME.APPLICATION]?.[0][
            DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO
          ];
        break;
      }
      default: {
        const workflow = Bpm.readAttachedWorkflowValuesFromBpmElement(element);
        const { workflowPath } = workflow;
        const { envWFLogoMapping } = this.cloudclappContext;
        const envLogo = envWFLogoMapping[workflowPath];

        const apps_to_deploy = workflow.processVariables?.apps_to_deploy ?? [];
        if (apps_to_deploy.length) {
          // Add app logo for Deployment Workflow
          logo_url = apps_to_deploy[0].logo_url;
        } else if (envLogo) {
          logo_url = envLogo;
        }
      }
    }

    // If logo url found then we will append it
    if (logo_url) {
      const image = svgCreate("image");
      svgAttr(image, {
        href: logo_url,
        height: 40,
        width: 35,
        x: 34,
        y: 38,
      });
      svgAppend(parentNode, image);
    }

    prependTo(rect, parentNode);
    renderEmbeddedLabel(
      parentNode,
      element,
      "center-top",
      "#384052",
      this.textRenderer,
    );

    return rect;
  }

  drawShape(parentNode, element) {
    if (isAny(element, ["bpmn:StartEvent", "bpmn:EndEvent"])) {
      const shape = this.bpmnRenderer.drawShape(parentNode, element);
      // Hide Start Event and End Event
      svgRemove(shape);
      return null;
    }

    if (is(element, "bpmn:SubProcess")) {
      this.drawSubProcess(parentNode, element);
    }

    if (is(element, "bpmn:Task")) {
      this.drawTask(parentNode, element);
    }
    return null;
  }
}

CustomRenderer.$inject = [
  "eventBus",
  "bpmnRenderer",
  "config",
  "textRenderer",
  "canvas",
  "cloudclappContext",
];

// helpers //////////

// Todo - WIP
function drawRegionElement(parentNode, element) {
  const rect = svgCreate("rect");
  const borderRadius = 4;
  svgAttr(rect, {
    width: element.width,
    height: element.height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: "#D9D9D9",
    strokeWidth: 1,
    fill: "#ffffff",
    // "fill-opacity": 0.2,
  });

  svgAppend(parentNode, rect);
  return rect;
}

// copied from node_modules/bpmn-js/lib/draw/BpmnRenderer.js
function drawRect({
  parentNode,
  width,
  height,
  borderRadius,
  strokeColor,
  fillColor,
}) {
  const rect = svgCreate("rect");
  const isActive = false;
  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: isActive ? strokeColor : undefined,
    strokeWidth: 2,
    fill: fillColor,
    "fill-opacity": 0.2,
  });

  svgAppend(parentNode, rect);

  return rect;
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

// node_modules/bpmn-js/lib/draw/BpmnRenderer.js - renderEmbeddedLabel
function renderEmbeddedLabel(parentGfx, element, align, color, textRenderer) {
  const semantic = getSemantic(element);
  const label = semantic.name;
  const text = textRenderer.createText(label || "", {
    size: { width: 100 },
    box: element,
    align: align,
    padding: 5,
    style: {
      fill: getStrokeColor(element, color),
      "font-weight": 500,
    },
  });

  svgClasses(text).add("djs-label");
  svgAppend(parentGfx, text);

  return text;
}
