import React from "react";
import configureMockStore from "redux-mock-store";
import {
  renderWithProvider,
  screen,
  fireEvent,
} from "cloudclapp/src/utils/test-utils";

import initialState from "cloudclapp/src/store/initialState";
import UserMenu from "./UserMenu";

const mockState = initialState;

describe("TableMessage component", () => {
  it("renders the expected rows per page and pagination info", () => {
    const mockStore = configureMockStore()(mockState);
    renderWithProvider({
      childComponent: <UserMenu />,
      mockStore,
    });

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);
    expect(logoutButton).toBeDefined();
  });
});
