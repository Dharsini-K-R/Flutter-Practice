import React from "react";
import { renderWithProvider } from "msa2-ui/src/utils/test-utils";
import Applications from "./Applications";
import initialState from "cloudclapp/src/store/initialState";
import { permissionProfiles } from "cloudclapp/src/routes/environments/details/mocks"

const mockState = {
  ...initialState,
  tabSelected: 0,
  searchString: "",
  officialImages: false,
  rowsPerPage: 10,
  page: 0,
  designations: { ...initialState.designations, permissionProfiles }
};

describe("Applications component", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = renderWithProvider({
      childComponent: <Applications />,
      mockState,
    });

    expect(getByText("Docker Hub")).toBeTruthy();
    expect(getByTestId("applications-dockerhub-component")).toBeTruthy();
  });
});
