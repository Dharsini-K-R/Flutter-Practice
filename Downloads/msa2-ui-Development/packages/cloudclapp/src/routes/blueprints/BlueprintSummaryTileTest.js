import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import BlueprintSummaryTile from "./BlueprintSummaryTile";

describe("Blueprint summary tile component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<BlueprintSummaryTile />);
    expect(getByTestId("blueprints-summary-tile")).toBeTruthy();
  });
});
