import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import ChangeOwnershipDialog from "./ChangeOwnershipDialog";
import { userList as managerList } from "./mocks";
import initialState from "cloudclapp/src/store/initialState";

const onClose = jest.fn();
const onExec = jest.fn();
const currentOwner = 125;
const envName = "Development";
const envId = 29;
const props = { onClose, onExec, currentOwner, envName, envId };

const mockState = {
  ...initialState,
  designations: { environmentSummary: { managerList } },
};

describe("ChangeOwnershipDialog component", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithProvider({
      childComponent: <ChangeOwnershipDialog {...props} />,
      mockState,
    });

    expect(getByText("Change Ownership")).toBeTruthy();
  });
});
