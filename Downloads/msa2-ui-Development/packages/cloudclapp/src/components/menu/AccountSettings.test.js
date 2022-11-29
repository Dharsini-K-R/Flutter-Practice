import React from "react";
import { renderWithProvider } from "cloudclapp/src/utils/test-utils";
import AccountSettings from "./AccountSettings";
import initialState from "../../store/initialState";
import { screen } from "msa2-ui/src/utils/test-utils";

const mockState = {
  ...initialState,
};

const initialValues = {
  address: {
    city: "",
    country: "",
    fax: null,
    mail: "test@test.com",
    phone: "",
    streetName1: "",
    streetName2: "",
    streetName3: "",
    zipCode: "",
  },
  baseRole: {
    id: 2,
    name: "Administrator",
  },
  firstname: "name",
  id: 128,
  login: "test@test.com",
  name: "name",
  userType: 2,
};

const mockOnClose = jest.fn();

describe("Account Settings Component", () => {
  it("renders correctly", () => {
    renderWithProvider({
      childComponent: (
        <AccountSettings onClose={mockOnClose} initialValues={initialValues} />
      ),
      mockState,
    });

    const id = screen.queryByTestId("account-settings-dialog");
    expect(id).toBeDefined();
  });
});
