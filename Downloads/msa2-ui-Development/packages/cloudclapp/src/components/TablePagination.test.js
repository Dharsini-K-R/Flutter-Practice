import React from "react";
import { render, screen, fireEvent } from "msa2-ui/src/utils/test-utils";

import TablePagination from "cloudclapp/src/components/TablePagination";

describe("TableMessage component", () => {
  it("renders the expected rows per page and pagination info", () => {
    const onChangePageMock = jest.fn();
    const onChangeRowsMock = jest.fn();
    render(
      <TablePagination
        rowsPerPage={10}
        count={100}
        page={1}
        onChangePage={onChangePageMock}
        onChangeRowsPerPage={onChangeRowsMock}
      />,
    );

    screen.getByText("Show:");
    screen.getByText("10");
    screen.getByText("11-20 of 100");
  });

  it("fires the change page callback with the expected values", () => {
    const onChangePageMock = jest.fn();
    const onChangeRowsMock = jest.fn();
    render(
      <TablePagination
        rowsPerPage={10}
        count={100}
        page={5}
        onChangePage={onChangePageMock}
        onChangeRowsPerPage={onChangeRowsMock}
      />,
    );

    fireEvent.click(screen.getByLabelText("Next Page"));
    expect(onChangePageMock).toHaveBeenCalledTimes(1);
    expect(onChangePageMock.mock.calls[0][1]).toBe(6);
    fireEvent.click(screen.getByLabelText("Last Page"));
    expect(onChangePageMock).toHaveBeenCalledTimes(2);
    expect(onChangePageMock.mock.calls[1][1]).toBe(9);
    fireEvent.click(screen.getByLabelText("Previous Page"));
    expect(onChangePageMock).toHaveBeenCalledTimes(3);
    expect(onChangePageMock.mock.calls[2][1]).toBe(4);
    fireEvent.click(screen.getByLabelText("First Page"));
    expect(onChangePageMock).toHaveBeenCalledTimes(4);
    expect(onChangePageMock.mock.calls[3][1]).toBe(0);
  });

  it("fires the change rows callback with the expected values", async () => {
    const onChangePageMock = jest.fn();
    const onChangeRowsMock = jest.fn();
    render(
      <TablePagination
        rowsPerPage={10}
        count={100}
        page={5}
        onChangePage={onChangePageMock}
        onChangeRowsPerPage={onChangeRowsMock}
      />,
    );

    fireEvent.mouseDown(screen.getAllByRole("button")[0]);
    await screen.findAllByText("10");
    screen.getByText("25");
    screen.getByText("50");
    fireEvent.click(screen.getByText("50"));
    expect(onChangeRowsMock).toHaveBeenCalledTimes(1);
    expect(onChangeRowsMock.mock.calls[0][0].target.value).toBe(50);
  });
});
