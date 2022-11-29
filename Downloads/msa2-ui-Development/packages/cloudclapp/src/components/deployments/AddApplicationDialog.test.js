import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import AddApplicationDialog from "./AddApplicationDialog";
import initialState from "cloudclapp/src/store/initialState";

const onClose = jest.fn();
const addApplicationsToContext = jest.fn();
const mockState = {
  ...initialState,
};

describe("Add Application Dialog", () => {
  it("renders correctly", () => {
    const { getAllByText, getByText } = renderWithProvider({
      childComponent: (
        <AddApplicationDialog
          onClose={onClose}
          addApplicationsToContext={addApplicationsToContext}
        />
      ),
      mockState,
    });

    expect(getAllByText("Add Application Images")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
  });
});
