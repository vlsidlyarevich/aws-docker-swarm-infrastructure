#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {DockerSwarmStack} from '../lib/docker-swarm-stack';

const app = new cdk.App();
new DockerSwarmStack(app, 'DockerSwarm', {
    env: getEnv('aws_env_details'),
    tags: getTags('stack_tags')
});

function getTags(param: string) {
    return app.node.tryGetContext(param)
}

function getEnv(param: string, environment = 'dev') {
    return app.node.tryGetContext(param)[environment]
}


