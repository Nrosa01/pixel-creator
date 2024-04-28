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
  'kind': 'flyoutToolbox',
  'scrollbars': 'NEVER',
  "contents": [
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
      'type': 'randomTransformation'
    },

    {
      'kind': 'block',
      'type': 'swap',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'cell',
            "fields": {
              "DIRECTION": "DOWN"
            }
          },
        },
      },
    },
    {
      'kind': 'block',
      'type': 'cell',
      "fields": {
        "DIRECTION": "DOWN"
      }
    },
    {
      'kind': 'block',
      'type': 'particle'
    },
    {
      'kind': 'block',
      'type': 'particle_in_direction',
      'inputs': {
        'DIRECTION': {
          'shadow': {
            'type': 'cell',
            "fields": {
              "DIRECTION": "DOWN"
            }
          },
        },
        'TYPE_PARTICLE': {
          'shadow': {
            'type': 'particle',
          },
        }
      },
    },
    {
      'kind': 'block',
      'type': 'controls_if'
    },
    {
      'kind': 'block',
      'type': 'if'
    }

  ]


}