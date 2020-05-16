#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {InitStack} from '../lib/init-stack';

const app = new cdk.App();
new InitStack(app, 'InitStack', {
    env: getContextParam('aws_env_details'),
    tags: getContextParam('stack_tags')
});

function getContextParam(param: string, environment = 'dev') {
    return app.node.tryGetContext(param)[environment]
}


