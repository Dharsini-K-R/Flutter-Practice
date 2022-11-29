import React from "react";
import { renderWithProvider } from "msa2-ui/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";

import ManageTags from "./ManageTags";

const mockState = { ...initialState };

it("Renders correcctly", () => {
  const { queryByTestId } = renderWithProvider({
    childComponent: <ManageTags />,
    mockState,
  });

  expect(queryByTestId("manage_tags_component")).toBeTruthy();
});
