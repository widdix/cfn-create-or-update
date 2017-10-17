#!/usr/bin/env node

'use strict';

// CLI uses AWS_DEFAULT_REGION, while the Node.js SDK uses AWS_REGION
if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
  process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
}

const arg  = require('./lib/arg.js');
const cfn  = require('./index.js');
const args = arg.process(arg.parse(process.argv));

cfn.createOrUpdate(args, function(err, res) {
  if (err) {
    console.error(err.message, err.stack);
    process.exit(1);
  } else {
    console.log(res);
    process.exit(0);
  }
});
