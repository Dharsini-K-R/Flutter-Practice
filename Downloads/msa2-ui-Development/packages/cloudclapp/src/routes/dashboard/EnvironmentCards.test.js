import React from "react";
import { renderWithProvider } from "msa2-ui/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";

import EnvironmentCards from "./EnvironmentCards";

const mockState = { ...initialState };

const data = {
  status: "Critical",
  version: "V1.1.1",
  user: "Bib Dev",
  env: "Development",
  envData:
    "Development Environment for all new projects and major updates. Nginx and PHP added to the Environment",
  deplymentCount: "2",
  cost: "58.2",
};

it("Renders correcctly", () => {
  const { queryByTestId } = renderWithProvider({
    childComponent: <EnvironmentCards input={data} />,
    mockState,
  });

  expect(queryByTestId("environment-cards")).toBeTruthy();
});
