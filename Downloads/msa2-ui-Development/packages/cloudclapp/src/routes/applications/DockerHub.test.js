import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import DockerHub from "./DockerHub";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };

describe("DockerHub component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <DockerHub />,
      mockState,
    });
    expect(getByTestId("dockerhub-component")).toBeTruthy();
  });
});
