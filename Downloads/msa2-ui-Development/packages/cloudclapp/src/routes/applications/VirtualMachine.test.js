import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import VirtualMachine from "./VirtualMachine";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };

describe("VirtualMachine component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <VirtualMachine setSelectedCloud={jest.fn()} />,
      mockState,
    });
    expect(getByTestId("virtualmachine-component")).toBeTruthy();
  });
});
