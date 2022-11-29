import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import DeploymentsExpandedView from "./DeploymentsExpandedView";
import initialState from "cloudclapp/src/store/initialState";
import { mockWorkflowDetails } from "cloudclapp/src/routes/environments/details/instances/workflowMock";
import { act } from "react-dom/test-utils";
import { getProcessVariableTypesByTaskResponse } from "msa2-ui/src/mocks/workflows.transformed";

jest.mock(
  "cloudclapp/src/routes/environments/details/instances/ApplicationDetails",
  () => () => <div>Mock ApplicationDetails</div>,
);

const mockState = { ...initialState };

const props = {
  instanceId: "126088",
  appWFUri:
    "Process/cloudclapp-wf/Provision_Apps_EKS_Cluster/Provision_Apps_EKS_Cluster",
};

describe("DeploymentsExpandedView component", () => {
  beforeEach(() => {
    act(() => {
      fetch.mockResponses(
        [JSON.stringify({ isLoading: false })],
        [JSON.stringify(mockWorkflowDetails.workflow)],
        [JSON.stringify(getProcessVariableTypesByTaskResponse)],
        [JSON.stringify({ WorkflowDialog: <div>Mock WorkflowDialog</div> })],
      );
    });
  });
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <DeploymentsExpandedView {...props} />,
      mockState,
    });
    expect(getByTestId("deployments-expanded-view-container")).toBeTruthy();
  });

  it("intially renders the loading spinner", () => {
    fetch.mockResponseOnce(JSON.stringify({ isLoading: false }));
    const { getByLabelText } = renderWithProvider({
      childComponent: <DeploymentsExpandedView {...props} />,
      mockState,
    });
    const loader = getByLabelText("Loading");
    expect(loader).toBeDefined();
  });
});
