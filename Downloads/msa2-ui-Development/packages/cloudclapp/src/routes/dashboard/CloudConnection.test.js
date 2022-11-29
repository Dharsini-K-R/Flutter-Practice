import React from "react";
import { renderWithProvider, wait } from "msa2-ui/src/utils/test-utils";
import { cloudVendors } from "./mock";
import initialState from "../../store/initialState";
import { screen } from "msa2-ui/src/utils/test-utils";

import CloudConnection from "./CloudConnection";

const mockState = {
  ...initialState,
  designations: { ...initialState.designations, cloudVendors },
};

describe("Cloud Manage component", () => {
  beforeEach(() => {
    URL.createObjectURL = jest.fn();
  });
  it("renders correctly", async () => {
    const mockOnClose = jest.fn();
    const cloudContData = {
      cloudVendor: "aws",
      cloudType: "Public Cloud",
      vendorDisplayName: "AWS",
      connections: [
        {
          connectionStatus: "Connected",
          connectionName: "aws-connection-1",
        },
        {
          connectionStatus: "No Connection",
          connectionName: "aws-connection-2",
        },
      ],
    };

    renderWithProvider({
      childComponent: (
        <CloudConnection onClose={mockOnClose} cloudContData={cloudContData} />
      ),
      mockState,
    });
    await wait();

    const id = screen.queryByTestId("manage-connections-dialog");
    expect(id).toBeDefined();
  });
});
