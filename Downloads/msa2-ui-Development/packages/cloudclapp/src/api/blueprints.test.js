import { getBluePrints, createBluePrint, updateBluePrint } from "./blueprints";

describe("blueprints module", () => {
  describe("getBluePrints", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await getBluePrints({
        token: "token",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/repository/ccla/blueprints",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });

  describe("createBluePrint", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await createBluePrint({
        token: "token",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/repository/ccla/blueprint",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
    });
  });

  describe("updateBluePrint", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await updateBluePrint({
        token: "token",
      });

      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/repository/ccla/blueprint",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("PUT");
    });
  });
});
