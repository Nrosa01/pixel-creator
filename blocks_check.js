import * as Blockly from 'blockly';

import { ColorWheelField } from "blockly-field-color-wheel";
import { FieldSlider } from "@blockly/field-slider";

import { PlusMinus } from '@blockly/block-plus-minus';

import { createMinusField } from './field_minus';
import { createPlusField } from './field_plus';
//import { MutatorIcon } from 'blockly/core/icons';

const minusImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K";
const plusImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==";

Blockly.Blocks['particle_base'] = {
    init: function () {

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



Blockly.Blocks['input_color'] = {
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
    // ["Arrow Keys", "KB"],
];


var transformationOptions = [
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



const particleGroupMutator = {

    saveExtraState: function () {
        return {
            'itemCount': this.itemCount
        }
    },

    loadExtraState: function (state) {
        this.itemCount = state['itemCount'];
        this.updateShape_();
    },
    updateShape_: function () {
        const block = this;

        block.removeInput("PLUS", true);
        block.removeInput("MINUS", true);


        let itemId = 1;
        while (block.getInput(`ITEM${itemId}`) !== null) {
            if (itemId >= this.itemCount) {
                block.removeInput(`ITEM_OR${itemId}`);
                block.removeInput(`ITEM${itemId}`);
            }
            itemId++;
        }

        for (let i = 1; i < block.itemCount; i++) {
            if (block.getInput(`ITEM${i}`) !== null) continue;

            block.appendDummyInput(`ITEM_OR${i}`).appendField("or");
            block.appendValueInput(`ITEM${i}`);

            const shadow = Blockly.getMainWorkspace().newBlock("particle");
            const input = block.getInput(`ITEM${i}`);
            shadow.setShadow(true);
            shadow.initSvg();
            shadow.render();

            input.connection.connect(shadow.outputConnection);
        }

        if (block.itemCount > 1) {
            const minusField = new Blockly.FieldImage(
                minusImage,
                15,
                15,
                { alt: "*", flipRtl: "FALSE" },
                function (e) {
                    block.itemCount--;
                    block.updateShape_();
                }
            );

            block.appendDummyInput("MINUS").appendField(minusField);
        }

        const plusField = new Blockly.FieldImage(
            plusImage,
            15,
            15,
            { alt: "*", flipRtl: "FALSE" },
            function (e) {
                block.itemCount++;
                block.updateShape_();
            }
        );
        block.appendDummyInput("PLUS").appendField(plusField);

    },
}


if (Blockly.Extensions.isRegistered('particle_group_mutator')) {
    Blockly.Extensions.unregister('particle_group_mutator');
}
Blockly.Extensions.registerMutator(
    'particle_group_mutator',
    particleGroupMutator,
    function () {
        this.itemCount = 1;
    }
);


const IfMutator =
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
const IfHelper = function () {

    this.inputList[0].insertFieldAt(0, createPlusField(), 'PLUS');
    this.inputList[1].insertFieldAt(0, createMinusField(), 'MINUS');
};

if (Blockly.Extensions.isRegistered('if_mutator')) {
    Blockly.Extensions.unregister('if_mutator');
}
Blockly.Extensions.registerMutator(
    'if_mutator',
    IfMutator,
    IfHelper,
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
        this.setMutator(new Blockly.icons.MutatorIcon(['if_mutator'], this))
    }
};




export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([

    {
        type: "custom_field_slider",
        message0: "%1",
        args0: [
            {
                type: 'field_slider',
                name: 'NUMBER',
                value: 0,
            }
        ],
        output: "Number",
        colour: 160
    },
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
        type: "group_particle",
        message0: "%1",
        args0: [
            {
                type: "input_value",
                name: "ITEM0",
                check: "Particle",
            }
        ],
        inputsInline: true,
        output: "Group",
        colour: 160,
        mutator: "particle_group_mutator",
    },

    {
        type: "swap",
        message0: "swap %1",
        args0: [
            {
                type: "input_value",
                name: "OTHER",
                check: "Vector"
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
                check: ["Particle", "Group"]
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
                options: transformationOptions,
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

    {
        type: "copy_myself",
        message0: "copy myself %1",
        args0: [
            {
                type: "input_value",
                name: "OTHER",
                check: "Vector"
            },

        ],
        inputsInline: true,
        previousStatement: true,
        nextStatement: true,
        colour: 160,

    },

    {
        type: "change_into",
        message0: "change %1 into %2",
        args0: [
            {
                type: "input_value",
                name: "OTHER",
                check: "Vector"
            },
            {
                type: "input_value",
                name: "TYPE_PARTICLE",
                check: "Particle",
            }

        ],
        inputsInline: true,
        previousStatement: true,
        nextStatement: true,
        colour: 160,

    },
    {
        type: "touching",
        message0: "touching %1",
        args0: [
            {
                type: "input_value",
                name: "TYPE_PARTICLE",
                check: ["Particle", "Group"]
            },
        ],
        inputsInline: true,
        colour: 160,
        output: "Boolean"
    },
    {
        type: "number_of",
        message0: "number of %1 touching",
        args0: [
            {
                type: "input_value",
                name: "TYPE_PARTICLE",
                check: ["Particle", "Group"]
            },
        ],
        inputsInline: true,
        colour: 160,
        output: "Number"
    },
    {
        type: "number_of",
        message0: "number of %1 touching",
        args0: [
            {
                type: "input_value",
                name: "TYPE_PARTICLE",
                check: ["Particle", "Group"]
            },
        ],
        inputsInline: true,
        colour: 160,
        output: "Number"
    },
    {
        type: "type_of",
        message0: "type of %1",
        args0: [
            {
                type: "input_value",
                name: "OTHER",
                check: "Vector"
            },
        ],
        inputsInline: true,
        colour: 160,
        output: "Particle"
    },
    {
        type: "one_in_chance",
        message0: "one in %1 chance",
        args0: [
            {
                type: 'input_value',
                name: 'CHANCE',
                check: "Number"
            },
        ],
        inputsInline: true,
        colour: 200,
        output: "Boolean",

    },
    {
        type: "comparison",
        message0: "%1 %2 %3",
        args0: [
            {
                type: 'input_value',
                name: 'LEFT',
                check: "Number"
            },
            {
                type: "field_dropdown",
                name: "DROPDOWN",
                options: [
                    [
                        "is", "IS"
                    ],
                    [
                        "is bigger than", "IS_BIGGER_THAN"
                    ],
                    [
                        "is smaller than", "IS_SMALLER_THAN"
                    ]
                ]
            },
            {
                type: 'field_slider',
                name: 'RIGHT',
                min: 1,
                max: 100,
                precision: 1,
                init: 1,
            },
        ],
        inputsInline: true,
        colour: 200,
        output: "Boolean",
    },
    {
        type: "bool_comparison",
        message0: "%1 %2 %3",
        args0: [
            {
                type: 'input_value',
                name: 'LEFT',
                check: "Boolean"
            },
            {
                type: "field_dropdown",
                name: "DROPDOWN",
                options: [
                    [
                        "and", "AND"
                    ],
                    [
                        "or", "OR"
                    ],
                ]
            },
            {
                type: 'input_value',
                name: 'RIGHT',
                check: "Boolean"
            }
        ],
        inputsInline: true,
        colour: 200,
        output: "Boolean",
    },
    {
        type: "boolean",
        message0: "%1",
        args0: [
            {
                type: "field_dropdown",
                name: "BOOLEAN",
                options: [
                    [
                        "true", "TRUE"
                    ],
                    [
                        "false", "FALSE"
                    ]
                ]
            },
        ],
        inputsInline: true,
        colour: 200,
        output: "Boolean",
    },
    {
        type: "for_each_transformation",
        message0: "for each %1 %2 %3",
        args0: [

            {
                type: "field_dropdown",
                name: "TRANSFORMATION",
                options: transformationOptions,
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
    {
        type: "rotated_by",
        message0: "rotated by %1",
        args0: [
            {
                type: 'input_value',
                name: 'NUMBER',
                check: "Number"
            },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: 230,
    },
    {
        type: "math_operation",
        message0: "%1 %2 %3",
        args0: [
            {
                type: 'input_value',
                name: 'NUMBER',
                check: "Number"
            },
            {
                type: "field_dropdown",
                name: " OPERATOR",
                options: [
                    [
                        "+", "ADD"
                    ],
                    [
                        "-", "SUBTRACT"
                    ],
                    [
                        "*", "MULTIPLY"
                    ],
                    [
                        "/", "DIVIDE"
                    ],
                    [
                        "%", "MODULO"
                    ],
                    [
                        "difference", "DIFFERENCE"
                    ],
                ]
            },
            {
                type: 'input_value',
                name: 'NUMBER',
                check: "Number"
            },
        ],
    }


]
);


