import CustomRules from "./CustomRules";

describe("CustomRules module", () => {
  const eventBus = { on: jest.fn() };
  it("should export a class with each methods", () => {
    const customRules = new CustomRules(eventBus);
    customRules.init();
    expect(customRules.mock).toHaveBeenCalled();
  });
});
