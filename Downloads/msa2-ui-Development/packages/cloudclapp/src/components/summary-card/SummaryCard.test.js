import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import SummaryCard from "./SummaryCard";

const TEST_ICON = "Test Icon";
const TestIcon = () => <div>{TEST_ICON}</div>;

const props = {
  title: "Deployments",
  icon: TestIcon,
  count: 2,
  buttonText: "Add Deployment",
  onClickCallback: jest.fn(),
  idPrefix: "ENVIRONMENT_DETAILS_DEPLOYMENTS",
};
describe("SummaryCard component", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(<SummaryCard {...props} />);
    expect(getByText("Deployments")).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });
  it("intially renders the loading spinner", () => {
    const { getByLabelText } = render(
      <SummaryCard {...props} isLoading={true} />,
    );
    const loader = getByLabelText("Loading");
    expect(loader).toBeDefined();
  });
});
