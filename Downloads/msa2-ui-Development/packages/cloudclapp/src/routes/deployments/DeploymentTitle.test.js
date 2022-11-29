import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import DeploymentTitle from "./DeploymentTitle";
import { environment } from "./mocks";

import initialState from "cloudclapp/src/store/initialState";

const mockState = {
  ...initialState,
};

const id = 126;
const title = "Development";
const status = "OK";

describe("DeploymentTitle component", () => {
  it("renders correctly", () => {
    const { container, getByText } = renderWithProvider({
      childComponent: (
        <DeploymentTitle
          id={id}
          title={title}
          status={status}
          environment={environment}
        />
      ),
      mockState,
    });

    expect(container.firstChild).toMatchSnapshot();

    expect(getByText("Development")).toBeTruthy();
  });
});
