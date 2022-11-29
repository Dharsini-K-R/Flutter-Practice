import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import { applications } from "cloudclapp/src/routes/deployments/mocks";
import ApplicationDetailsCard from "./ApplicationDetailsCard";

describe("ApplicationDetailsCard Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <ApplicationDetailsCard input={applications} />,
    );
    expect(getByText("NATS0")).toBeTruthy();
  });
});
