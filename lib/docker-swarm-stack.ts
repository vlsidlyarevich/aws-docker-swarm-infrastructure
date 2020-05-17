import * as cdk from '@aws-cdk/core';
import {SubnetType} from "@aws-cdk/aws-ec2";
import ec2 = require("@aws-cdk/aws-ec2");

export class DockerSwarmStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new VPCSetup(this, 'VPCSetup')
    }
}

export class VPCSetup extends cdk.Construct {
    readonly leadManagerVpc: ec2.Vpc;
    readonly workerVpc: ec2.Vpc;

    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        this.leadManagerVpc = new ec2.Vpc(this, 'lead-manager-vpc', {
            cidr: "10.0.0.0/16",
            enableDnsHostnames: false,
            maxAzs: 1,
            subnetConfiguration: [
                {
                    cidrMask: 16,
                    name: "lead-manager-vpc-subnet-1a",
                    subnetType: SubnetType.PUBLIC
                }
            ]
        })

        const leadManagerSecGroup = new ec2.SecurityGroup(this, 'lead-manager-security-group', {
            securityGroupName: 'lead-manager-security-group',
            vpc: this.leadManagerVpc,
            description: 'Lead manager vpc security group'
        });
        leadManagerSecGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());


        this.workerVpc = new ec2.Vpc(this, 'worker-vpc', {
            cidr: "10.1.0.0/16",
            enableDnsHostnames: false,
            maxAzs: 1,
            subnetConfiguration: [
                {
                    cidrMask: 16,
                    name: "worker-vpc-subnet-1a",
                    subnetType: SubnetType.PUBLIC
                }
            ]
        })

        const workerSecGroup = new ec2.SecurityGroup(this, 'worker-security-group', {
            securityGroupName: 'worker-security-group',
            vpc: this.workerVpc,
            description: 'Worker vpc security group'
        });
        workerSecGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());

        const peer = new ec2.CfnVPCPeeringConnection(this, 'lead-manager-worker-peer', {
            vpcId: this.leadManagerVpc.vpcId,
            peerVpcId: this.workerVpc.vpcId
        })

        this.leadManagerVpc.selectSubnets({subnetGroupName: "lead-manager-vpc-subnet-1a"})
            .subnets.forEach((subnet) => {
            new ec2.CfnRoute(this, "lead-manager-to-worker-route", {
                routeTableId: subnet.routeTable.routeTableId,
                destinationCidrBlock: "10.1.0.0/16",
                vpcPeeringConnectionId: peer.ref
            })
        })

        this.workerVpc.selectSubnets({subnetGroupName: "worker-vpc-subnet-1a"})
            .subnets.forEach((subnet) => {
            new ec2.CfnRoute(this, "worker-to-lead-manager-route", {
                routeTableId: subnet.routeTable.routeTableId,
                destinationCidrBlock: "10.0.0.0/16",
                vpcPeeringConnectionId: peer.ref
            })
        })
    }
}
