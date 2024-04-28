import * as Blockly from 'blockly/core';

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    constructor() {
        // Set up all of the constants from the base provider.
        super();

    }
}

class CustomRenderer extends Blockly.zelos.Renderer {
    constructor() {
        super();
    }
    /**
   * @override
   */
    makeConstants_() {
        return new CustomConstantProvider();
    }
}
Blockly.blockRendering.register('custom_renderer', CustomRenderer);