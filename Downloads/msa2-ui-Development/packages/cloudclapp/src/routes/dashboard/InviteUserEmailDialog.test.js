import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import initialState from "../../store/initialState";
import InviteUserEmailDialog from "./InviteUserEmailDialog";

const mockState = {
  ...initialState,
};
const onClose = jest.fn();

describe("Invite User Email Dialog", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <InviteUserEmailDialog onClose={onClose} />,
      mockState,
    });
    expect(getByTestId("INVITE_USER_EMAIL_DIALOG")).toBeTruthy();
    expect(getByTestId("INVITE_USER_DIALOG_INPUT")).toBeTruthy();
  });
});
