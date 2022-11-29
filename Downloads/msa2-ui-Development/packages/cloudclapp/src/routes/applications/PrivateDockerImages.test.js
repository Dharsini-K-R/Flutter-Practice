import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import PrivateDockerImages from "./PrivateDockerImages";
import { dockerImage } from "./mocks";

describe("Docker Image component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<PrivateDockerImages input={dockerImage} />);

    expect(getByText("Downloads")).toBeTruthy();
    expect(getByText("Stars")).toBeTruthy();
  });
});
