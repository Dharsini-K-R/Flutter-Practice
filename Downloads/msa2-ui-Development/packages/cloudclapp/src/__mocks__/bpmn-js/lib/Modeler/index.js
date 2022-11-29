class Modeler {
  constructor() {
    return this;
  }

  destroy() {}

  importXML() {}

  saveXML(_, callback) {
    callback();
  }

  on() {}

  get(property) {
    switch (property) {
      case "elementRegistry":
        return {
          get: jest.fn(() => "Mock elementRegistry.get result"),
          filter: jest.fn(() => ["Mock BPM element 1", "Mock BPM element 2"]),
        };
      case "elementFactory":
        return {
          createShape: jest.fn(),
        };
      case "moddle":
        return {
          create: jest.fn(() => "Mock moddle.create result"),
        };
      case "replace":
        return {
          replaceElement: jest.fn(),
        };
      case "autoPlace":
        return {
          append: jest.fn(),
        };
      case "selection":
        return {
          select: jest.fn(),
        };
      case "modeling":
        return {
          updateProperties: jest.fn(),
          createShape: jest.fn(),
        };
      case "overlays":
        return {
          clear: jest.fn(),
          add: jest.fn(),
        };
      default:
        return `Mock get ${property} response`;
    }
  }
}

module.exports = Modeler;
