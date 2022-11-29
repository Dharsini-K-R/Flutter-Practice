import { updateManager } from "./manager";

describe("manager module", () => {
  describe("updateManager", () => {
    it("should make a PUT request to the correct API endpoint", () => {
      updateManager({
        token: "1234",
        id: 123,
        manager: {
          originalKey: "Test",
          name: "Overwrite Test",
        },
        name: "Test Name",
        email: "manager@mail.com",
        username: "test_123",
        password: "password",
        firstname: "Test First Name",
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/user/v1/manager/123",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("PUT");
      expect(fetch.mock.calls[0][1].body).toEqual(
        JSON.stringify({
          originalKey: "Test",
          name: "Test Name",
          address: {
            email: "manager@mail.com",
          },
          login: "test_123",
          pwd: "password",
          firstname: "Test First Name",
        }),
      );
    });
  });
});
