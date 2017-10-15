'use strict';

// ParameterKey=string,ParameterValue=string,UsePreviousValue=boolean
exports.parameter = (val) => {
  const ret = {};
  const pairs = val.split(',').map((pair) => pair.split('='));
  pairs.forEach((pair) => {
    if (pair[0] === 'ParameterKey') {
      ret.ParameterKey = pair[1];
    } else if (pair[0] === 'ParameterValue') {
      ret.ParameterValue = pair[1];
    } else if (pair[0] === 'UsePreviousValue') {
      ret.UsePreviousValue = pair[1] === 'true';
    } else {
      throw new Error('ParameterKey, ParameterValue or UsePreviousValue expected');
    }
  });
  return ret;
};

exports.string = (val) => {
  if (val.length === 0) {
    throw new Error('needs to be a string');
  }
  return val;
};

// Key=string,Value=string
exports.tag = (val) => {
  const ret = {};
  const pairs = val.split(',').map((pair) => pair.split('='));
  pairs.forEach((pair) => {
    if (pair[0] === 'Key') {
      ret.key = pair[1];
    } else if (pair[0] === 'Value') {
      ret.value = pair[1];
    } else {
      throw new Error('Key or Value expected');
    }
  });
  return ret;
};
