#!/usr/bin/env node

'use strict';

// CLI uses AWS_DEFAULT_REGION, while the Node.js SDK uses AWS_REGION
if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
  process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
}

const fs = require('fs');
const map = require('./lib/map.js');
const arg = require('./lib/arg.js');
const cfn = require('./index.js');

const argv = arg.parse(process.argv);

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

function file(val) { // if the value is a file:// reads the file from disk, otherwise returns the value
  if (val.startsWith('file://')) {
    return fs.readFileSync(val.slice(7), {encoding: 'utf8'});
  } else {
    return val;
  }
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
  args.parameters = list('parameters', map.parameter);
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
  args.usePreviousTemplate = boolean('use-previous-template');
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

cfn.createOrUpdate(args, function(err, res) {
  if (err) {
    console.error(err.message, err.stack);
    process.exit(1);
  } else {
    console.log(res);
    process.exit(0);
  }
});
