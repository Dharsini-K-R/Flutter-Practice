import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import Deployments from "./Deployments";
import initialState from "cloudclapp/src/store/initialState";
import { environments } from "./mocks";
import { cloudVendors } from "cloudclapp/src/routes/dashboard/mock";
import { mockWorkflowDetails } from "cloudclapp/src/routes/environments/details/instances/workflowMock";

const mockState = {
  ...initialState,
  designations: {
    workflows: mockWorkflowDetails.workflow,
    environments,
    cloudVendors,
  },
};
describe("Deployment component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <Deployments />,
      mockState,
    });
    expect(getByTestId("deployments-container")).toBeTruthy();
  });
});
