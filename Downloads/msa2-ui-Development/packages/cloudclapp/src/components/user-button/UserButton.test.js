import React from "react";
import {
  fireEvent,
  screen,
  renderWithProvider,
} from "msa2-ui/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";

import UserButton from "./UserButton";

const mockState = { ...initialState };

describe("UserButton", () => {
  it("renders correctly", () => {
    const TEST_USERNAME = "Test user";
    const onClick = jest.fn();
    renderWithProvider({
      childComponent: (
        <UserButton
          id="TEST_USER_BUTTON"
          name={TEST_USERNAME}
          onClickCallback={onClick}
        />
      ),
      mockState,
    });
    const text = screen.getByText(TEST_USERNAME);
    expect(text).toBeDefined();

    fireEvent.click(text);
    expect(onClick).toHaveBeenCalled();
  });
});
