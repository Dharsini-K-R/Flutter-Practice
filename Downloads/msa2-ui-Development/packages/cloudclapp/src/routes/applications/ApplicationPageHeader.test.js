import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import ApplicationPageHeader from "./ApplicationPageHeader";

describe("Application Page Header component", () => {
  it("renders correctly", () => {
    const { container, getByText, getByTestId } = render(
      <ApplicationPageHeader />,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(getByTestId("applications-container").toBeTruthy);
    expect(getByText("Application Images")).toBeTruthy();
  });
});
