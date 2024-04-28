import * as Blockly from 'blockly';

import { ColorWheelField } from "blockly-field-color-wheel";
import { FieldSlider } from "@blockly/field-slider";

import {PlusMinus} from '@blockly/block-plus-minus';


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
      .appendField(new FieldSlider(1, 0, 1, 0.1, validator_min), "MIN_ALPHA")
      .appendField(new FieldSlider(1, 0, 1, 0.1, validator_max), "MAX_ALPHA");
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


//placeholder
var particlesOptions = [
  ["empty", "empty"],
  ["sand", "sand"],
  ["water", "water"],
  ["stone", "stone"],

];

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

// Blockly.Extensions.registerMutator(
//   "if_else_mutator",
//   {
    
//   }

// );



export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: "cell",
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: directionOptions,
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
        type: "field_dropdown",
        name: "PARTICLE",
        options: particlesOptions
      }

    ],
    
    output: "Particle",
    colour: 230,
    
  },
  {
    type: "move",
    message0: "move %1",
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
    type: "is_equal",
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
    type: "if",
    message0: "if %1 %2 %3 %4",
    args0: [

      {
        type: "input_value",
        name: "CONDITION",
        check: "Boolean"
      },
      {
        type: "input_statement",
        name: "THEN",
      },
      {
        type: "input_dummy",
        text: "else"
      },
      {
        type: "input_statement",
        name: "ELSE",
      }
      
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 330,
    
    //mutator: "if_mutator"
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

  //#region tutorial
  {
    type: "object",
    message0: "{ %1 %2 }",
    args0: [
      {
        type: "input_dummy"
      },
      {
        type: "input_statement",
        name: "MEMBERS"
      }
    ],
    output: null,
    colour: 230,
  },
  {
    type: "member",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "field_input",
        name: "MEMBER_NAME",
        text: ""
      },
      {
        type: "field_label",
        name: "COLON",
        text: ":"
      },
      {
        type: "input_value",
        name: "MEMBER_VALUE"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  }
  //#endregion

]
);


