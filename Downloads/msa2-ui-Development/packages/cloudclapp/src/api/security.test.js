import { postImageScanRequest, getScanResult } from "./security";

describe("security module", () => {
  describe("postImageScan Request", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await postImageScanRequest({
        token: "token",
        body: { containerName: "test_container", token: "test_token" },
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/app/image/scan?isPrivateRegistry=false",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
    });
  });

  describe("getScanResult Request", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getScanResult({
        token: "token",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/app/image/scan/status",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });
});
