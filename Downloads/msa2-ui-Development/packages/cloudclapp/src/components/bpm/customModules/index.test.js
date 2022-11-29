import CustomModules from "./";

jest.mock("./Palette");
jest.mock("./ContextPad");
jest.mock("./CustomRenderer");

describe("Custom Modules for BPM Modeler", () => {
  it("should export a default object containing the custom modules", () => {
    expect(CustomModules).toMatchInlineSnapshot(`
      Object {
        "__init__": Array [
          "customRenderer",
          "customRules",
          "bendpoints",
        ],
        "bendpoints": Array [
          "type",
          [Function],
        ],
        "contextPadProvider": Array [
          "type",
          "Mocked ContextPad",
        ],
        "customRenderer": Array [
          "type",
          "Mocked CustomRenderer",
        ],
        "customRules": Array [
          "type",
          [Function],
        ],
        "paletteProvider": Array [
          "type",
          "Mocked Palette",
        ],
      }
    `);
  });
});
