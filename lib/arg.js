'use strict';

// ParameterKey=string,ParameterValue=string,UsePreviousValue=boolean
exports.parse = (argv) => {
  return require('yargs')
    .options({
      'stack-name': {type: 'string', demandOption: true},
      'template-body': {type: 'string'},
      'template-url': {type: 'string'},
      'parameters': {type: 'array'},
      'capabilities': {type: 'array'},
      'resource-types': {type: 'array'},
      'role-arn': {type: 'string'},
      'stack-policy-body': {type: 'string'},
      'stack-policy-url': {type: 'string'},
      'notification-arns': {type: 'array'},
      'tags': {type: 'array'},
      'disable-rollback': {type: 'boolean', default: undefined},
      'timeout-in-minutes': {type: 'number'},
      'on-failure': {type: 'string'},
      'use-previous-template': {type: 'boolean', default: undefined},
      'stack-policy-during-update-body': {type: 'string'},
      'stack-policy-during-update-url': {type: 'string'},
      'profile': {type: 'string'},
      'region': {type: 'string'},
      'wait': {type: 'boolean', default: undefined},
    })
    .version(function() {
      return require('../package.json').version;
    })
    .parse(argv);
};

exports.process = (argv) => {
  const fs = require('fs');
  const map = require('./map.js');

  function has(arg) {
    return argv[arg] !== undefined;
  }

  function boolean(arg) {
    return argv[arg] === true;
  }

  function string(arg) {
    const val = argv[arg];
    if (val.length === 0) {
      console.error(`${arg} needs to be a string`);
      process.exit(1);
    }
    return val;
  }

  function int(arg) {
    const val = argv[arg];
    if (val < 0) {
      console.error(`${arg} needs to be a positive int`);
      process.exit(1);
    }
    return val;
  }

  function isFileUrl(val) { // does this string look like a file URL?
    return (val.startsWith('file://'));
  }

  function file(val) { // if the value is a file:// reads the file from disk, otherwise returns the value
      return isFileUrl(val) ? fs.readFileSync(val.slice(7), {encoding: 'utf8'}) : val;
  }

  function list(arg, fn) {
    const vals = argv[arg];
    if (vals.length === 0) {
      console.error(`${arg} needs to be an array with items`);
      process.exit(1);
    }
    return vals.map((val, i) => {
      try {
        return fn(val);
      } catch (err) {
        console.error(`${arg}[${i}] ${err.message}`);
        process.exit(1);
      }
    });
  }

  var args = {
    stackName: string('stack-name')
  };

  if (has('template-body')) {
    args.templateBody = file(string('template-body'));
  }
  if (has('template-url')) {
    args.templateUrl = string('template-url');
  }
  if (has('parameters')) {
    try {
      args.parameters = JSON.parse(argv.parameters[0]);
    } catch (err) {
      if (isFileUrl(argv.parameters[0])) {
        args.parameters = JSON.parse(file(argv.parameters[0]));
      }
      else {
        args.parameters = list('parameters', map.parameter);
      }
    }
  }
  if (has('capabilities')) {
    args.capabilities = list('capabilities', map.string);
  }
  if (has('resource-types')) {
    args.resourceTypes = list('resource-types', map.string);
  }
  if (has('role-arn')) {
    args.roleArn = string('role-arn');
  }
  if (has('stack-policy-body')) {
    args.stackPolicyBody = file(string('stack-policy-body'));
  }
  if (has('stack-policy-url')) {
    args.stackPolicyUrl = string('stack-policy-url');
  }
  if (has('notification-arns')) {
    args.notificationArns = list('notification-arns', map.string);
  }
  if (has('tags')) {
    args.tags = list('tags', map.tag);
  }
  if (has('disable-rollback')) {
    args.disableRollback = boolean('disable-rollback');
  }
  if (has('timeout-in-minutes')) {
    args.timeoutInMinutes = int('timeout-in-minutes');
  }
  if (has('on-failure')) {
    args.onFailure = string('on-failure');
  }
  if (has('use-previous-template')) {
    args.UsePreviousTemplate = boolean('use-previous-template');
  }
  if (has('stack-policy-during-update-body')) {
    args.stackPolicyDuringUpdateBody = file(string('stack-policy-during-update-body'));
  }
  if (has('stack-policy-during-update-url')) {
    args.stackPolicyDuringUpdateUrl = string('stack-policy-during-update-url');
  }
  if (has('profile')) {
    args.profile = string('profile');
  }
  if (has('region')) {
    args.region = string('region');
  }
  if (has('wait')) {
    args.wait = boolean('wait');
  }

  return args;
};
