import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

const onClose = jest.fn();

describe("Forgot Password Dialog", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<ForgotPasswordDialog onClose={onClose} />);
    expect(getByTestId("FORGOT_PASSWORD_DIALOG")).toBeTruthy();
    expect(getByTestId("FORGOT_PASSWORD_DIALOG_INPUT")).toBeTruthy();
  });
});
