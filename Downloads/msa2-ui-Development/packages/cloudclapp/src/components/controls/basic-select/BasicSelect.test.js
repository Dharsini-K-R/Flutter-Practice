import React from "react";
import { render } from "msa2-ui/src/utils/test-utils";
import BasicSelect from "./BasicSelect";
import { MenuItem } from "@material-ui/core";

describe("CustomPeriodPicker component", () => {
  it("should render ok", async () => {
    const { findByText } = render(
      <BasicSelect
        id={"TEST_ID"}
        variant={"outlined"}
        value={"test"}
        label={"Select"}
        required
        onChange={jest.fn()}
        fullWidth
      >
        <MenuItem value={"test"}>{"Test Display Name"}</MenuItem>
      </BasicSelect>,
    );
    await findByText("Test Display Name");
  });
});
