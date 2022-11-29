import { auditLogs } from "msa2-ui/src/mocks/auditLogs";
import { renderWithProvider, wait } from "cloudclapp/src/utils/test-utils";
import { screen } from "@testing-library/dom";
import React from "react";
import AuditLogs from "cloudclapp/src/routes/governance/AuditLogs";
import { loginSuccess } from "cloudclapp/src/store/mock";
import { selectTenantAndSubtenant } from "msa2-ui/src/mocks/designation";
import initialState from "cloudclapp/src/store/initialState";

const mockState = {
  auth: loginSuccess,
  designations: selectTenantAndSubtenant,
  settings: initialState.settings,
};

describe("Governance > Audit Logs", () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResponse(JSON.stringify(auditLogs));
    window.history.pushState({}, "", "/governance/audit-logs");
  });

  it("should fetch audit logs from the API and render them in a table", async () => {
    renderWithProvider({
      childComponent: <AuditLogs />,
      mockState,
      initialRoute: "/governance/audit-logs",
    });

    await wait();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/elastic-search/audit-log",
    );

    screen.getByText("Timestamp");
    screen.getByText("User ID");
    screen.getByText("User Name");
    screen.getByText("User Role");
    screen.getByText("Summary");
  });
});
