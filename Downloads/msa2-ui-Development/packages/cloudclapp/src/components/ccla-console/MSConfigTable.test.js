import React from "react";
import { renderWithProvider, wait } from "msa2-ui/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";

import { microserviceDetail } from "msa2-ui/src/mocks/microservices";
import MSConfigTable from "./MSConfigTable";

const deviceId = 9761;

const mockState = {
  ...initialState,
};

describe("MSConfigTable", () => {
  it("should display an error message when no instance data is found for the microservice", async () => {
    fetch.mockResponses(
      [JSON.stringify(microserviceDetail)],
      [JSON.stringify({})],
    );
    const { getByText } = renderWithProvider({
      childComponent: (
        <MSConfigTable
          microserviceUri={
            "CommandDefinition/hto/LINUX/Generic/invalid_microservice.xml"
          }
          deviceId={deviceId}
        />
      ),
      mockState,
    });
    await wait();
    expect(getByText(/no instance data/i)).toBeTruthy();
  });
});
