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
      'type': 'group_particle',
      'inputs': {
        'ITEM0': {
          'shadow': {
            'type': 'particle',
          },
        },
      },
    },
    {
      'kind': 'block',
      'type': 'swap',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
            "fields": {
              "DIRECTION": "DOWN"
            }
          },
        },
      },
    },
    {
      'kind': 'block',
      'type': 'copy_myself',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
            "fields": {
              "DIRECTION": "DOWN"
            }
          },
        },
      },
    },
    {
      'kind': 'block',
      'type': 'change_into',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
            "fields": {
              "DIRECTION": "HERE"
            }
          },
        },
        'TYPE_PARTICLE': {
          'shadow': {
            'type': 'particle',
          },
        },
      },
    },
    {
      'kind': 'block',
      'type': 'touching',
      'inputs': {
        'TYPE_PARTICLE': {
          'shadow': {
            'type': 'particle',
          },
        },
      }
    },
    {
      'kind': 'block',
      'type': 'number_of',
      'inputs': {
        'TYPE_PARTICLE': {
          'shadow': {
            'type': 'particle',
          },
        },
      }
    },
    {
      'kind': 'block',
      'type': 'type_of',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
            "fields": {
              "DIRECTION": "DOWN"
            }
          },
        },
      },
    },
    {
      'kind': 'block',
      'type': 'particle_in_direction',
      'inputs': {
        'DIRECTION': {
          'shadow': {
            'type': 'direction',
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
      'type': 'direction',
      "fields": {
        "DIRECTION": "DOWN"
      }
    },
    //----------------------------------------------------------------
    {
      'kind': 'block',
      'type': 'randomTransformation'
    },
    {
      'kind': 'block',
      'type': 'for_each_transformation',
    },
    {
      'kind': 'block',
      'type': 'rotated_by',
      'inputs': {
        'NUMBER': {
          'shadow': {
            'type': 'custom_field_slider',
          },
        },
      }
    },
    {
      'kind': 'block',
      'type': 'controls_if'
    },

    {
      'kind': 'block',
      'type': 'one_in_chance',
      'inputs': {
        'CHANCE': {
          'shadow': {
            'type': 'custom_field_slider_positive',
          },
        }
      }
    },
    {
      'kind': 'block',
      'type': 'comparison',
      'inputs': {
        'LEFT': {
          'shadow': {
            'type': 'custom_field_slider',
          },
        },
        'RIGHT': {
          'shadow': {
            'type': 'custom_field_slider',
          },
        },
      }
    },
    {
      'kind': 'block',
      'type': 'bool_comparison',

    },
    {
      'kind': 'block',
      'type': 'boolean',
    },
    {
      'kind': 'block',
      'type': 'not',
    },

    //----------------------------------------------------------------
    {
      'kind': 'block',
      'type': 'custom_field_slider'
    },
    {
      'kind': 'block',
      'type': 'random_from',
      'inputs': {
        'LEFT': {
          'shadow': {
            'type': 'custom_field_slider',
          },
        },
        'RIGHT': {
          'shadow': {
            'type': 'custom_field_slider',
          },
        },
      }
    },


    {
      'kind': 'block',
      'type': 'particle_properties',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
          }
        },
      }
    },
    {
      'kind': 'block',
      'type': 'increase_by',

      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
          }
        },
        'CHANCE': {
          'shadow': {
            'type': 'custom_field_slider',
          },
        }
      }
    },
    {
      'kind': 'block',
      'type': 'set_to',
      'inputs': {
        'OTHER': {
          'shadow': {
            'type': 'direction',
          }
        },
        'CHANCE': {
          'shadow': {
            'type': 'custom_field_slider_positive',
          },
        }
      }
    },
    //----------------------------------------------------------------
    {
      'kind': 'block',
      'type': 'repeat_n_times',
      'inputs': {
        'NUMBER': {
          'shadow': {
            'type': 'custom_field_slider_positive',
          },
        }
      }
    },
    {
      'kind': 'block',
      'type': 'every_n_frames',
      'inputs': {
        'NUMBER': {
          'shadow': {
            'type': 'custom_field_slider_positive',
          },
        }
      }
    },
    {
      'kind': 'block',
      'type': 'note'
    },

  ]


}