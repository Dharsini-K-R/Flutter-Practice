import React from "react";
import { render, screen } from "cloudclapp/src/utils/test-utils";

import AddItemsButton from "./AddItemsButton";
const onClickCallBack = jest.fn();
describe("AddItemsButton", () => {
  it("renders correctly", () => {
    render(
      <AddItemsButton
        id="ENVIRONMENTS_ADD_DEPLOYMENT_BUTTON"
        onClickCallBack={onClickCallBack}
        buttonLabel="Add Deployment"
      />,
    );
    const text = screen.getByText("Add Deployment");
    expect(text).toBeDefined();
  });
});
