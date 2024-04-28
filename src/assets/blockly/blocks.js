import * as Blockly from 'blockly';

import { ColorWheelField } from "blockly-field-color-wheel";
import { FieldSlider } from "@blockly/field-slider";

import { PlusMinus } from '@blockly/block-plus-minus';

import { createMinusField } from './field_minus';
import { createPlusField } from './field_plus';
//import { MutatorIcon } from 'blockly/core/icons';

Blockly.Blocks['particle_base'] = {
  init: function () {
    // if (globalState.workspace === undefined) return;
    // const blocks = globalState.workspace.getAllBlocks();

    const validator_max = function (newValue) {

      var value_min = parseFloat(this.getSourceBlock().getFieldValue('MIN_ALPHA'));
      if (newValue < value_min)
        return value_min;
      return newValue;
    };
    const validator_min = function (newValue) {
      var value_max = parseFloat(this.getSourceBlock().getFieldValue('MAX_ALPHA'));
      if (newValue > value_max)
        return value_max;
      return newValue;
    };

    this.appendDummyInput()
      .appendField("Name: ")
      .appendField(new Blockly.FieldTextInput(""), "NAME")
      .appendField(" Colour:")
      .appendField(new ColorWheelField("#7fdab4", 150, {
        layoutDirection: "vertical",
      }),
        "COLOR")
      .appendField(" Alpha: ")
      .appendField(new FieldSlider(1, 0, 1, 0.01, validator_min), "MIN_ALPHA")
      .appendField(new FieldSlider(1, 0, 1, 0.01, validator_max), "MAX_ALPHA");
    this.appendStatementInput("THEN")
    this.setInputsInline(true);
    this.setDeletable(false);
    this.setMovable(true);
    this.setColour(160);

    this.hat = 'cap';
  }

};



Blockly.Blocks['custom_input_color'] = {
  init: function () {
    this.appendDummyInput()

      .appendField(new ColorWheelField("#7fdab4", 150, {
        layoutDirection: "vertical",
      }),
        "COLOR")

    this.setOutput(true, null);
    this.setColour(160);

  }
};



Blockly.Blocks['test_field_slider'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('slider: ')
      .appendField(new FieldSlider(50), 'FIELDNAME');

    this.setColour(160);

  },

};


var directionOptions = [
  ["me", "HERE"],
  ["➡ right", "RIGHT"],
  ["⬅ left", "LEFT"],
  ["⬆ up", "UP"],
  ["⬇ down", "DOWN"],
  ["⬈ NE ", "UPRIGHT"],
  ["⬊ SE", "DOWNRIGHT"],
  ["⬋ SW", "DOWNLEFT"],
  ["⬉ NW", "UPLEFT"],
  ["? Neighbor", "RAND"],
  ["Arrow Keys", "KB"],
];


const controlsIfMutator =
{


  has_else: false,

  //mutationToDom
  saveExtraState: function () {
    return {
      'else': this.has_else,
    };
  },
  //domToMutation
  loadExtraState: function (state) {
    this.has_else = state['else'];
    this.getInput("ELSE").setVisible(this.has_else);
  },


  updateShape_: function () {
    this.getInput("ELSE").setVisible(this.has_else)
  },

  /**
  * Callback for the plus field. Makes the else visible
  */
  plus: function () {
    this.has_else = true;
    this.getInput("ELSE").setVisible(this.has_else)
  },

  /**
   * Callback for the minus field. Triggers "removing" the input at the specific
   */
  minus: function () {
    if (!this.has_else) {
      return;
    }
    this.has_else = false;
    this.getInput("ELSE").setVisible(this.has_else)
  },
};
/**
 * Adds the initial plus button to the if block.
 */
const controlsIfHelper = function () {

  this.inputList[0].insertFieldAt(0, createPlusField(), 'PLUS');
  this.inputList[1].insertFieldAt(0, createMinusField(), 'MINUS');
};

if (Blockly.Extensions.isRegistered('controls_if_mutator')) {
  Blockly.Extensions.unregister('controls_if_mutator');
}
Blockly.Extensions.registerMutator(
  'controls_if_mutator',
  controlsIfMutator,
  controlsIfHelper,
);


//this should be possible to declare via json, but idk what arg parameter is used for the arg to be invisible,
//and blockly documentation certainly doesn't help , visible and isVisible don't work
Blockly.Blocks['if'] = {
  init: function () {
    this.appendValueInput("CONDITION")
      .setCheck("Boolean")
      .appendField("if");
    this.appendStatementInput("THEN")

    this.appendStatementInput("ELSE").appendField("else");
    //in the forum they said this it is not recommended to modify visibility of specific fields (2017)
    this.getInput("ELSE").setVisible(true);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setMutator(new Blockly.icons.MutatorIcon(['controls_if_mutator'], this))
  }
};




export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: "direction",
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: directionOptions,
        defaultOption: 3
      }

    ],
    output: "Vector",
    colour: 230,
  },
  {
    type: "particle",
    message0: "%1",
    args0: [
      //IMPORTANT
      //this will need to fetch other particles names in order to work
      //for the time being i will just use a list of names of particles for testing
      {
        type: "input_dummy",
        name: "DUMMY",
      }

    ],
    extensions: ["particle_list_extension"],
    output: "Particle",
    colour: 230,

  },
  {
    type: "swap",
    message0: "swap %1",
    args0: [
      {
        "type": "input_value",
        "name": "OTHER",
        "check": "Vector"
      },

    ],
    inputsInline: true,
    previousStatement: true,
    nextStatement: true,
    colour: 160,

  },
  {
    type: "particle_in_direction",
    message0: "%1 is %2",
    args0: [
      {
        type: "input_value",
        name: "DIRECTION",
        check: "Vector"
      },
      {
        type: "input_value",
        name: "TYPE_PARTICLE",
        check: "Particle"
      },
    ],
    inputsInline: true,
    colour: 160,
    output: "Boolean"
  },

  {
    type: "randomTransformation",
    message0: "in a random %1 %2 %3",
    args0: [

      {
        type: "field_dropdown",
        name: "TRANSFORMATION",
        options: [

          [
            "↻ Rotation",
            "Rotation"
          ],
          [
            "✥ Reflection",
            "Reflection",
          ],
          [
            "⟷ HorizontalReflection",
            "HorizontalReflection",
          ],
          [
            "↕ VerticalReflection",
            "VerticalReflection",
          ]
        ]
      },
      {
        type: "input_dummy"
      },
      {
        type: "input_statement",
        name: "THEN",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,

  },



]
);


