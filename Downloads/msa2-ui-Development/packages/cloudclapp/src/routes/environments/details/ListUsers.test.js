import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import ListUsers from "./ListUsers";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };

describe("DockerHub component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <ListUsers />,
      mockState,
    });
    expect(getByTestId("envUserListComponent")).toBeTruthy();
  });
});
