import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import Blueprints from "./Blueprints";
import initialState from "cloudclapp/src/store/initialState";
const mockState = { ...initialState };

describe("Blueprints component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <Blueprints />,
      mockState,
    });
    expect(getByTestId("blueprints-container")).toBeTruthy();
  });
});
