import { forEach } from "min-dash";
import {
  event as domEvent,
  query as domQuery,
  queryAll as domQueryAll,
} from "min-dom";

import {
  BENDPOINT_CLS,
  SEGMENT_DRAGGER_CLS,
  addBendpoint,
  addSegmentDragger,
  calculateSegmentMoveRegion,
  getConnectionIntersection,
} from "diagram-js/lib/features/bendpoints/BendpointUtil";
import { escapeCSS } from "diagram-js/lib/util/EscapeUtil";
import { pointsAligned, getMidPoint } from "diagram-js/lib/util/Geometry";
import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove,
} from "tiny-svg";
import { translate } from "diagram-js/lib/util/SvgTransformUtil";

import { getIsReadonlyElement } from "cloudclapp/src/services/EnvironmentDesigner";

/**
 * A service that adds editable bendpoints to connections.
 * Original component:
 *   node_modules\diagram-js\lib\features\bendpoints\Bendpoints.js
 */
export default function CustomBendpoints(
  eventBus,
  canvas,
  interactionEvents,
  bendpointMove,
  connectionSegmentMove,
) {
  /**
   * Returns true if intersection point is inside middle region of segment, adjusted by
   * optional threshold
   */
  function isIntersectionMiddle(intersection, waypoints, treshold) {
    const idx = intersection.index;
    const p = intersection.point;

    if (idx <= 0 || intersection.bendpoint) {
      return false;
    }

    const p0 = waypoints[idx - 1];
    const p1 = waypoints[idx];
    const mid = getMidPoint(p0, p1);
    const aligned = pointsAligned(p0, p1);
    const xDelta = Math.abs(p.x - mid.x);
    const yDelta = Math.abs(p.y - mid.y);

    return aligned && xDelta <= treshold && yDelta <= treshold;
  }

  /**
   * Calculates the threshold from a connection's middle which fits the two-third-region
   */
  function calculateIntersectionThreshold(connection, intersection) {
    const waypoints = connection.waypoints;
    let segmentLength;

    if (intersection.index <= 0 || intersection.bendpoint) {
      return null;
    }

    // segment relative to connection intersection
    const relevantSegment = {
      start: waypoints[intersection.index - 1],
      end: waypoints[intersection.index],
    };

    const alignment = pointsAligned(relevantSegment.start, relevantSegment.end);

    if (!alignment) {
      return null;
    }

    if (alignment === "h") {
      segmentLength = relevantSegment.end.x - relevantSegment.start.x;
    } else {
      segmentLength = relevantSegment.end.y - relevantSegment.start.y;
    }

    // calculate threshold relative to 2/3 of segment length
    return calculateSegmentMoveRegion(segmentLength) / 2;
  }

  function activateBendpointMove(event, connection) {
    const waypoints = connection.waypoints;
    const intersection = getConnectionIntersection(canvas, waypoints, event);

    if (!intersection) {
      return;
    }

    const threshold = calculateIntersectionThreshold(connection, intersection);

    if (isIntersectionMiddle(intersection, waypoints, threshold)) {
      connectionSegmentMove.start(event, connection, intersection.index);
    } else {
      bendpointMove.start(
        event,
        connection,
        intersection.index,
        !intersection.bendpoint,
      );
    }

    // we've handled the event
    return true;
  }

  function bindInteractionEvents(node, eventName, element) {
    domEvent.bind(node, eventName, function(event) {
      interactionEvents.triggerMouseEvent(eventName, event, element);
      event.stopPropagation();
    });
  }

  function getBendpointsContainer(element, create) {
    const layer = canvas.getLayer("overlays");
    let gfx = domQuery(
      '.djs-bendpoints[data-element-id="' + escapeCSS(element.id) + '"]',
      layer,
    );

    if (!gfx && create) {
      gfx = svgCreate("g");
      svgAttr(gfx, { "data-element-id": element.id });
      svgClasses(gfx).add("djs-bendpoints");

      svgAppend(layer, gfx);

      bindInteractionEvents(gfx, "mousedown", element);
      bindInteractionEvents(gfx, "click", element);
      bindInteractionEvents(gfx, "dblclick", element);
    }

    return gfx;
  }

  function getSegmentDragger(idx, parentGfx) {
    return domQuery(
      '.djs-segment-dragger[data-segment-idx="' + idx + '"]',
      parentGfx,
    );
  }

  function createBendpoints(gfx, connection) {
    connection.waypoints.forEach(function(p, idx) {
      const bendpoint = addBendpoint(gfx);

      svgAppend(gfx, bendpoint);

      translate(bendpoint, p.x, p.y);
    });

    // add floating bendpoint
    addBendpoint(gfx, "floating");
  }

  function createSegmentDraggers(gfx, connection) {
    const waypoints = connection.waypoints;

    let segmentStart, segmentEnd, segmentDraggerGfx;

    for (let i = 1; i < waypoints.length; i++) {
      segmentStart = waypoints[i - 1];
      segmentEnd = waypoints[i];

      if (pointsAligned(segmentStart, segmentEnd)) {
        segmentDraggerGfx = addSegmentDragger(gfx, segmentStart, segmentEnd);

        svgAttr(segmentDraggerGfx, { "data-segment-idx": i });

        bindInteractionEvents(segmentDraggerGfx, "mousemove", connection);
      }
    }
  }

  function clearBendpoints(gfx) {
    forEach(domQueryAll("." + BENDPOINT_CLS, gfx), function(node) {
      svgRemove(node);
    });
  }

  function clearSegmentDraggers(gfx) {
    forEach(domQueryAll("." + SEGMENT_DRAGGER_CLS, gfx), function(node) {
      svgRemove(node);
    });
  }

  function addHandles(connection) {
    let gfx = getBendpointsContainer(connection);

    if (!gfx) {
      gfx = getBendpointsContainer(connection, true);

      createBendpoints(gfx, connection);
      createSegmentDraggers(gfx, connection);
    }

    return gfx;
  }

  function updateHandles(connection) {
    const gfx = getBendpointsContainer(connection);

    if (gfx) {
      clearSegmentDraggers(gfx);
      clearBendpoints(gfx);
      createSegmentDraggers(gfx, connection);
      createBendpoints(gfx, connection);
    }
  }

  function updateFloatingBendpointPosition(parentGfx, intersection) {
    const floating = domQuery(".floating", parentGfx);
    const point = intersection.point;

    if (!floating) {
      return;
    }

    translate(floating, point.x, point.y);
  }

  function updateSegmentDraggerPosition(parentGfx, intersection, waypoints) {
    const draggerGfx = getSegmentDragger(intersection.index, parentGfx);
    const segmentStart = waypoints[intersection.index - 1];
    const segmentEnd = waypoints[intersection.index];
    const point = intersection.point;
    const mid = getMidPoint(segmentStart, segmentEnd);
    const alignment = pointsAligned(segmentStart, segmentEnd);
    let relativePosition;

    if (!draggerGfx) {
      return;
    }

    const draggerVisual = getDraggerVisual(draggerGfx);

    relativePosition = {
      x: point.x - mid.x,
      y: point.y - mid.y,
    };

    if (alignment === "v") {
      // rotate position
      relativePosition = {
        x: relativePosition.y,
        y: relativePosition.x,
      };
    }

    translate(draggerVisual, relativePosition.x, relativePosition.y);
  }

  eventBus.on("connection.changed", function(event) {
    updateHandles(event.element);
  });

  eventBus.on("connection.remove", function(event) {
    const gfx = getBendpointsContainer(event.element);

    if (gfx) {
      svgRemove(gfx);
    }
  });

  eventBus.on("element.marker.update", function(event) {
    const element = event.element;

    if (!element.waypoints || getIsReadonlyElement(element)) {
      return;
    }

    const bendpointsGfx = addHandles(element);

    if (event.add) {
      svgClasses(bendpointsGfx).add(event.marker);
    } else {
      svgClasses(bendpointsGfx).remove(event.marker);
    }
  });

  eventBus.on("element.mousemove", function(event) {
    const element = event.element;
    const waypoints = element.waypoints;
    let bendpointsGfx;
    let intersection;

    if (waypoints) {
      bendpointsGfx = getBendpointsContainer(element, true);

      intersection = getConnectionIntersection(
        canvas,
        waypoints,
        event.originalEvent,
      );

      if (!intersection) {
        return;
      }

      updateFloatingBendpointPosition(bendpointsGfx, intersection);

      if (!intersection.bendpoint) {
        updateSegmentDraggerPosition(bendpointsGfx, intersection, waypoints);
      }
    }
  });

  eventBus.on("element.mousedown", function(event) {
    const originalEvent = event.originalEvent;
    const element = event.element;

    if (!element.waypoints || getIsReadonlyElement(element)) {
      return;
    }

    return activateBendpointMove(originalEvent, element);
  });

  eventBus.on("selection.changed", function(event) {
    const newSelection = event.newSelection;
    const primary = newSelection[0];

    if (primary && primary.waypoints) {
      addHandles(primary);
    }
  });

  eventBus.on("element.hover", function(event) {
    const element = event.element;

    if (element.waypoints) {
      addHandles(element);
      interactionEvents.registerEvent(
        event.gfx,
        "mousemove",
        "element.mousemove",
      );
    }
  });

  eventBus.on("element.out", function(event) {
    interactionEvents.unregisterEvent(
      event.gfx,
      "mousemove",
      "element.mousemove",
    );
  });

  // update bendpoint container data attribute on element ID change
  eventBus.on("element.updateId", function(context) {
    const element = context.element;
    const newId = context.newId;

    if (element.waypoints) {
      const bendpointContainer = getBendpointsContainer(element);

      if (bendpointContainer) {
        svgAttr(bendpointContainer, { "data-element-id": newId });
      }
    }
  });

  // API

  this.addHandles = addHandles;
  this.updateHandles = updateHandles;
  this.getBendpointsContainer = getBendpointsContainer;
  this.getSegmentDragger = getSegmentDragger;
}

CustomBendpoints.$inject = [
  "eventBus",
  "canvas",
  "interactionEvents",
  "bendpointMove",
  "connectionSegmentMove",
];

// helper /////////////

function getDraggerVisual(draggerGfx) {
  return domQuery(".djs-visual", draggerGfx);
}
