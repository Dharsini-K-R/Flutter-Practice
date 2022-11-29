import React from "react";
import { renderWithProvider, wait } from "cloudclapp/src/utils/test-utils";
import EnvironmentConfig from "./EnvironmentConfig";
import { environment } from "./mocks";
import initialState from "cloudclapp/src/store/initialState";
import { act } from "react-dom/test-utils";
import { getWorkflowResponse } from "msa2-ui/src/mocks/workflows";

jest.mock("cloudclapp/src/components/ccla-console", () => () => (
  <div>Mock MSAConsole</div>
));
const mockState = { ...initialState };
jest.mock(
  "cloudclapp/src/routes/environments/details/instances/EnvironmentCloudVendor",
  () => () => <div>Mock EnvironmentCloudVendor</div>,
);
jest.mock(
  "cloudclapp/src/routes/environments/details/instances/EnvironmentSectionHeader",
  () => () => <div>Mock EnvironmentSectionHeader</div>,
);

describe("EnvironmentConfig Component", () => {
  beforeEach(() => {
    act(() => {
      fetch.mockResponses([JSON.stringify(getWorkflowResponse)]);
    });
  });
  it("renders correctly", async () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <EnvironmentConfig environment={environment} />,
      mockState,
    });
    await wait();
    expect(getByTestId("environment-config-container")).toBeTruthy();
  });

  it("Calls child components - EnvironmentCloudVendor, EnvironmentSectionHeader", async () => {
    const { getByText } = renderWithProvider({
      childComponent: <EnvironmentConfig environment={environment} />,
      mockState,
    });
    await wait();

    const mockEnvironmentCloudVendorComponent = getByText(
      "Mock EnvironmentCloudVendor",
    );
    expect(mockEnvironmentCloudVendorComponent).toBeDefined();

    const mockEnvironmentSectionHeaderComponent = getByText(
      "Mock EnvironmentSectionHeader",
    );
    expect(mockEnvironmentSectionHeaderComponent).toBeDefined();
  });
});
