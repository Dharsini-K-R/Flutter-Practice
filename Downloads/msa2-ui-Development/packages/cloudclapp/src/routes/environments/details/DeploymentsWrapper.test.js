import React from "react";
import { renderWithProvider, wait } from "cloudclapp/src/utils/test-utils";
import DeploymentsWrapper from "./DeploymentsWrapper";
import initialState from "cloudclapp/src/store/initialState";
import { deployments, environment, permissionProfiles } from "./mocks";
import { getWorkflowDetailsResponse } from "msa2-ui/src/mocks/workflows";
import { cloudVendors } from "cloudclapp/src/routes/dashboard/mock";

jest.mock(
  "cloudclapp/src/components/add-items-button/AddItemsButton",
  () => () => <div>Mock AddItemsButton</div>,
);
const mockState = {
  ...initialState,
  designations: { ...initialState.designations, cloudVendors, deployments, permissionProfiles },
};
describe("DeploymentsWrapper component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it("renders correctly", () => {
    const { getByText } = renderWithProvider({
      childComponent: <DeploymentsWrapper environment={environment} />,
      mockState,
    });
    expect(getByText("States")).toBeTruthy();
    // expect(getByText("Users")).toBeTruthy();
  });
  it("Calls child component - AddItemsButton", () => {
    const { getAllByText } = renderWithProvider({
      childComponent: <DeploymentsWrapper environment={environment} />,
      mockState,
    });
    const mockComponent = getAllByText("Mock AddItemsButton");
    expect(mockComponent).toBeDefined();
  });
  it("intially renders the loading spinner", () => {
    const { getByLabelText } = renderWithProvider({
      childComponent: <DeploymentsWrapper environment={environment} />,
      mockState,
    });
    const loader = getByLabelText("Loading");
    expect(loader).toBeDefined();
  });

  it("makes the API calls to fetch workflow details", async () => {
    fetch.mockResponseOnce(JSON.stringify(getWorkflowDetailsResponse));

    renderWithProvider({
      childComponent: <DeploymentsWrapper environment={environment} />,
      mockState,
    });

    await wait();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain(
      "/ubi-api-rest/orchestration/v2/005A126/workflow/details?serviceName=Process%2Fcloudclapp-wf%2FProvision_Apps_EKS_Cluster%2FProvision_Apps_EKS_Cluster&status=&page=1&page_size=10000&sort=name&sort_order=ASC",
    );
  });
});
