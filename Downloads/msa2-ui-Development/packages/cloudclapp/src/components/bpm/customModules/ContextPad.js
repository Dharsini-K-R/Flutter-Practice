// Visit https://github.com/bpmn-io/bpmn-js/blob/develop/lib/features/context-pad/ContextPadProvider.js to see the usage
// You can also refer node_modules/bpmn-js/lib/features/context-pad/ContextPadProvider.js

import { isExpanded } from "bpmn-js/lib/util/DiUtil";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import { getChildLanes } from "bpmn-js/lib/features/modeling/util/LaneUtil";
import { hasPrimaryModifier } from "diagram-js/lib/util/Mouse";
import { getIsReadonlyElement } from "cloudclapp/src/services/EnvironmentDesigner";

/**
 * A provider for BPMN 2.0 elements context pad
 */
export default function ContextPadProvider(
  config = {},
  injector,
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  rules,
  translate,
) {
  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._rules = rules;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get("autoPlace", false);
  }

  eventBus.on("create.end", 250, function(event) {
    const context = event.context,
      shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    const entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  "config.contextPad",
  "injector",
  "eventBus",
  "contextPad",
  "modeling",
  "elementFactory",
  "connect",
  "create",
  "rules",
  "translate",
];

ContextPadProvider.prototype.getContextPadEntries = function(element) {
  const contextPad = this._contextPad;
  const modeling = this._modeling;

  const elementFactory = this._elementFactory;
  const connect = this._connect;
  const create = this._create;
  const rules = this._rules;
  const autoPlace = this._autoPlace;
  const translate = this._translate;

  const actions = {};

  if (element.type === "label" || getIsReadonlyElement(element)) {
    return actions;
  }

  const businessObject = element.businessObject;

  function startConnect(event, element) {
    connect.start(event, element);
  }

  function removeElement(e) {
    modeling.removeElements([element]);
  }

  /**
   * Create an append action
   *
   * @param {String} type
   * @param {String} className
   * @param {String} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {
    let actionOptions = options;
    let actionTitle = title;

    if (typeof title !== "string") {
      actionOptions = title;
      actionTitle = translate("Append {type}", {
        type: type.replace(/^bpmn:/, ""),
      });
    }

    function appendStart(event, element) {
      const shape = elementFactory.createShape(
        Object.assign({ type: type }, actionOptions),
      );
      create.start(event, shape, {
        source: element,
      });
    }

    const append = autoPlace
      ? function(event, element) {
          const shape = elementFactory.createShape(
            Object.assign({ type: type }, actionOptions),
          );

          autoPlace.append(element, shape);
        }
      : appendStart;

    return {
      group: "model",
      className: className,
      title: actionTitle,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }

  function splitLaneHandler(count) {
    return function(event, element) {
      // actual split
      modeling.splitLane(element, count);

      // refresh context pad after split to
      // get rid of split icons
      contextPad.open(element, true);
    };
  }

  if (
    isAny(businessObject, ["bpmn:Lane", "bpmn:Participant"]) &&
    isExpanded(businessObject)
  ) {
    const childLanes = getChildLanes(element);

    Object.assign(actions, {
      "lane-insert-above": {
        group: "lane-insert-above",
        className: "bpmn-icon-lane-insert-above",
        title: translate("Add Lane above"),
        action: {
          click: function(event, element) {
            modeling.addLane(element, "top");
          },
        },
      },
    });

    if (childLanes.length < 2) {
      if (element.height >= 120) {
        Object.assign(actions, {
          "lane-divide-two": {
            group: "lane-divide",
            className: "bpmn-icon-lane-divide-two",
            title: translate("Divide into two Lanes"),
            action: {
              click: splitLaneHandler(2),
            },
          },
        });
      }

      if (element.height >= 180) {
        Object.assign(actions, {
          "lane-divide-three": {
            group: "lane-divide",
            className: "bpmn-icon-lane-divide-three",
            title: translate("Divide into three Lanes"),
            action: {
              click: splitLaneHandler(3),
            },
          },
        });
      }
    }

    Object.assign(actions, {
      "lane-insert-below": {
        group: "lane-insert-below",
        className: "bpmn-icon-lane-insert-below",
        title: translate("Add Lane below"),
        action: {
          click: function(event, element) {
            modeling.addLane(element, "bottom");
          },
        },
      },
    });
  }

  if (
    isAny(businessObject, [
      "bpmn:FlowNode",
      "bpmn:InteractionNode",
      "bpmn:DataObjectReference",
      "bpmn:DataStoreReference",
    ])
  ) {
    Object.assign(actions, {
      "append.text-annotation": appendAction(
        "bpmn:TextAnnotation",
        "bpmn-icon-text-annotation",
      ),
      connect: {
        group: "connect",
        className: "bpmn-icon-connection-multi",
        title: translate(
          "Connect using " +
            (businessObject.isForCompensation
              ? ""
              : "Sequence/MessageFlow or ") +
            "Association",
        ),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  // delete element entry, only show if allowed by rules
  let deleteAllowed = rules.allowed("elements.delete", { elements: [element] });

  if (Array.isArray(deleteAllowed)) {
    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element;
  }

  if (deleteAllowed) {
    Object.assign(actions, {
      delete: {
        group: "edit",
        className: "bpmn-icon-trash",
        title: translate("Remove"),
        action: {
          click: removeElement,
        },
      },
    });
  }

  return actions;
};
