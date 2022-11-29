import React from "react";
import { renderWithProvider, wait } from "cloudclapp/src/utils/test-utils";
import AddDeploymentDialog from "./AddDeploymentDialog";
import initialState from "cloudclapp/src/store/initialState";
import { getWorkflowResponse } from "msa2-ui/src/mocks/workflows";
import { getProcessVariableTypesByTaskResponse } from "msa2-ui/src/mocks/workflows.transformed";
import { act } from "react-dom/test-utils";

const onClose = jest.fn();
const mockState = {
  ...initialState,
};

describe("Add Deployment Dialog", () => {
  it("renders correctly", async () => {
    act(() => {
      fetch.mockResponses(
        [JSON.stringify(getWorkflowResponse)],
        [JSON.stringify(getProcessVariableTypesByTaskResponse)],
      );
    });
    const { getByText } = renderWithProvider({
      childComponent: <AddDeploymentDialog onClose={onClose} />,
      mockState,
    });
    await wait();
    expect(getByText("Create New Deployment")).toBeTruthy();
  });
});
