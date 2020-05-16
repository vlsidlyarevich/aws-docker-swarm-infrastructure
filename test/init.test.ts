import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Init from '../lib/docker-swarm-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Init.DockerSwarmStack(app, 'MyTestStack', {});
    // THEN
    // expectCDK(stack).to(matchTemplate({
    //   "Resources": {}
    // }, MatchStyle.EXACT))
});
