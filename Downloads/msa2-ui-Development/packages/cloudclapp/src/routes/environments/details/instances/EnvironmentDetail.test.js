import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";
import EnvironmentDetail from "./EnvironmentDetail";
import { environment, cloudVendor } from "../mocks";

const mockState = initialState;

const render = (childComponent) =>
  renderWithProvider({ childComponent, mockState });

jest.mock("cloudclapp/src/components/user-button/UserButton", () => () => (
  <div>Mock UserButton</div>
));
describe("EnvironmentDetails component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it("renders correctly", () => {
    const { getByText } = render(
      <EnvironmentDetail
        environment={environment}
        cloudVendor={cloudVendor}
        configTab={false}
      />,
    );
    expect(getByText("ENVIRONMENT")).toBeTruthy();
  });
  it("Calls child component - UserButton", () => {
    const { getAllByText } = render(
      <EnvironmentDetail environment={environment} cloudVendor={cloudVendor} />,
    );
    const mockComponent = getAllByText("Mock UserButton");
    expect(mockComponent).toBeDefined();
  });
});
