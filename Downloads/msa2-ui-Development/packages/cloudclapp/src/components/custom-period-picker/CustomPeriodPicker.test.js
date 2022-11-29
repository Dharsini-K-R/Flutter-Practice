import React from "react";
import { render } from "msa2-ui/src/utils/test-utils";
import CustomPeriodPicker from "./CustomPeriodPicker";

describe("CustomPeriodPicker component", () => {
  it("should render ok", async () => {
    const { findByText } = render(
      <CustomPeriodPicker
        values={[]}
        onSelect={() => null}
        onClose={() => null}
      />,
    );
    await findByText("Select custom period");
  });
});
