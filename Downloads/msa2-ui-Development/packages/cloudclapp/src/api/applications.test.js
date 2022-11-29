import {
  getMarketPlaceImagesByKey,
  getMarketPlaceImagesDetails,
  getOrganizationList,
  getImagesFromPrivateDockerHub,
} from "./applications";

describe("applications module", () => {
  describe("getMarketPlaceImagesByKey", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getMarketPlaceImagesByKey({
        token: "token",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/marketplace/images",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });

  describe("getMarketPlaceImagesDetails module", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getMarketPlaceImagesDetails({
        token: "token",
        name: "ububtu",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/marketplace/image?name=ububtu",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });

  describe("getOrganizationList module", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getOrganizationList({
        token: "token",
        username: "username",
        password: "password",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/marketplace/private/orgList",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
    });
  });

  describe("getImagesFromPrivateDockerHub module", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getImagesFromPrivateDockerHub({
        token: "token",
        username: "username",
        password: "password",
        orgName: "testOrg",
        name: "testName",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/marketplace/private/images?orgName=testOrg&name=testName",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
    });
  });

});

