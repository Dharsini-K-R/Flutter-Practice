import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import QuickDeployment from "./QuickDeployment";
import initialState from "cloudclapp/src/store/initialState.js";

const mockState = {
  ...initialState,
};
describe("Quick Deployment component", () => {
  it("renders correctly", () => {
    const { container, getByText } = renderWithProvider({
      childComponent: <QuickDeployment />,
      mockState,
    });
    expect(container.firstChild).toMatchSnapshot();

    expect(getByText("Choose the application you want to deploy")).toBeTruthy();
    expect(getByText("Create a Quick Deployment")).toBeTruthy();
  });
});
