import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import { fireEvent } from "msa2-ui/src/utils/test-utils";

import AddApplicationTile from "./AddApplicationTile";

const addApplicationCallBack = jest.fn();

describe("Add Application Tile Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <AddApplicationTile addApplicationCallBack={addApplicationCallBack} />,
    );
    expect(getByText("Add Application Images")).toBeTruthy();
  });

  it("calls appropriate callback functions when add application is clicked", () => {
    const { getByText } = render(
      <AddApplicationTile addApplicationCallBack={addApplicationCallBack} />,
    );
    const addApplication = getByText("Add Application Images");
    fireEvent.click(addApplication);
    expect(addApplicationCallBack).toHaveBeenCalledTimes(1);
  });
});
