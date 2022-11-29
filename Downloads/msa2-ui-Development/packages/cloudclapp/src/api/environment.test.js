import {
  createEnvironment,
  createEnvironmentFromBlueprint,
  getEnvironment,
  listEnvironment,
  readEnvironmentSummary,
  getUsersBySubtenant,
} from "./environment";

describe("environment module", () => {
  describe("createEnvironment", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await createEnvironment({
        token: "token",
        body: { orgName: "test_company" },
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/environment/create",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
    });
  });

  describe("createEnvironmentFromBlueprint", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await createEnvironmentFromBlueprint({
        token: "token",
        body: { orgName: "test_company" },
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/environment/create",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
    });
  });

  describe("getEnvironment", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getEnvironment({
        token: "token",
        envId: 123,
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/environment/123",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });

  describe("listEnvironment", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await listEnvironment({
        token: "token",
        orgId: "test_org",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/environment/list/test_org",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });

  describe("readEnvironmentSummary", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await readEnvironmentSummary({
        token: "token",
        orgId: "test_org",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/environment/summary/test_org",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });
});

describe("getUsersBySubtenant", () => {
  it("should make a request to the correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await getUsersBySubtenant({
      token: "token",
      subtenantId: 123,
    });

    expect(fetch.mock.calls[0][0]).toEqual("/ubi-api-rest/lookup/v1/users/123");
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
  });
});
