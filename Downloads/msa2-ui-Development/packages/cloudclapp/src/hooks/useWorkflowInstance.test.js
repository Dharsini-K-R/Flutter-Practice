import React from "react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import routeData from "react-router";
import { renderHook, actOnHook, wait } from "msa2-ui/src/utils/test-utils";

import { workflow } from "msa2-ui/src/mocks/automation/workflowDetails";
import initialState from "cloudclapp/src/store/initialState";

import useWorkflowInstance from "./useWorkflowInstance";

const mockState = initialState;

const createWrapper = (mockState) => {
  const mockStore = configureMockStore()(mockState);
  return ({ children }) => <Provider store={mockStore}>{children}</Provider>;
};

const renderUseWorkflowInstance = (initialProps) =>
  renderHook((params) => useWorkflowInstance(params), {
    wrapper: createWrapper(mockState),
    initialProps,
  });

const processRoute = "Process/Reference/Sample/Firewall";

describe("useWorkflowInstance hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(routeData, "useParams")
      .mockReturnValue({ workflowUri: processRoute });
  });

  it("returns an object in the expected format", async () => {
    const { result } = renderUseWorkflowInstance({
      workflowPath: "Process/Reference/Sample/Firewall",
      instanceId: 54,
    });

    await actOnHook(async () => {
      await wait();
    });
    expect(Object.keys(result.current)).toEqual([
      "workflow",
      "workflowInstance",
      "workflowStatus",
      "isLoading",
      "loading",
    ]);
  });

  it("should not make any API calls when passed undefined arguments", async () => {
    renderUseWorkflowInstance({
      workflowPath: undefined,
      instanceId: undefined,
    });
    await actOnHook(async () => {
      await wait();
    });
    expect(fetch).toHaveBeenCalledTimes(0);
  });

  it('returns an "isLoading" value of true when API calls are in progress', async () => {
    const { result, waitForNextUpdate } = renderUseWorkflowInstance({
      workflowPath: "Process/Reference/Sample/Firewall",
      instanceId: 54,
    });

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
  });

  it("calls the APIs related to a given workflow", async () => {
    fetch.mockResponseOnce(JSON.stringify(workflow));
    const { rerender } = renderUseWorkflowInstance({
      workflowPath: "Process/Reference/Sample/Firewall",
    });
    await actOnHook(async () => {
      await wait();
    });

    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.calls[0][0]).toBe(
      "/ubi-api-rest/repository/v2/resource/workflow?uri=Process%2FReference%2FSample%2FFirewall.xml",
    );

    rerender({
      workflowPath: "Process/Reference/Sample/Firewall",
      instanceId: 54,
    });
    await actOnHook(async () => {
      await wait();
    });

    expect(fetch.mock.calls.length).toBe(3);
    expect(fetch.mock.calls[1][0]).toBe(
      "/ubi-api-rest/orchestration/v1/services/54/service-variables",
    );
    expect(fetch.mock.calls[2][0]).toBe(
      "/ubi-api-rest/orchestration/v1/service/process-instance/54?page=1&page_size=10",
    );
  });
});
