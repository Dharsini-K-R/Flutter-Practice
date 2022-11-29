import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import BlueprintDetailDialog from "./BlueprintDetailDialog";
import initialState from "cloudclapp/src/store/initialState";
const mockState = { ...initialState };
const onClose = jest.fn();

describe("BlueprintDetailDialog component", () => {
  it("renders correctly", () => {
    const { getByText } = renderWithProvider({
      childComponent: <BlueprintDetailDialog onClose={onClose} />,
      mockState,
    });
    expect(getByText("Blueprint")).toBeTruthy();
  });
});
