[![Build Status](https://secure.travis-ci.org/widdix/cfn-create-or-update.png)](http://travis-ci.org/widdix/cfn-create-or-update)
[![NPM version](https://badge.fury.io/js/cfn-create-or-update.png)](http://badge.fury.io/js/cfn-create-or-update)
[![NPM dependencies](https://david-dm.org/widdix/cfn-create-or-update.png)](https://david-dm.org/widdix/cfn-create-or-update)

# cfn-create-or-update


When integrating CloudFormation into your CI/CD pipeline you are faced with the challenge of creating a CloudFormation stack on the first run of the pipeline, while you need to update the stack for all following pipeline runs. If you use the AWS CLI this is painful.
You may also have your code and template in the same repository. Therefore code changes without the template. But the AWS CLI threats an update without changes to a stack as an error which is not the behavior that you need in your pipeline.

`cfn-create-or-update` can [create](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-stack.html) or [update](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/update-stack.html) a CloudFormation stack. If no updates are to be performed, no error is thrown. `cfn-create-or-update` behaves exactly as the AWS CLI regarding input values, output will be different.

## Installation

To install the CLI tool `cfn-create-or-update`, run:

```
npm install -g cfn-create-or-update
```

To create or update a stack, run:

```
cfn-create-or-update --stack-name test --template-body file://template.yml
```

The first time you run this command, a stack will be created. The second time an update will be performed but only if the template has changes.

## CLI parameters

`cfn-create-or-update` behaves exactly as the AWS CLI regarding input values. Supported parameters (as documented in the AWS CLI [create-stack](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-stack.html) or [update-stack](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/update-stack.html)):

```
cfn-create-or-update
--stack-name
--template-body
--template-url
--parameters
--capabilities 
--resource-types
--role-arn
--stack-policy-body
--stack-policy-url
--notification-arns
--tags
```

Global parameters (as documented in the [AWS CLI](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html#general-options)

```
--profile
--region
```

If you use a parameter of type `List<?>` or `CommaDelimitedList`, you have to supply the values like this:

```
--parameters ParameterKey=SubnetIds,ParameterValue=\"subnet-3353611c,subnet-c3d51189\"
```

Only used during create, otherwise ignored (as documented in the AWS CLI [create-stack](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-stack.html)):

```
--disable-rollback | --no-disable-rollback
--timeout-in-minutes
--on-failure
```

Only used during update, otherwise ignored (as documented in the AWS CLI [update-stack](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/update-stack.html)):

```
--use-previous-template | --no-use-previous-template]
--stack-policy-during-update-body
--stack-policy-during-update-url
```

Additional parameters

```
--wait
```

## Environment variables

* both `AWS_REGION` and `AWS_DEFAULT_REGION` work
* `HTTPS_PROXY` is used if set
* `AWS_PROFILE` is used if set
* `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and optionally `AWS_SESSION_TOKEN` are used of set

## Multi-Factor Authentication

If your AWS CLI profile has a `mfa_serial` property, then multi-factor authentication is required. You will be prompted to enter your 6-digit MFA token code via the console.

```
$ cfn-create-or-update --profile admin-role --stack-name mystack --template-body file://mystack.yml
? MFA token for arn:aws:iam::000000000000:mfa/myusername: 123456
{}
```

## Contribution

If you want to create a Pull-Request please make sure that `make test` runs without failures.

### Code Style

```
make jshint
```

### Unit Tests

```
make mocha
```

### Circular depdendencies

```
make circular
```

### Test coverage

```
make coverage
open coverage/lcov-report/index.html
```
