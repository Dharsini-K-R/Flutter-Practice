import { getVendorCost } from "./cost";

describe("cost module", () => {
  describe("getVendorCost", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getVendorCost({
        token: "token",
        orgId: "test_org",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/cloud/usageAndCost/test_org",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });
});
