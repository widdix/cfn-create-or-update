


'use strict';

const assert = require('assert');
const arg = require('../lib/arg.js');

describe('arg', function() {
  describe('parse', function() {
    it('minimum', function() {
      const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name']);
      assert.equal(argv.stackName, 'name');
    });
    it('global', function() {
      const argv = arg.parse(['/node', 'cli.js', '--region', 'eu-west-1', '--profile', 'profile', '--stack-name', 'name']);
      assert.equal(argv.region, 'eu-west-1');
      assert.equal(argv.profile, 'profile');
      assert.equal(argv['stack-name'], 'name');
    });
    it('common', function() {
      const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--template-body', 'body', '--template-url', 'url', '--parameters', 'ParameterKey=key,UsePreviousValue=true', 'ParameterKey=key,ParameterValue=value', '--capabilities', 'capability1', 'capability2', '--resource-types', 'type1', 'type2', '--role-arn', 'arn', '--stack-policy-body', 'body', '--stack-policy-url', 'url', '--notification-arns', 'arn1', 'arn2']);
      assert.equal(argv['stack-name'], 'name');
      assert.equal(argv['template-body'], 'body');
      assert.equal(argv['template-url'], 'url');
      assert.deepEqual(argv.parameters, ['ParameterKey=key,UsePreviousValue=true', 'ParameterKey=key,ParameterValue=value']);
      assert.deepEqual(argv.capabilities, ['capability1', 'capability2']);
      assert.deepEqual(argv['resource-types'], ['type1', 'type2']);
      assert.equal(argv['role-arn'], 'arn');
      assert.equal(argv['stack-policy-body'], 'body');
      assert.equal(argv['stack-policy-url'], 'url');
      assert.deepEqual(argv['notification-arns'], ['arn1', 'arn2']);
    });
    describe('create', function() {
      it('create', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--timeout-in-minutes', '10', '--on-failure', 'failure']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], undefined);
        assert.equal(argv['timeout-in-minutes'], 10);
        assert.equal(argv['on-failure'], 'failure');
      });
      it('--disable-rollback', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--disable-rollback']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], true);
      });
      it('--no-disable-rollback', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--no-disable-rollback']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], false);
      });
    });
    describe('update', function() {
      it('update', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--stack-policy-during-update-body', 'body', '--stack-policy-during-update-url', 'url']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], undefined);
        assert.equal(argv['stack-policy-during-update-body'], 'body');
        assert.equal(argv['stack-policy-during-update-url'], 'url');
      });
      it('--use-previous-template', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--use-previous-template']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], true);
      });
      it('--no-use-previous-template', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--no-use-previous-template']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], false);
      });
    });
    describe('additional', function() {
      it('update', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv.wait, undefined);
      });
      it('--use-previous-template', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--wait']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv.wait, true);
      });
      it('--no-use-previous-template', function() {
        const argv = arg.parse(['/node', 'cli.js', '--stack-name', 'name', '--no-wait']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv.wait, false);
      });
    });
  });
  describe('process', function() {
    describe('parameters', function() {
      it('handles as args', function() {
        const argv = arg.process({
          parameters: [
            'ParameterKey=key,UsePreviousValue=true',
            'ParameterKey=key,ParameterValue=value'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.parameters, [
          { ParameterKey: 'key', UsePreviousValue: true },
          { ParameterKey: 'key', ParameterValue: 'value' }
        ]);
      });
      it('handles as JSON file', function() {
        const argv = arg.process({
          parameters: [
            'file://test/fixtures/params.json'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.parameters, [
          { ParameterKey: 'fileKey1', ParameterValue: 'fileValue1' },
          { ParameterKey: 'fileKey2', ParameterValue: 'fileValue2' }
        ]);
      });
      it('handles as JSON string', function() {
        const argv = arg.process({
          parameters: [
            '[{"ParameterKey": "sKey1","ParameterValue":"sVal1"}, {"ParameterKey": "sKey2","ParameterValue":"sVal2"}]'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.parameters, [
          { ParameterKey: 'sKey1', ParameterValue: 'sVal1' },
          { ParameterKey: 'sKey2', ParameterValue: 'sVal2' }
        ]);
      });
    });
  });
});
