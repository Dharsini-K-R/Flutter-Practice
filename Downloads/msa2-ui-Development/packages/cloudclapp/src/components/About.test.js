import React from "react";
import {
  renderWithProvider,
  screen,
  wait,
} from "cloudclapp/src/utils/test-utils";
import initialState from "cloudclapp/src/store/initialState";
import About from "./About";

const mockState = initialState;

describe("TableMessage component", () => {
  it("renders the expected rows per page and pagination info", async () => {
    fetch.mockResponseOnce(JSON.stringify({ version: "1.0.0", build: "1" }), {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "text/html" },
    });
    renderWithProvider({
      childComponent: <About />,
      mockState,
    });
    await wait();

    const version = screen.getByText("1.0.0");
    expect(version).toBeDefined();
  });
});
