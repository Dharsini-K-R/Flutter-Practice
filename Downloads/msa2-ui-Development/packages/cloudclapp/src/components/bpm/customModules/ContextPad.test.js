import ContextPad from "./ContextPad";

jest.mock("bpmn-js");
jest.mock("diagram-js");

describe("ContextPad custom module", () => {
  it("should export a class with a getContextPadEntries method", () => {
    expect(typeof ContextPad.prototype.getContextPadEntries).toBe("function");
  });
});
