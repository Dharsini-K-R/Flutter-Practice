import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import { fireEvent } from "msa2-ui/src/utils/test-utils";

import ApplicationSearchAndFilter from "./ApplicationSearchAndFilter";

const onSearchChangeCallBack = jest.fn();
const onFilterChangeCallBack = jest.fn();
const onChangePage = jest.fn();
const onChangeRowsPerPage = jest.fn();

const props = {
  totalImagesCount: 10,
  rowsPerPage: 10,
  currentPage: 0,
  onFilterChangeCallBack: onFilterChangeCallBack,
  onSearchChangeCallBack: onSearchChangeCallBack,
  onChangePage: onChangePage,
  onChangeRowsPerPage: onChangeRowsPerPage,
};

describe("Application Search and Filter component", () => {
  it("renders correctly", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <ApplicationSearchAndFilter {...props} />,
    );
    expect(getByPlaceholderText("Search ...")).toBeTruthy();
    expect(getByLabelText("Official Images Only")).toBeTruthy();
  });

  it("calls appropriate callback functions when search term and filter checkbox values are changed", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <ApplicationSearchAndFilter
        onFilterChangeCallBack={onFilterChangeCallBack}
        onSearchChangeCallBack={onSearchChangeCallBack}
      />,
    );
    const searchBar = getByPlaceholderText("Search ...");
    fireEvent.change(searchBar, { target: { value: "node" } });
    expect(onSearchChangeCallBack).toHaveBeenCalledTimes(1);

    const checkboxFilter = getByLabelText("Official Images Only");
    fireEvent.click(checkboxFilter);
    expect(onFilterChangeCallBack).toHaveBeenCalledTimes(1);
  });
});
