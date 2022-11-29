import React from "react";
import { renderWithProvider, wait } from "msa2-ui/src/utils/test-utils";

import MSConfigConsole from "./MSConfigConsole";

import { getManagedEntitiesByX } from "msa2-ui/src/mocks/managedEntity";
import { getDeploymentSettingExtendedResponse } from "msa2-ui/src/mocks/deploymentSettings";
import initialState from "cloudclapp/src/store/initialState";

const mockState = {
  ...initialState,
};

const mockDeviceID = getManagedEntitiesByX[0].deviceID;
const mockDeploymentSettingID = getDeploymentSettingExtendedResponse.id;

describe("MSConfigConsole", () => {
  beforeEach(() => {
    fetch.mockResponses([JSON.stringify(getDeploymentSettingExtendedResponse)]);
  });

  it("should render as expected", async () => {
    fetch.mockResponses(
      [JSON.stringify(getDeploymentSettingExtendedResponse)],
      [JSON.stringify([])],
    );
    const { getByText } = renderWithProvider({
      childComponent: (
        <MSConfigConsole
          deviceId={mockDeviceID}
          deploymentSettingId={mockDeploymentSettingID}
        />
      ),
      mockState,
    });

    await wait();

    expect(getByText("Network Interface")).toBeDefined();
    expect(getByText("Network Interface")).toBeTruthy();
    expect(getByText("VPN Connections")).toBeTruthy();
  });
});
