import React from "react";
import {
  renderWithProvider,
  wait,
  fireEvent,
} from "cloudclapp/src/utils/test-utils";
import WorkflowInstance from "./WorkflowInstance";
import initialState from "cloudclapp/src/store/initialState";
import { mockWorkflowDetails } from "./workflowMock";
import { act } from "react-dom/test-utils";
import { getProcessVariableTypesByTaskResponse } from "msa2-ui/src/mocks/workflows.transformed";
import mediaQuery from "css-mediaquery";
const envUbiqubeId = "00pA144";
jest.mock("msa2-ui/src/components/SelectSearch", () => () => (
  <div>Mock SelectSearch</div>
));
const mockState = { ...initialState };

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe("WorkflowInstance component", () => {
  beforeEach(() => {
    act(() => {
      fetch.mockResponses(
        [JSON.stringify(mockWorkflowDetails.workflow)],
        [JSON.stringify(getProcessVariableTypesByTaskResponse)],
        [JSON.stringify({ WorkflowDialog: <div>Mock WorkflowDialog</div> })],
      );
    });
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  it("renders correctly", () => {
    const { getByText } = renderWithProvider({
      childComponent: (
        <WorkflowInstance
          workflowData={mockWorkflowDetails.workflow}
          envUbiqubeId={envUbiqubeId}
        />
      ),
      mockState,
    });
    expect(getByText("More Actions")).toBeTruthy();
  });

  it("should show the process picker when more actions is clicked", async () => {
    const { getByText } = renderWithProvider({
      childComponent: (
        <WorkflowInstance
          workflowData={mockWorkflowDetails.workflow}
          envUbiqubeId={envUbiqubeId}
        />
      ),
      mockState,
    });
    await wait();

    const actions = getByText("More Actions");
    fireEvent.click(actions);
    const mockComponent = getByText("Mock SelectSearch");
    expect(mockComponent).toBeDefined();
  });
});
