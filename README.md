# AWS docker-swarm infrastructure repository
Repository with AWS cdk scripts for docker-swarm training infrastructure deployment.

## Prerequisites

1. Node (`brew install npm`)
1. AWS CDK (`npm install -g aws-cdk`)
1. [Install AWS cli v2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html)
1. [Configure your aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration) with the right credentials for the dev environment (available in Lastpass with the name `CDK Credentials`)
1. For more details / up to date installation guidance, see the [AWS official docs](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

### Initial run, ensure your environment is working nicely

First run:
1. `npm install`

Build and see what changes would be deployed:
1. `npm run build` or `npm run watch`
1. `cdk diff` (example of not-harmful cdk command to ensure you have the right access)

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template