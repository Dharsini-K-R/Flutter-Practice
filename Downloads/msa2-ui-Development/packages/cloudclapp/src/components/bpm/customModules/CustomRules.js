import inherits from "inherits";

import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";

import { getIsReadonlyElement } from "cloudclapp/src/services/EnvironmentDesigner";

/**
 * A custom rule provider that decides what elements can be
 * dropped where based on a `vendor:allowDrop` BPMN extension.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = ["eventBus"];

CustomRules.prototype.init = function() {
  this.addRule("elements.delete", function(context) {
    // Not allow deleting Start Event and End Event as it cannot be added from Cloudclapp UI
    // Also we don't want to change its ID
    const isReadonlyElement = context.elements?.some((element) =>
      getIsReadonlyElement(element),
    );
    if (isReadonlyElement) {
      return false;
    }
  });
};
