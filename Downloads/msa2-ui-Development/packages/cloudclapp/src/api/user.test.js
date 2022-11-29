import { signUp, activate, inviteUser } from "./user";

describe("user module", () => {
  describe("signUp", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await signUp({
        token: "token",
        login: "test_user",
        password: "test_password",
        organization: "Test Org",
        action: "validate_captcha",
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/user/register",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
      const body = JSON.parse(fetch.mock.calls[0][1].body);
      expect(body).toEqual({
        action: "validate_captcha",
        captchaResponse: "token",
        login: "test_user",
        organization: "Test Org",
        password: "test_password",
      });
    });
  });

  describe("activate", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await activate({
        key: "testkeyqwerty12345",
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(
        "/ubi-api-rest/ccla/user/activate/testkeyqwerty12345",
      );
      expect(fetch.mock.calls[0][1].method).toEqual("GET");
    });
  });
});

describe("invite user email api", () => {
  describe("inviteUser", () => {
    it("should make a request to the correct endpoint", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await inviteUser({
        email: "test_user@testorg.com",
        orgId: 33,
      });

      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual("/ubi-api-rest/ccla/user/invite");
      expect(fetch.mock.calls[0][1].method).toEqual("POST");
      const body = JSON.parse(fetch.mock.calls[0][1].body);
      expect(body).toEqual({
        email: "test_user@testorg.com",
        orgId: 33,
      });
    });
  });
});
