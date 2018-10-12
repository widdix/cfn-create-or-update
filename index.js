'use strict';

const assert = require('assert-plus');
const AWS = require('aws-sdk');
const inquirer = require('inquirer');

function checkStack(cfn, args, cb) {
  cfn.describeStacks({
    StackName: args.stackName
  }, (err, data) => {
    if (err) {
      if (err.message.endsWith('does not exist')) {
        cb(null, false);
      } else {
        cb(err);
      }
    } else {
      cb(null, true);
    }
  });
}

function createStack(cfn, args, cb) {
  const params = {
    StackName: args.stackName
  };
  if (args.templateBody !== undefined) {
    params.TemplateBody = args.templateBody;
  }
  if (args.templateUrl !== undefined) {
    params.TemplateURL = args.templateUrl;
  }
  if (args.parameters !== undefined) {
    params.Parameters = args.parameters.map((parameter) => {
      const ret = {
        ParameterKey: parameter.ParameterKey
      };
      if (parameter.ParameterValue !== undefined) {
        ret.ParameterValue = parameter.ParameterValue;
      }
      if (parameter.UsePreviousValue !== undefined) {
        ret.UsePreviousValue = parameter.UsePreviousValue;
      }
      return ret;
    });
  }
  if (args.disableRollback !== undefined) {
    params.DisableRollback = args.disableRollback;
  }
  if (args.timeoutInMinutes !== undefined) {
    params.TimeoutInMinutes = args.timeoutInMinutes;
  }
  if (args.notificationArns !== undefined) {
    params.NotificationARNs = args.notificationArns;
  }
  if (args.capabilities !== undefined) {
    params.Capabilities = args.capabilities;
  }
  if (args.resourceTypes !== undefined) {
    params.ResourceTypes = args.resourceTypes;
  }
  if (args.roleArn !== undefined) {
    params.RoleARN = args.roleArn;
  }
  if (args.onFailure !== undefined) {
    params.OnFailure = args.onFailure;
  }
  if (args.stackPolicyBody !== undefined) {
    params.StackPolicyBody = args.stackPolicyBody;
  }
  if (args.stackPolicyUrl !== undefined) {
    params.StackPolicyURL = args.stackPolicyUrl;
  }
  if (args.tags !== undefined) {
    params.Tags = args.tags.map((tag) => ({
      Key: tag.key,
      Value: tag.value
    }));
  }
  cfn.createStack(params, (err, res) => {
    if (err) {
      cb(err);
    } else {
      if (args.wait === true) {
        cfn.waitFor('stackCreateComplete', {StackName: args.stackName}, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, res);
          }
        });
      } else {
        cb(null, res);
      }
    }
  });
}

function updateStack(cfn, args, cb) {
  const params = {
    StackName: args.stackName
  };
  if (args.templateBody !== undefined) {
    params.TemplateBody = args.templateBody;
  }
  if (args.templateUrl !== undefined) {
    params.TemplateURL = args.templateUrl;
  }
  if (args.UsePreviousTemplate !== undefined) {
    params.UsePreviousTemplate = args.UsePreviousTemplate;
  }
  if (args.stackPolicyDuringUpdateBody !== undefined) {
    params.StackPolicyDuringUpdateBody = args.stackPolicyDuringUpdateBody;
  }
  if (args.stackPolicyDuringUpdateUrl !== undefined) {
    params.StackPolicyDuringUpdateURL = args.stackPolicyDuringUpdateUrl;
  }
  if (args.parameters !== undefined) {
    params.Parameters = args.parameters.map((parameter) => {
      const ret = {
        ParameterKey: parameter.ParameterKey
      };
      if (parameter.ParameterValue !== undefined) {
        ret.ParameterValue = parameter.ParameterValue;
      }
      if (parameter.UsePreviousValue !== undefined) {
        ret.UsePreviousValue = parameter.UsePreviousValue;
      }
      return ret;
    });
  }
  if (args.capabilities !== undefined) {
    params.Capabilities = args.capabilities;
  }
  if (args.resourceTypes !== undefined) {
    params.ResourceTypes = args.resourceTypes;
  }
  if (args.roleArn !== undefined) {
    params.RoleARN = args.roleArn;
  }
  if (args.stackPolicyBody !== undefined) {
    params.StackPolicyBody = args.stackPolicyBody;
  }
  if (args.stackPolicyUrl !== undefined) {
    params.StackPolicyURL = args.stackPolicyUrl;
  }
  if (args.notificationArns !== undefined) {
    params.NotificationARNs = args.notificationArns;
  }
  if (args.tags !== undefined) {
    params.Tags = args.tags.map((tag) => ({
      Key: tag.key,
      Value: tag.value
    }));
  }
  cfn.updateStack(params, (err, res) => {
    if (err) {
      if (err.message.startsWith('No updates are to be performed')) {
        cb(null, {});
      } else {
        cb(err);
      }
    } else {
      if (args.wait === true) {
        cfn.waitFor('stackUpdateComplete', {StackName: args.stackName}, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, res);
          }
        });
      } else {
        cb(null, res);
      }
    }
  });
}

