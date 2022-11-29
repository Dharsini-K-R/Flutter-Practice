import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import DockerImages from "./DockerImages";
import { dockerImage } from "./mocks";

describe("Docker Image component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<DockerImages input={dockerImage} />);

    expect(getByText("Downloads")).toBeTruthy();
    expect(getByText("Stars")).toBeTruthy();
  });
});
