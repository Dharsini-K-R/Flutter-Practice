import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import DeploymentList from "./DeploymentList";
import { environments } from "./mocks";
import initialState from "cloudclapp/src/store/initialState";

const mockState = {
  ...initialState,
};

jest.mock("cloudclapp/src/routes/deployments/DeploymentDetails", () => () => (
  <div>Mock DeploymentDetails</div>
));
const render = (childComponent) =>
  renderWithProvider({ childComponent, mockState });

const props = {
  environments,
  searchText: "stag",
};
describe("DeploymentList component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<DeploymentList {...props} />);
    expect(getByText("Staging")).toBeTruthy();
  });
  it("Calls child component - DeploymentDetails", () => {
    const { getAllByText } = render(<DeploymentList {...props} />);
    const mockComponent = getAllByText("Mock DeploymentDetails");
    expect(mockComponent).toBeDefined();
  });
});
