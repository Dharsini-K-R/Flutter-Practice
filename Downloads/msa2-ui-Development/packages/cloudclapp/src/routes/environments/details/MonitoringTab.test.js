import React from "react";
import {
  renderWithProvider,
  wait,
  screen,
} from "cloudclapp/src/utils/test-utils";
import MonitoringTab from "./MonitoringTab";
import { environment } from "./mocks";
import { cloudVendors } from "cloudclapp/src/routes/dashboard/mock";
import initialState from "cloudclapp/src/store/initialState";

const mockState = {
  ...initialState,
  designations: { ...initialState.designations, cloudVendors },
};

describe("MonitoringTab Component", () => {
  it("renders correctly", async () => {
    fetch.mockResponses([JSON.stringify({}), { status: 200 }]);

    renderWithProvider({
      childComponent: <MonitoringTab environment={environment} />,
      mockState,
    });

    await wait();

    expect(screen.getByText(/There are no/)).toBeTruthy();
  });
});
