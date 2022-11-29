import React from "react";
import { render, fireEvent } from "msa2-ui/src/utils/test-utils";

import SearchBar from "./SearchBar";

const onChangeCallback = jest.fn();
const width = "35%";
const border = "1px solid #B2BCCE";
const placeholderText = "Search..";

describe("SearchBar component", () => {
  it("shows the correct placeholder text when the search icon is clicked", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <SearchBar
        searchString={""}
        onChangeCallback={onChangeCallback}
        width={width}
        border={border}
        placeholderText={placeholderText}
      />,
    );
    fireEvent.click(getByLabelText("Search"));
    expect(getByPlaceholderText("Search..")).toBeTruthy();
  });
});
