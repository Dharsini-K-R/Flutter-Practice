import React from "react";
import { renderWithProvider } from "msa2-ui/src/utils/test-utils";
import DeploymentDetails from "./DeploymentDetails";
import initialState from "cloudclapp/src/store/initialState";
import { cloudVendors } from "cloudclapp/src/routes/dashboard/mock";
import { environment } from "cloudclapp/src/routes/environments/details/mocks";

const mockState = {
  ...initialState,
  designations: { ...initialState.designations, cloudVendors },
};

const deployment = {
  deploymentId: "126016",
  deploymentName: "My_Big_Shop_Test_4",
  status: "RUNNING",
  deploymentUser: "test-user",
};

const isExpandable = true;

describe("DeploymentDetails component", () => {
  it("renders correctly", () => {
    const { container, getByText } = renderWithProvider({
      childComponent: (
        <DeploymentDetails
          deploymentDetails={deployment}
          isExpandable={isExpandable}
          environment={environment}
        />
      ),
      mockState,
    });

    expect(container.firstChild).toMatchSnapshot();

    expect(getByText("Status:")).toBeTruthy();
  });
});
