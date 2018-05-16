#!/usr/bin/env node

'use strict';

const proxy = require('proxy-agent');
const AWS = require('aws-sdk');

if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
  process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
}

if (process.env.HTTPS_PROXY) {
  AWS.config.update({
    httpOptions: {agent: proxy(process.env.HTTPS_PROXY)}
  });
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
