import React from "react";
import { renderWithProvider } from "msa2-ui/src/utils/test-utils";
import Cost from "./Cost";

import initialState from "cloudclapp/src/store/initialState";

const mockState = {
  ...initialState,
};

it("Renders correcctly", () => {
  const { queryByTestId } = renderWithProvider({
    childComponent: <Cost />,
    mockState,
  });

  expect(queryByTestId("insights-cost")).toBeTruthy();
});
