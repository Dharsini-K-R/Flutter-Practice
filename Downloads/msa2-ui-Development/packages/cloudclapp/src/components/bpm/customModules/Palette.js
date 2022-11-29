// Visit https://github.com/bpmn-io/bpmn-js/blob/develop/lib/features/palette/PaletteProvider.js to see the usage and context
// and node_modules/bpmn-js/lib/features/palette/PaletteProvider.js

export default class Palette {
  constructor(
    palette,
    spaceTool,
    lassoTool,
    handTool,
    globalConnect,
    translate,
  ) {
    this.palette = palette;
    this.spaceTool = spaceTool;
    this.lassoTool = lassoTool;
    this.handTool = handTool;
    this.globalConnect = globalConnect;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    const spaceTool = this.spaceTool;
    const lassoTool = this.lassoTool;
    const handTool = this.handTool;
    const globalConnect = this.globalConnect;
    const translate = this.translate;

    return {
      "hand-tool": {
        group: "tools",
        className: "bpmn-icon-hand-tool",
        title: translate("Activate the hand tool"),
        action: {
          click: function(event) {
            handTool.activateHand(event);
          },
        },
      },
      "lasso-tool": {
        group: "tools",
        className: "bpmn-icon-lasso-tool",
        title: translate("Activate the lasso tool"),
        action: {
          click: function(event) {
            lassoTool.activateSelection(event);
          },
        },
      },
      "space-tool": {
        group: "tools",
        className: "bpmn-icon-space-tool",
        title: translate("Activate the create/remove space tool"),
        action: {
          click: function(event) {
            spaceTool.activateSelection(event);
          },
        },
      },
      "global-connect-tool": {
        group: "tools",
        className: "bpmn-icon-connection-multi",
        title: translate("Activate the global connect tool"),
        action: {
          click: function(event) {
            globalConnect.toggle(event);
          },
        },
      },
    };
  }
}

Palette.$inject = [
  "palette",
  "spaceTool",
  "lassoTool",
  "handTool",
  "globalConnect",
  "translate",
];
