import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import VirtualMachineImage from "./VirtualMachineImage";
import { VMImage } from "./mocks";

describe("VM Image component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<VirtualMachineImage input={VMImage[0]} />);
    expect(getByTestId("applications-vmImage-component")).toBeTruthy();
  });
});
