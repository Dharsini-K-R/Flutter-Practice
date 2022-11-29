// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import i18n from "cloudclapp/src/localisation/i18n";

/**
 * Mock fetch so we can test API calls
 */
global.fetch = require("jest-fetch-mock");

/**
 * Things we want to happen before each test
 */
global.beforeEach(() => {
  fetch.resetMocks();
  /**
   * Mock all fetches with a placeholder response so no API calls
   * are made during tests
   */
  fetch.mockResponse("{}");
  jest.resetAllMocks();
  jest.spyOn(console, "error");
});

global.afterEach(() => {
  if (console.error.mock.calls[0]) {
    const message = console.error.mock.calls[0].toString();
    expect(message).not.toContain("Invalid prop");
  }
  window.history.pushState({}, "", "/");
});
i18n.changeLanguage("en");