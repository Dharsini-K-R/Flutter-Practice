import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import { fireEvent } from "msa2-ui/src/utils/test-utils";

import LogsSearchAndFilter from "./LogsSearchAndFilter";

const onSearchChangeCallBack = jest.fn();
const onFilterChangeCallBack = jest.fn();
const onChangePage = jest.fn();
const onChangeRowsPerPage = jest.fn();

const props = {
  severity: 1,
  totalLogsCount: 10,
  rowsPerPage: 10,
  currentPage: 0,
  onFilterChangeCallBack: onFilterChangeCallBack,
  onSearchChangeCallBack: onSearchChangeCallBack,
  onChangePage: onChangePage,
  onChangeRowsPerPage: onChangeRowsPerPage,
};

describe("Logs Search and Filter component", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <LogsSearchAndFilter {...props} />,
    );
    expect(getByPlaceholderText("Search...")).toBeTruthy();
    expect(getByText("Filter By")).toBeTruthy();
  });

  it("calls appropriate callback functions when search term is changed", () => {
    const { getByPlaceholderText } = render(<LogsSearchAndFilter {...props} />);
    const searchBar = getByPlaceholderText("Search...");
    fireEvent.change(searchBar, { target: { value: "node" } });
    expect(onSearchChangeCallBack).toHaveBeenCalledTimes(1);
  });
});
