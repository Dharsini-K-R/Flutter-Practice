import React from "react";
import { renderWithProvider, act, wait } from "cloudclapp/src/utils/test-utils";
import AddDeployment from "./AddDeployment";
import workflowContext from "msa2-ui/src/mocks/workflowContext";
import initialState from "cloudclapp/src/store/initialState";
import { getWorkflowResponse } from "msa2-ui/src/mocks/workflows";
import { getProcessVariableTypesByTaskResponse } from "msa2-ui/src/mocks/workflows.transformed";

const mockState = {
  ...initialState,
};

jest.mock(
  "cloudclapp/src/components/deployments/AddApplicationTile",
  () => () => <div>AddApplicationTile</div>,
);

describe("Add Deployment", () => {
  it("renders correctly", async () => {
    act(() => {
      fetch.mockResponses(
        [JSON.stringify(getWorkflowResponse)],
        [JSON.stringify(getProcessVariableTypesByTaskResponse)],
      );
    });
    const { getByText } = renderWithProvider({
      childComponent: <AddDeployment workflowContext={workflowContext} />,
      mockState,
    });
    await wait();
    expect(getByText("Application Images")).toBeTruthy();
    expect(getByText("AddApplicationTile")).toBeTruthy();
  });
});
