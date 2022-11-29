import React from "react";
import { renderWithProvider, wait } from "cloudclapp/src/utils/test-utils";
import MonitoringGraph from "./MonitoringGraph";
import { monitoringGraph } from "./mocks";
import initialState from "cloudclapp/src/store/initialState";
import { organisation } from "cloudclapp/src/routes/dashboard/mock";

const mockState = {
  ...initialState,
  designations: { organisation: organisation[0] },
};

describe("MonitoringGraph Component", () => {
  it("renders correctly", async () => {
    const { getByText } = renderWithProvider({
      childComponent: <MonitoringGraph envEntityId={323} />,
      mockState,
    });
    await wait();
    expect(getByText("Monitoring")).toBeTruthy();
    expect(getByText("Period")).toBeTruthy();
  });

  it("displays Graph with Monitoring details", async () => {
    fetch.mockResponses([JSON.stringify(monitoringGraph), { status: 200 }]);

    renderWithProvider({
      childComponent: <MonitoringGraph envEntityId={323} />,
      mockState,
    });

    await wait();

    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/device/id/00p323/monitor?period=day",
    );
  });
});
