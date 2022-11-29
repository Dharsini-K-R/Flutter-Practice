import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import QuickDeploymentDialog from "./QuickDeploymentDialog";
import initialState from "../../store/initialState";
import { screen } from "msa2-ui/src/utils/test-utils";
import { cloudConnectionSummary } from "cloudclapp/src/components/quick-deployment-dialog/mock";
import { environments } from "cloudclapp/src/routes/dashboard/mock";

const mockState = {
  ...initialState,
};

const mockOnClose = jest.fn();

jest.mock(
  "cloudclapp/src/components/quick-deployment-steps/CloudConnectionStep",
  () => () => <div>Mock CloudConnectionStep</div>,
);

jest.mock(
  "cloudclapp/src/components/quick-deployment-steps/EnvironmentStep",
  () => () => <div>Mock EnvironmentStep</div>,
);

describe("Quick Deployment Component", () => {
  it("renders correctly", () => {
    renderWithProvider({
      childComponent: (
        <QuickDeploymentDialog
          onClose={mockOnClose}
          connectionSummary={cloudConnectionSummary}
          environments={environments}
        />
      ),
      mockState,
    });

    const id = screen.queryByTestId("quick-deployment-dialog");
    expect(id).toBeDefined();
  });
  it("Calls child component - CloudConnectionStep", () => {
    const { getAllByText } = renderWithProvider({
      childComponent: (
        <QuickDeploymentDialog
          onClose={mockOnClose}
          connectionSummary={cloudConnectionSummary}
          environments={environments}
        />
      ),
      mockState,
    });
    const mockComponent = getAllByText("Mock CloudConnectionStep");
    expect(mockComponent).toBeDefined();
  });
  it("Calls child component - DeploymentStep directly for onboarding scenario with only one environment", () => {
    const { getAllByText } = renderWithProvider({
      childComponent: (
        <QuickDeploymentDialog
          onClose={mockOnClose}
          connectionSummary={cloudConnectionSummary}
          environments={environments}
          environmentSelected={environments[0]}
          currentStep={1}
        />
      ),
      mockState,
    });
    const mockComponent = getAllByText("Mock EnvironmentStep");
    expect(mockComponent).toBeDefined();
  });
});
