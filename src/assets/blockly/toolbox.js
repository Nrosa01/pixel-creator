/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/


export const toolbox = {
  'kind': 'categoryToolbox',
  "contents": [
    {
      "kind": "category",
      "name": "Particle",
      
      "contents": [
        {
          'kind': 'block',
          'type': 'particle_base',
        },
        {
          'kind': 'block',
          'type': 'custom_input_color'
        },
        {
          'kind': 'block',
          'type': 'test_field_slider'
        },
        {
          'kind': 'block',
          'type': 'if'
        },
        {
          'kind': 'block',
          'type': 'randomTransformation'
        },
        {
          'kind': 'block',
          'type': 'update'
        },
        {
          'kind': 'block',
          'type': 'move',
          'inputs': {
            'OTHER': {
              'shadow': {
                'type': 'cell',
              },
            },
          },
        },
        {
          'kind': 'block',
          'type': 'cell'
        },
        {
          'kind': 'block',
          'type': 'particle'
        },
        {
          'kind': 'block',
          'type': 'is_equal',
          'inputs': {
            'DIRECTION': {
              'shadow': {
                'type': 'cell',
              },
            },
            'TYPE_PARTICLE': {
              'shadow': {
                'type': 'particle',
              },
            }
          },
        }
      ]
    },

    //#region tutorial
    {
      "kind": "category",
      "name": "basic",
      "contents": [
        {
          'kind': 'block',
          'type': 'object'
        },
        {
          'kind': 'block',
          'type': 'member'
        },

        {
          'kind': 'block',
          'type': 'math_number'
        },
        {
          'kind': 'block',
          'type': 'text'
        },
        {
          'kind': 'block',
          'type': 'logic_boolean'
        },
        {
          'kind': 'block',
          'type': 'logic_null'
        },
        {
          'kind': 'block',
          'type': 'lists_create_with'
        },
        {
          'kind': 'block',
          'type': 'controls_if'
        }
      ]
    }
    //#endregion
  ]


}