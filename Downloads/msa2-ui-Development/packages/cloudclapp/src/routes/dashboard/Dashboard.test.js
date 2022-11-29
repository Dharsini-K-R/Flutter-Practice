import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import Dashboard from "./Dashboard";
import { organisation, environments } from "./mock";
import initialState from "../../store/initialState";

const mockState = {
  ...initialState,
  designations: { organisation, environments },
};

describe("Dashboard component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <Dashboard />,
      mockState,
    });
    expect(getByTestId("dashboard-component")).toBeTruthy();
  });
});
