import CustomRenderer from "./CustomRenderer";

jest.mock("bpmn-js");
jest.mock("diagram-js");
jest.mock("min-dom", () => ({
  query: () => null,
}));
jest.mock("tiny-svg", () => ({
  ...jest.requireActual("tiny-svg"),
  append: jest.fn(),
  attr: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
}));

describe("CustomRenderer module", () => {
  const drawShape = () => {
    jest.fn();
    return { parentNode: "" };
  };
  const _svg = jest.fn();
  const insertBefore = jest.fn();
  const appendChild = jest.fn();
  it("should export a class with each methods", () => {
    const customRenderer = new CustomRenderer(
      {
        on: (action, func) => {
          func({ error: false });
        },
      },
      { drawShape },
      { _svg },
    );
    const canRender = customRenderer.canRender({});
    expect(canRender).toBeFalsy();
    customRenderer.drawShape({ insertBefore, appendChild }, "element");

    expect(typeof CustomRenderer.prototype.canRender).toBe("function");
  });

  it("should create an instance when evenBus has an error", () => {
    const customRenderer = new CustomRenderer(
      {
        on: (action, func) => {
          func({ error: true });
        },
      },
      { drawShape },
      { _svg },
    );
    expect(customRenderer).toBeDefined();
  });
});
