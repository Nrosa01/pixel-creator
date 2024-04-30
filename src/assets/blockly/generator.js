import * as Blockly from 'blockly';



export const jsonGenerator = new Blockly.Generator('JSON');

//precedence is irrelevant in json format
const Order = {
  ATOMIC: 0,
};

jsonGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock =
    block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + ',\n' + jsonGenerator.blockToCode(nextBlock);
  }
  return code;
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

//member generator
jsonGenerator.forBlock['particle_base'] = function (block, generator) {
  //name of the particle
  const nameValue = block.getFieldValue('NAME');
  const color = hexToRgb(block.getFieldValue('COLOR'));
  const min_alpha = block.getFieldValue('MIN_ALPHA');
  const max_alpha = block.getFieldValue('MAX_ALPHA');

  const statementMembers =
    generator.statementToCode(block, 'THEN');

  const code =
    `{
"name": "${nameValue}",  
"version": "1.0.0", 
"color": [${color.r},${color.g}, ${color.b}],
"alpha": [${min_alpha}, ${max_alpha}],
"update": [
  
${statementMembers}
  
  ]
}`;
  return code;
};

jsonGenerator.forBlock['custom_field_slider'] = function (block, generator) {

  const number = block.getFieldValue('NUMBER');
  // const code = `{ "number": "constant", "data": ${number} }`
  return [`${number}`, Order.ATOMIC];
}


jsonGenerator.forBlock['custom_input_color'] = function (block, generator) {
  const min_alpha = block.getFieldValue('MIN_ALPHA');
  const code = `"alpha": ${min_alpha}`
  return code;
};

jsonGenerator.forBlock['randomTransformation'] = function (block, generator) {

  const action = block.getFieldValue('TRANSFORMATION');

  const statementMembers =
    generator.statementToCode(block, 'THEN');

  const code =

    `{
"action": "randomTransformation",
"data": {
  "transformation": "${action}",
  "block": ${statementMembers === '' ? 'null' : statementMembers}
  }
}`;

  return code;

};

jsonGenerator.forBlock['if'] = function (block, generator) {
  const statementMembers =
    generator.statementToCode(block, 'THEN');
  const condition =
    generator.statementToCode(block, 'CONDITION');
  const else_code = generator.statementToCode(block, 'ELSE');


  const code =
    `{
  "action": "if",
  "data": 
  {
    "condition": ${condition},
    "result": ${statementMembers},
    "else": ${else_code === '' ? 'null' : else_code}
  }
}`;
  return code;

};
var lastBlock = null;
jsonGenerator.forBlock['controls_if'] = function (block, generator) {
  // Assuming 'block' is your Blockly block
  console.log(lastBlock == block);
  lastBlock = block;

  const statementMembers =
    generator.statementToCode(block, 'DO0');
  const condition =
    generator.statementToCode(block, 'IF0');
  const code =
    `"block": {
"action": "if",
"data": {
${condition}
},
${statementMembers}
}
}
}`;
  return code;
}

const directions = {
  "HERE": '{ "direction": "constant", "data": [0, 0] }',
  "UP": '{ "direction": "constant", "data": [0, 1] }',
  "DOWN": '{ "direction": "constant", "data": [0, -1] }',
  "LEFT": '{ "direction": "constant", "data": [-1, 0] }',
  "RIGHT": '{ "direction": "constant", "data": [1, 0] }',
  "UPLEFT": '{ "direction": "constant", "data": [-1, 1] }',
  "UPRIGHT": '{ "direction": "constant", "data": [1, 1] }',
  "DOWNLEFT": '{ "direction": "constant", "data": [-1, -1] }',
  "DOWNRIGHT": '{ "direction": "constant", "data": [1, -1] }',
  "RAND": '{ "direction": "random" }'
};


jsonGenerator.forBlock['direction'] = function (block) {
  const direction = block.getFieldValue('DIRECTION');
  return [direction, Order.ATOMIC]
}


jsonGenerator.forBlock['particle'] = function (block) {
  const particle = block.getFieldValue('PARTICLE');
  const code = `{ "particle_type": "fromName", "data": "${particle}" }`;
  return [code, Order.ATOMIC]
}

