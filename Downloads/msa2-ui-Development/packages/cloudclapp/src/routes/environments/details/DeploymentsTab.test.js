import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import DeploymentsTab from "./DeploymentsTab";
import { environment } from "./mocks";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };
jest.mock(
  "cloudclapp/src/routes/environments/details/DeploymentsWrapper",
  () => () => <div>Mock DeploymentsWrapper</div>,
);

describe("DeploymentsTab component", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = renderWithProvider({
      childComponent: <DeploymentsTab environment={environment} />,
      mockState,
    });

    expect(getByTestId("deployments-tab-container")).toBeTruthy();
    expect(getByText("DEPLOYMENTS")).toBeTruthy();
  });
  it("Calls child component - DeploymentsWrapper", () => {
    const { getAllByText } = renderWithProvider({
      childComponent: <DeploymentsTab environment={environment} />,
      mockState,
    });
    const mockComponent = getAllByText("Mock DeploymentsWrapper");
    expect(mockComponent).toBeDefined();
  });
});
