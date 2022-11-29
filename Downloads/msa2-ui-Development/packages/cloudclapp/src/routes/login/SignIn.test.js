import React from "react";
import thunk from "redux-thunk";

import {
  renderWithProvider,
  screen,
  fireEvent,
  wait,
} from "cloudclapp/src/utils/test-utils";
import configureMockStore from "redux-mock-store";
import initialState from "cloudclapp/src/store/initialState";

import SignIn from "./SignIn";

const middleware = [thunk];

const mockState = initialState;

describe("SignIn", () => {
  test("renders ok", () => {
    renderWithProvider({
      childComponent: <SignIn />,
      mockState,
    });

    const email = screen.getByText("Email Address");
    expect(email).toBeDefined();

    const login = screen.getByText("Login");
    expect(login).toBeDefined();

    const signup = screen.getByText("Get Started");
    expect(signup).toBeDefined();

    const forgotPassword = screen.getByText("Forgot Password?");
    expect(forgotPassword).toBeDefined();
  });

  test("should display an error when the login API request fails", async () => {
    const mockStore = configureMockStore(middleware)(mockState);
    fetch.mockResponses([
      JSON.stringify({ message: "auth failed" }),
      { status: 401 },
    ]);

    renderWithProvider({
      childComponent: <SignIn />,
      mockStore,
    });

    const username = screen.getByLabelText(/Email Address/i);
    fireEvent.change(username, { target: { value: "name" } });
    const password = screen.getByLabelText(/^Password/i);
    fireEvent.change(password, { target: { value: "password" } });
    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);
    await wait();

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/ubi-api-rest/auth/token");
    screen.getByText("auth failed");
  });

  test("should lead to the new path when Get Started button is clicked", () => {
    renderWithProvider({
      childComponent: <SignIn />,
      mockState,
    });

    const loginButton = screen.getByText("Get Started");
    fireEvent.click(loginButton);

    expect(global.window.location.pathname).toEqual("/sign-up");
  });

  test("should open forgot password dialog when Forgot Password button is clicked", () => {
    renderWithProvider({
      childComponent: <SignIn />,
      mockState,
    });

    const forgotPasswordButton = screen.getByText("Forgot Password?");
    fireEvent.click(forgotPasswordButton);
    expect(global.window.location.pathname).toEqual("/sign-in/forgot-password");
  });
});
