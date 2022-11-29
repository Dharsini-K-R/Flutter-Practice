import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";

import SecurityChip from "./SecurityChip";

const props = {
  count: 10,
  idPrefix: "TEST_ID",
  severityId: "high",
  color: "#327BF6",
  label: "HIGH",
};

describe("Security Chip component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<SecurityChip {...props} />);
    expect(getByText("HIGH 10")).toBeTruthy();
  });
});
