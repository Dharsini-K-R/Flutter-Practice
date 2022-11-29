import { is, getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";

const READ_ONLY_ELEMENT_TYPES = ["bpmn:StartEvent", "bpmn:EndEvent"];
export const getIsReadonlyElement = (element) => {
  if (
    isAny(element, READ_ONLY_ELEMENT_TYPES) ||
    (is(element, "bpmn:SequenceFlow") && getIsReadonlySequenceFlow(element))
  ) {
    return true;
  }
  return false;
};

export const getIsReadonlySequenceFlow = (element) => {
  const businessObject = getBusinessObject(element);
  const sourceElement = businessObject.sourceRef;
  const targetElement = businessObject.targetRef;
  if (
    is(sourceElement, "bpmn:StartEvent") ||
    is(targetElement, "bpmn:EndEvent")
  ) {
    // Arrows from Start Event and the one to End Event should be hidden.
    return true;
  }
  return false;
};

export default { getIsReadonlySequenceFlow, getIsReadonlyElement };
