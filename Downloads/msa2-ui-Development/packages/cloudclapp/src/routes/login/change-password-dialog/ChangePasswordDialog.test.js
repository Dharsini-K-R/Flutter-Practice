import React from "react";
import { renderWithProvider, act, wait } from "cloudclapp/src/utils/test-utils";
import ChangePasswordDialog from "./ChangePasswordDialog";
import initialState from "cloudclapp/src/store/initialState";
import { linkValidationResponse } from "./mocks";

const onClose = jest.fn();
const handleSubmit = jest.fn();

const mockState = {
  ...initialState,
  formErrors: {
    newPassword: "",
    passwordConfirmation: "",
  },
  formData: {
    newPassword: "",
    passwordConfirmation: "",
  },
};

describe("Change Password Dialog", () => {
  it("renders correctly", async () => {
    act(() => {
      fetch.mockResponses([JSON.stringify(linkValidationResponse)]);
    });
    const { getByTestId } = renderWithProvider({
      childComponent: (
        <ChangePasswordDialog onClose={onClose} handleSubmit={handleSubmit} />
      ),
      mockState,
    });
    await wait();
    expect(getByTestId("CHANGE_PWD_DIALOG")).toBeTruthy();
    expect(getByTestId("CHANGE_PWD_BTN_CANCEL")).toBeTruthy();
  });
});
