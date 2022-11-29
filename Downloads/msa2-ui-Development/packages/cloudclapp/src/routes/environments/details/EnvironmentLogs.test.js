import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import EnvironmentLogs from "./EnvironmentLogs";
import initialState from "cloudclapp/src/store/initialState";
import { environment } from "./mocks";

const mockState = {
  ...initialState,
};

describe("Environment Logs component", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = renderWithProvider({
      childComponent: <EnvironmentLogs environment={environment} />,
      mockState,
    });

    expect(getByTestId("environment-log-component")).toBeTruthy();
    expect(getByText("Filter By")).toBeTruthy();
    expect(getByText("Timestamp")).toBeTruthy();
    expect(getByText("Message")).toBeTruthy();
    expect(getByText("Severity")).toBeTruthy();
  });
});
