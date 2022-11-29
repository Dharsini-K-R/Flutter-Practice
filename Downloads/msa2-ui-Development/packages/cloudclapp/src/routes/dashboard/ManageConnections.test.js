import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import ManageConnections from "./ManageConnections";
import { screen } from "msa2-ui/src/utils/test-utils";
import initialState from "../../store/initialState";

const mockState = {
  ...initialState,
  // designations: { organisation, environments },
};
const mockOnClose = jest.fn();

describe("Manage Connections Component", () => {
  it("renders correctly", () => {
    const { queryByTestId } = renderWithProvider({
      childComponent: <ManageConnections onClose={mockOnClose} />,
      mockState,
    });

    const id = screen.queryByTestId("cloud-connections-dialog");
    expect(id).toBeDefined();
  });
});