jsonGenerator.forBlock['particle_in_direction'] = function (block, generator) {

  const direction = generator.valueToCode(block, 'DIRECTION', Order.ATOMIC);
  const particle = generator.valueToCode(block, 'TYPE_PARTICLE', Order.ATOMIC);

  const code =
    `{
    "block": "checkTypesInDirection",
    "data": {
      "direction": ${directions[direction]},
      "types": [
        ${particle}
      ]
    }
  }`

  return code;

};

jsonGenerator.forBlock['swap'] = function (block, generator) {
  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  console.log(directions[direction]);
  const code = `{
    "action": "swap",
    "data": {
      "direction": ${directions[direction]}
    }
  }` ;

  return code
}

jsonGenerator.forBlock['group_particle'] = function (block, generator) {
  var particleTypes = [];
  var i = 0;
  while (block.getInput(`ITEM${i}`) !== null) {
    const particleType = generator.valueToCode(block, `ITEM${i}`, Order.ATOMIC);
    particleTypes.push(particleType);
    i++;
  }

  var code = particleTypes.join(',\n\t');

  return [code, Order.ATOMIC];
}

jsonGenerator.forBlock['copy_myself'] = function (block, generator) {

  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  console.log(directions[direction]);
  const code = `{
    "action": "copyTo",
    "data": {
      "direction": ${directions[direction]}
    }
  }` ;

  return code;
}


jsonGenerator.forBlock['change_into'] = function (block, generator) {

  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  const particle = generator.valueToCode(block, 'TYPE_PARTICLE', Order.ATOMIC);

  const code = `{
    "action": "changeInto",
    "data": {
      "direction": ${directions[direction]},
      "type": ${particle}
    }
  }` ;

  return code;
}


jsonGenerator.forBlock['touching'] = function (block, generator) {

  const particle = generator.valueToCode(block, 'TYPE_PARTICLE', Order.ATOMIC);

  const code =
    `{
    "block": "isTouching",
    "data": {
      "types": [
        ${particle}
      ]
    }
  }`

  return code;
}


jsonGenerator.forBlock['number_of'] = function (block, generator) {

  const particle = generator.valueToCode(block, 'TYPE_PARTICLE', Order.ATOMIC);

  const code =
    `{
    "block": "numberOfXTouching",
    "data": {
      "types": [
        ${particle}
      ]
    }
  }`

  return [code, Order.ATOMIC];
}


jsonGenerator.forBlock['type_of'] = function (block, generator) {
  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  const code = `{"number":"typeOf","data":{"direction":"constant","data":${directions[direction]}}}`;
  return [code, Order.ATOMIC];
}


jsonGenerator.forBlock['one_in_chance'] = function (block, generator) {
  const number = generator.valueToCode(block, 'CHANCE', Order.ATOMIC);
  const code = `{"block":"oneInXChance","data":{"chance": ${number} }}`;
  return code;
}

jsonGenerator.forBlock['comparison'] = function (block, generator) {
  const left = generator.valueToCode(block, 'LEFT', Order.ATOMIC);
  const right = generator.valueToCode(block, 'RIGHT', Order.ATOMIC);
  const operator = block.getFieldValue('DROPDOWN');
  const code = `{
    "block": "${operator}",
    "data": {
      "block1": "{ "number": "constant", "data": ${left} }"},
      "block2": "{ "number": "constant", "data": ${right} }" }
    }
  }`;
  return code;
}


jsonGenerator.forBlock['bool_comparison'] = function (block, generator) {
  const left = generator.statementToCode(block, 'LEFT');
  const right = generator.statementToCode(block, 'RIGHT');
  const comparison = block.getFieldValue('DROPDOWN');
  const code = `{
    "block": "${comparison}",
    "data": {
      "block1": ${left} },
      "block2": ${right} }
    }
  }`;


  return code;
}


jsonGenerator.forBlock['boolean'] = function (block, generator) {
  const value_bool = block.getFieldValue('BOOLEAN');
  const code = `{ "block": "boolean", "data": { "value": ${value_bool} } }`;
  return code;
}


