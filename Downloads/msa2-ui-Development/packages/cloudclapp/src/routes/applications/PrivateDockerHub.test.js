import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import PrivateDockerHub from "./PrivateDockerHub";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };

describe("Private DockerHub component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <PrivateDockerHub />,
      mockState,
    });
    expect(getByTestId("private-dockerhub-component")).toBeTruthy();
  });
});
