import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import EnvironmentSectionHeader from "./EnvironmentSectionHeader";
const props = {
  title: "Development",
  owner: 125,
  status: "OK",
}
jest.mock("cloudclapp/src/components/user-button", () => () => (
  <div>Mock UserButton</div>
));
describe("EnvironmentSectionHeader component", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(
      <EnvironmentSectionHeader {...props} />,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(getByText("Development")).toBeTruthy();
  });
  it("Calls child component - UserButton", () => {
    const { getByText } = render(
      <EnvironmentSectionHeader {...props} />,
    );
    const mockComponent = getByText("Mock UserButton");
    expect(mockComponent).toBeDefined();
  });
});
