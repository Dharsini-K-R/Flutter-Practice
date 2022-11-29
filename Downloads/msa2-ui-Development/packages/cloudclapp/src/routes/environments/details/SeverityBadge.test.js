import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";

import SeverityBadge from "./SeverityBadge";

describe("SeverityBadge", () => {
  it("should return a colored badge corresponding to the severityLevel 6", () => {
    const { container } = render(<SeverityBadge severityLevel={6} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="MuiChip-root"
        style="background-color: rgb(100, 108, 125); text-transform: uppercase; color: rgb(29, 33, 41); font-weight: 500;"
      >
        <span
          class="MuiChip-label"
        >
          6: Informational
        </span>
      </div>
    `);
  });

  it("should return a colored badge corresponding to the severityLevel 3", () => {
    const { container } = render(<SeverityBadge severityLevel={3} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="MuiChip-root"
        style="background-color: rgb(219, 46, 20); text-transform: uppercase; color: rgb(255, 255, 255); font-weight: 500;"
      >
        <span
          class="MuiChip-label"
        >
          3: Error
        </span>
      </div>
    `);
  });

  it("should return a colored badge corresponding to the severityLevel 1", () => {
    const { container } = render(<SeverityBadge severityLevel={1} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="MuiChip-root"
        style="background-color: rgb(219, 46, 20); text-transform: uppercase; color: rgb(255, 255, 255); font-weight: 500;"
      >
        <span
          class="MuiChip-label"
        >
          1: Alert
        </span>
      </div>
    `);
  });

  it("can handle being passed a string for severityLevel", () => {
    expect(() => render(<SeverityBadge severityLevel="6" />)).not.toThrow();
  });
});
