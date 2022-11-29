import Palette from "./Palette";

describe("Palette custom module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be able to instantiate a Palette without errors", () => {
    const mockRegisterProvider = jest.fn();
    const mockPalette = {
      registerProvider: mockRegisterProvider,
    };

    const palette = new Palette(
      mockPalette,
      "mockSpaceTool",
      "mockLassoTool",
      "mockHandTool",
      "mockGlobalConnect",
      "mockTranslate",
    );

    expect(mockRegisterProvider).toHaveBeenCalledTimes(1);
    expect(palette).toEqual({
      globalConnect: "mockGlobalConnect",
      handTool: "mockHandTool",
      lassoTool: "mockLassoTool",
      palette: { registerProvider: mockRegisterProvider },
      spaceTool: "mockSpaceTool",
      translate: "mockTranslate",
    });
  });

  it("should export a class with a getPaletteEntries method", () => {
    expect(typeof Palette.prototype.getPaletteEntries).toBe("function");
  });

  it("should output a custom list of palette entries from the getPaletteEntries method", () => {
    const paletteEntries = Palette.prototype.getPaletteEntries.call({
      palette: jest.fn(),
      lassoTool: "mockLassoTool",
      handTool: "mockHandTool",
      globalConnect: jest.fn(),
      translate: jest.fn(),
    });

    const paletteEntryNames = Object.keys(paletteEntries);
    const desiredPaletteEntryNames = [
      "hand-tool",
      "lasso-tool",
      "space-tool",
      "global-connect-tool",
    ];

    expect(paletteEntryNames.sort()).toEqual(desiredPaletteEntryNames.sort());
  });
});
