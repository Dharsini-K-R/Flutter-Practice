import React from "react";
import { renderWithProvider, wait } from "cloudclapp/src/utils/test-utils";
import EnvironmentCloudVendor from "./EnvironmentCloudVendor";
import initialState from "cloudclapp/src/store/initialState";
import { cloudVendors } from "cloudclapp/src/routes/dashboard/mock";
import { environment } from "../mocks";

const mockState = {
  ...initialState,
  designations: { ...initialState.designations, cloudVendors },
};

describe("EnvironmentCloudVendor component", () => {
  beforeEach(() => {
    URL.createObjectURL = jest.fn();
  });
  it("renders correctly", async () => {
    const { container, getByText } = renderWithProvider({
      childComponent: <EnvironmentCloudVendor environment={environment} />,
      mockState,
    });
    await wait();
    expect(container.firstChild).toMatchSnapshot();
    expect(getByText("temp-host")).toBeTruthy();
    expect(getByText("127.0.0.1")).toBeTruthy();
  });
});
