import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import ApplicationDetails from "./ApplicationDetails";
import { applications } from "../mocks";
import initialState from "cloudclapp/src/store/initialState";

const mockState = { ...initialState };
jest.mock(
  "cloudclapp/src/routes/applications/ApplicationDetailsCard",
  () => () => <div>Mock ApplicationDetailsCard</div>,
);

describe("ApplicationDetails component", () => {
  it("renders correctly", () => {
    const { getByTestId } = renderWithProvider({
      childComponent: <ApplicationDetails applications={applications} />,
      mockState,
    });

    expect(getByTestId("applications-tab-container")).toBeTruthy();
  });
  it("Calls child component - ApplicationDetailsCard", () => {
    const { getAllByText } = renderWithProvider({
      childComponent: <ApplicationDetails applications={applications} />,
      mockState,
    });
    const mockComponent = getAllByText("Mock ApplicationDetailsCard");
    expect(mockComponent).toBeDefined();
  });
});
