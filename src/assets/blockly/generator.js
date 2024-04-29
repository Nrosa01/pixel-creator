import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');

//precedence is irrelevant in json format
const Order = {
  ATOMIC: 0,
};

//#region tutorial

//block basic generator 
jsonGenerator.forBlock['logic_null'] = function (block) {
  return ['null', Order.ATOMIC];
};

jsonGenerator.forBlock['text'] = function (block) {
  const textValue = block.getFieldValue('TEXT');
  const code = `"${textValue}"`;
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['math_number'] = function (block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, Order.ATOMIC];
};

jsonGenerator.forBlock['logic_boolean'] = function (block) {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

//member generator
jsonGenerator.forBlock['member'] = function (block, generator) {

  const name = block.getFieldValue('MEMBER_NAME');
  const value = generator.valueToCode(
    block, 'MEMBER_VALUE', Order.ATOMIC);
  const code = `"${name}": ${value}`;
  return code;
};

//array generator 
//The array block uses a mutator to dynamically change the number of inputs it has.
jsonGenerator.forBlock['lists_create_with'] = function (block, generator) {
  const values = [];
  for (let i = 0; i < block.itemCount_; i++) {
    const valueCode = generator.valueToCode(block, 'ADD' + i,
      Order.ATOMIC);
    if (valueCode) {
      values.push(valueCode);
    }
  }
  const valueString = values.join(',\n');
  const indentedValueString =
    generator.prefixLines(valueString, generator.INDENT);
  const codeString = '[\n' + indentedValueString + '\n]';
  return [codeString, Order.ATOMIC];
};

jsonGenerator.forBlock['object'] = function (block, generator) {
  const statementMembers =
    generator.statementToCode(block, 'MEMBERS');
  const code = '{\n' + statementMembers + '\n}';
  return [code, Order.ATOMIC];
};

jsonGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock =
    block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + ',\n' + jsonGenerator.blockToCode(nextBlock);
  }
  return code;
};

// #endregion

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
  //randa and keyboard ¿?
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

/*
"condition": {
  "block": "checkTypesInDirection",
  "data": {
    "direction": { "direction": "constant", "data": [0, -1] },
    "types": [
      { "constant_number": "particleIdFromName", "data": "empty" },
      { "constant_number": "particleIdFromName", "data": "water" }
    ]
  }
},
*/

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
/*
"result": {
  "action": "swap",
  "data": {
    "direction": { "direction": "constant", "data": [0, -1] }
  }
},
*/
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
  var code = "";
  var i = 0;
  while (block.getInput(`ITEM${i}`) !== null) {
    const particleType = generator.valueToCode(block, `ITEM${i}`, Order.ATOMIC);
    code += '\n\t' + particleType;
    i++;
  }

  return [code, Order.ATOMIC];
}