jsonGenerator.forBlock['for_each_transformation'] = function (block, generator) {

  const action = block.getFieldValue('TRANSFORMATION');

  const statementMembers =
    generator.statementToCode(block, 'THEN');

  const code =

    `{
"action": "ForEachTransformation",
"data": {
  "transformation": "${action}",
  "block": ${statementMembers === '' ? 'null' : statementMembers}
  }
}`;

  return code;
}


jsonGenerator.forBlock['rotated_by'] = function (block, generator) {

  const number = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);

  const statementMembers =
    generator.statementToCode(block, 'THEN');

  const code =

    `{
"action": "rotatedBy",
"data": {
  "number": "{ "number": "constant", "data": ${number} }",
  "block": ${statementMembers === '' ? 'null' : statementMembers}
  }
}`;

  return code;
}


jsonGenerator.forBlock['math_operation'] = function (block, generator) {
  const left = generator.valueToCode(block, 'LEFT', Order.ATOMIC);
  const right = generator.valueToCode(block, 'RIGHT', Order.ATOMIC);
  const operator = block.getFieldValue('OPERATOR');

  const code = `{
    "number": "mathOperation",
    "data": [
      { "math_op": "${operator}" },
      { "number": "constant", "data": ${left} },
      { "number": "constant", "data": ${right} }
    ]
  }`;
  return [code, Order.ATOMIC];
}


jsonGenerator.forBlock['random_from'] = function (block, generator) {
  const left = generator.valueToCode(block, 'LEFT', Order.ATOMIC);
  const right = generator.valueToCode(block, 'RIGHT', Order.ATOMIC);

  const code = `{"number":"randomFromXToY","data":[${left},${right}]}`;
  return [code, Order.ATOMIC];
}

jsonGenerator.forBlock['particle_properties'] = function (block, generator) {
  const propierty = block.getFieldValue('PROPERTY');
  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  const code = `"number": "${propierty}"
  "data": {
    "direction": "${direction}
  }`;

  //const code = `{ "particle_propierty_descriptor": "${propierty}" }`;
  return [code, Order.ATOMIC];
}

/*
{
    "action": "increaseParticlePropierty",
    "data": {
      "propierty": { "particle_propierty_descriptor": "light" },
      "number": { "number": "constant", "data": 1 },
      "direction": null
    }
  },
*/

//----------------------------------------------------------------
//leer esto diferente de fichero o cambiar el campo de direccion al bloque padre
jsonGenerator.forBlock['increase_by'] = function (block, generator) {
  const property = block.getFieldValue('PROPERTY');
  const number = block.getFieldValue('NUMBER');
  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  const code = ` 
  "action": "increaseParticlePropierty",
    "data": {
      "propierty": { "particle_propierty_descriptor": "${property}" },
      "number":{ "number": "constant", "data": ${number} },
      "direction": ${directions[direction]}
    }
  },`;
  return code;
}

jsonGenerator.forBlock['set_to'] = function (block, generator) {
  const property = block.getFieldValue('PROPERTY');
  const number = block.getFieldValue('NUMBER');
  const direction = generator.valueToCode(block, 'OTHER', Order.ATOMIC);
  const code = ` 
  "action": "setParticlePropierty",
    "data": {
      "propierty": { "particle_propierty_descriptor": "${property}" },
      "number": { "number": "constant", "data": ${number} },
      "direction": ${directions[direction]}
    }
  },`;
  return code;
}
jsonGenerator.forBlock['repeat_n_times'] = function (block, generator) {

  const number = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
  const statementMembers =
    generator.statementToCode(block, 'THEN');
  const code = ` 
  "action": "repeat",
    "data": {
      "number": { "number": "constant", "data": ${number} },
      "block": ${statementMembers}
    }
  },`;
  return code;
}

jsonGenerator.forBlock['every_n_frames'] = function (block, generator) {

  const number = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
  const statementMembers =
    generator.statementToCode(block, 'THEN');
  const code = ` 
  "action": "everyXFrames",
    "data": {
      "number": { "number": "constant", "data": ${number} },
      "block": ${statementMembers}
    }
  },`;
  return code;
}


jsonGenerator.forBlock['not'] = function (block, generator) {
  const boolean = generator.statementToCode(block, 'BOOLEAN');

  const code = `"block" : "not",
  "data" : {
    "block" : ${boolean}
  }`;


  return code;
}