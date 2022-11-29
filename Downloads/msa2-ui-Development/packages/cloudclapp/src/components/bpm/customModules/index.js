import Palette from "./Palette";
import ContextPad from "./ContextPad";
import CustomRenderer from "./CustomRenderer";
import CustomRules from "./CustomRules";
import CustomBendpoints from "./CustomBendpoints";

// Customisation Example:
// https://github.com/bpmn-io/bpmn-js-example-custom-shapes/blob/master/app/custom-modeler/custom/index.js
export default {
  __init__: ["customRenderer", "customRules", "bendpoints"],
  customRenderer: ["type", CustomRenderer],
  customRules: ["type", CustomRules],
  paletteProvider: ["type", Palette],
  contextPadProvider: ["type", ContextPad],
  bendpoints: ["type", CustomBendpoints],
};
