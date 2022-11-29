import { getSystemVersion } from "./settings";

describe("environment module", () => {
  describe("getSystemVersion", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({ version: "1.0.0", build: "1" }));
      await getSystemVersion();

      expect(fetch.mock.calls[0][0]).toEqual("/ccla_version/");
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });
});
