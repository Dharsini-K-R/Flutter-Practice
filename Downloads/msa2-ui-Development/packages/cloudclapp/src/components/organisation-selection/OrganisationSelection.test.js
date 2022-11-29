import React from "react";
import {
  renderWithProvider,
  fireEvent,
  waitForElement,
} from "cloudclapp/src/utils/test-utils";
import "@testing-library/jest-dom/extend-expect";
import OrganisationSelection from "./OrganisationSelection";
import { tenantList } from "cloudclapp/src/store/mock.js";

const mockState = {
  designations: tenantList,
};

jest.mock("react-select", () => ({ options, value, onChange }) => {
  const handleChange = (event) => {
    const option = options.find(
      (option) => option.label === event.currentTarget.value,
    );
    onChange(option);
  };
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select data-testid="select" value={value} onChange={handleChange}>
        {options.map(({ id, label }) => (
          <option key={id} value={label}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
});

const blankDesignation = {
  value: null,
  id: null,
  label: null,
  ubiqubeId: null,
};

const render = (childComponent) =>
  renderWithProvider({ childComponent, mockState });

describe("OrganisationSelection component", () => {
  it("renders correctly", () => {
    const mockSelectOrganisation = jest.fn();
    const { asFragment } = render(
      <OrganisationSelection
        multiOrg={true}
        tenants={tenantList}
        onSelectOrganisation={mockSelectOrganisation}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("handles tenant selection correctly", async () => {
    const mockSelectOrganisation = jest.fn();
    const { getByLabelText, getByTestId } = render(
      <OrganisationSelection
        multiOrg={true}
        tenants={tenantList}
        onSelectOrganisation={mockSelectOrganisation}
      />,
    );
    const tenantLabel = getByLabelText("organisation");
    fireEvent.click(tenantLabel);
    const select = await waitForElement(() => getByTestId("select"));
    fireEvent.change(select, { target: { value: "Amit" } });
    expect(mockSelectOrganisation.mock.calls.length).toBe(1);
    expect(mockSelectOrganisation.mock.calls[0][1].label).toBe("Amit");
  });

  it("handles displaying selected tenant correctly", () => {
    const mockSelectOrganisation = jest.fn();
    const { getByLabelText } = render(
      <OrganisationSelection
        multiOrg={true}
        tenants={tenantList}
        onSelectOrganisation={mockSelectOrganisation}
      />,
    );
    const tenantLabel = getByLabelText("organisation");
    expect(tenantLabel).toBeDefined();
  });
});
