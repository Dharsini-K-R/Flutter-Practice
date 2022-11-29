import React from "react";
import { renderWithProvider, fireEvent } from "cloudclapp/src/utils/test-utils";
import Header from "./Header";
import { environmentSummary } from "./mocks";
import initialState from "cloudclapp/src/store/initialState";

const TEST_ICON = "Test Icon";
const TestIcon = () => <div>{TEST_ICON}</div>;
const props = {
  name: "Development",
  icon: TestIcon,
  userId: 125,
  envId: 29,
  status: "OK",
};

const mockState = { ...initialState, designations: { environmentSummary } };

jest.mock(
  "cloudclapp/src/routes/environments/details/ChangeOwnershipDialog",
  () => () => <div>Mock ChangeOwnershipDialog</div>,
);

describe("Header Component", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithProvider({
      childComponent: <Header {...props} />,
      mockState,
    });
    expect(getByText("Development")).toBeTruthy();
  });

  it("Calls opens a Menu on clicking User Button", () => {
    const { getByLabelText } = renderWithProvider({
      childComponent: <Header {...props} />,
      mockState,
    });
    const Menu = () => <div>Menu</div>;

    const button = getByLabelText("user-button");
    fireEvent.click(button);

    expect(Menu).toBeDefined();
  });
});