function tokenCodeFn(serial, cb) {
  const resp = inquirer.prompt(
    {
      name: 'token',
      type: 'input',
      default: '',
      message: `MFA token for ${serial}:`
    }).then((r) => {
    cb(null, r.token);
  }).catch((e) => {
    console.log('error:', e);
    cb(e);
  });
}

function createCfnClient(region, profile) {
  const cfnOptions = {
    apiVersion: '2010-05-15'
  };
  if (profile !== undefined) {
    cfnOptions.credentials = new AWS.SharedIniFileCredentials({tokenCodeFn: tokenCodeFn, profile: profile});
  }
  if (region !== undefined) {
    cfnOptions.region = region;
  }
  return new AWS.CloudFormation(cfnOptions);
}

exports.createOrUpdate = (args, cb) => {
  assert.object(args, 'args');
  assert.string(args.stackName, 'stackName');
  assert.optionalString(args.templateBody, 'templateBody');
  assert.optionalString(args.templateUrl, 'templateUrl');
  assert.optionalArrayOfObject(args.parameters, 'parameters');
  if (args.parameters !== undefined) {
    args.parameters.forEach((parameter, i) => {
      assert.string(parameter.ParameterKey, `parameters[${i}].parameterKey`);
      assert.optionalString(parameter.ParameterValue, `parameters[${i}].parameterValue`);
      assert.optionalBool(parameter.UsePreviousValue, `parameters[${i}].UsePreviousValue`);
    });
  }
  assert.optionalArrayOfString(args.capabilities, 'capabilities');
  assert.optionalArrayOfString(args.resourceTypes, 'resourceTypes');
  assert.optionalString(args.roleArn, 'roleArn');
  assert.optionalString(args.stackPolicyBody, 'stackPolicyBody');
  assert.optionalString(args.stackPolicyUrl, 'stackPolicyUrl');
  assert.optionalArrayOfString(args.notificationArns, 'notificationArns');
  assert.optionalArrayOfObject(args.tags, 'tags');
  if (args.tags !== undefined) {
    args.tags.forEach((tag, i) => {
      assert.string(tag.key, `tags[${i}].key`);
      assert.string(tag.value, `tags[${i}].value`);
    });
  }
  assert.optionalBool(args.disableRollback, 'disableRollback');
  assert.optionalNumber(args.timeoutInMinutes, 'timeoutInMinutes');
  assert.optionalString(args.onFailure, 'onFailure');
  assert.optionalBool(args.UsePreviousTemplate, 'UsePreviousTemplate');
  assert.optionalString(args.stackPolicyDuringUpdateBody, 'stackPolicyDuringUpdateBody');
  assert.optionalString(args.stackPolicyDuringUpdateUrl, 'stackPolicyDuringUpdateUrl');
  assert.optionalString(args.profile, 'profile');
  assert.optionalString(args.region, 'region');
  assert.optionalBool(args.wait, 'wait');
  const cfn = createCfnClient(args.region, args.profile || process.env.AWS_PROFILE);
  checkStack(cfn, args, (err, exists) => {
    if (err) {
      cb(err);
    } else {
      if (exists === false) {
        createStack(cfn, args, cb);
      } else {
        updateStack(cfn, args, cb);
      }
    }
  });
};
