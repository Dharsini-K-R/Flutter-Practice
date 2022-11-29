import React from "react";
import { render, screen } from "cloudclapp/src/utils/test-utils";

import AuditLogTableBody from "./AuditLogTableBody";

describe("Governance > AuditLogTableBody", () => {
  it("should display a message when no audit logs are passed in", () => {
    render(
      <table>
        <AuditLogTableBody />
      </table>,
    );
    expect(screen.getByText(/No audit logs found/i)).toBeTruthy();
  });

  it("should display a loading indicator when passed a `loading` prop of `true`", () => {
    render(
      <table>
        <AuditLogTableBody loading />
      </table>,
    );
    expect(screen.getByRole("progressbar")).toBeTruthy();
  });
});
