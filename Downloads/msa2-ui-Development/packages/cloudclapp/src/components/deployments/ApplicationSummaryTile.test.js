import React from "react";
import { applications } from "./mocks";
import ApplicationSummaryTile from "./ApplicationSummaryTile";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };

describe(" Application Summary Tile Component", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithProvider({
      childComponent: <ApplicationSummaryTile input={applications} />,
      mockState,
    });
    expect(getByText("NATS0")).toBeTruthy();
  });
});
