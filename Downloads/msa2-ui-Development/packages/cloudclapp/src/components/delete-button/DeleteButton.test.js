import React from "react";
import { render, fireEvent, screen } from "msa2-ui/src/utils/test-utils";

import DeleteButton from "./DeleteButton";

describe("DeleteButton", () => {
  it("renders correctly", () => {
    const onClick = jest.fn();
    render(<DeleteButton id="TEST_DELETE_BUTTON" onClick={onClick} />);
    const text = screen.getByText("Delete");
    expect(text).toBeDefined();

    fireEvent.click(text);
    expect(onClick).toHaveBeenCalled();
  });
});
