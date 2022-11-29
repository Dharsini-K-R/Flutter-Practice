import {
  getCloudVendors,
  cloudConnectionSummary,
  getCloudConnection,
  createCloudConnection,
  updateCloudConnection,
  deleteCloudConnection,
} from "./cloud";

describe("environment module", () => {
  describe("getCloudVendors", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getCloudVendors({
        token: "token",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/cloud/vendors",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });
});

describe("cloudConnectionSummary module", () => {
  it("should make a request to the correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await cloudConnectionSummary({
      token: "token",
      orgId: "test_org",
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/ccla/cloud/connections/test_org",
    );
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
  });
});

describe("createCloudConnection module", () => {
  it("should make a request to the correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await createCloudConnection({
      token: "token",
      orgId: "123",
      vendor: "aws",
      connectionName: "aws-connection",
      credentials: { "test-cred1": 123, "test-cred2": 456 },
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/ccla/cloud/connections/123/aws",
    );
    expect(fetch.mock.calls[0][1].method).toEqual("POST");
  });
});

describe("getCloudConnection module", () => {
  it("should make a request to the correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await getCloudConnection({
      token: "token",
      operatorPrefix: "hto",
      vendor: "aws",
      connectionName: "aws-connection",
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/ccla/cloud/connections/hto/aws/aws-connection",
    );
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
  });
});

describe("updateCloudConnection module", () => {
  it("should make a request to the correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await updateCloudConnection({
      token: "token",
      orgId: "123",
      vendor: "aws",
      connectionName: "aws-connection",
      credentials: { "test-cred1": 123, "test-cred2": 456 },
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/ccla/cloud/connections/123/aws/aws-connection",
    );
    expect(fetch.mock.calls[0][1].method).toEqual("PUT");
  });
});

describe("deleteCloudConnection module", () => {
  it("should make a request to the correct endpoint", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await deleteCloudConnection({
      token: "token",
      orgId: "123",
      vendor: "aws",
      connectionName: "aws-connection",
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      "/ubi-api-rest/ccla/cloud/connections/123/aws/aws-connection",
    );
    expect(fetch.mock.calls[0][1].method).toEqual("DELETE");
  });
});
