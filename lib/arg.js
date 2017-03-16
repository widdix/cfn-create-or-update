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
