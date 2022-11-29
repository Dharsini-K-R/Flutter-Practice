import React from "react";

import {
  renderWithProvider,
  screen,
  fireEvent,
  wait,
} from "cloudclapp/src/utils/test-utils";
import configureMockStore from "redux-mock-store";

import initialState from "cloudclapp/src/store/initialState";

import SignUp from "./SignUp";

const grecaptchaMock = {
  ready: (callback) => {
    callback();
  },
  execute: (key, { action }) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
};

const mockState = initialState;

describe("SignUp", () => {
  test("renders ok", () => {
    renderWithProvider({
      childComponent: <SignUp />,
      mockState,
    });

    const title = screen.getByText("Create an Account");
    expect(title).toBeDefined();
  });

  it("should post the correct data to api", async () => {
    window.grecaptcha = grecaptchaMock;
    window.history.pushState({}, "", "/sign-up");
    const mockStore = configureMockStore()(mockState);
    fetch.mockResponses([JSON.stringify({}), { status: 202 }]);

    renderWithProvider({
      childComponent: <SignUp />,
      mockStore,
    });

    expect(global.window.location.pathname).toEqual("/sign-up");

    const username = screen.getByLabelText(/Email Address/i);
    fireEvent.change(username, { target: { value: "test@ubiqube.com" } });
    const password = screen.getByLabelText(/^Password/i);
    fireEvent.change(password, { target: { value: "password" } });
    const password2 = screen.getByLabelText(/Confirm Password/i);
    fireEvent.change(password2, { target: { value: "password" } });
    const group = screen.getByLabelText(/Group Name/i);
    fireEvent.change(group, { target: { value: "Test Org" } });
    const terms = screen.getByLabelText(/I accept/i);
    fireEvent.click(terms);

    const continueButton = screen.getByText("Continue");
    fireEvent.click(continueButton);
    await wait();

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/ubi-api-rest/ccla/user/register");
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body).toEqual({
      action: "validate_captcha",
      login: "test@ubiqube.com",
      organization: "Test Org",
      password: "password",
    });

    const nextTitle = screen.getByText("Verify email address");
    expect(nextTitle).toBeDefined();

    const returnToLoginButton = screen.getByText("Return to Login");
    fireEvent.click(returnToLoginButton);

    expect(global.window.location.pathname).toEqual("/");
  });
});
