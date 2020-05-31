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

        this.leadManagerVpc = new ec2.Vpc(this, 'LeadManagerVpc', {
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

        const leadManagerSecGroup = new ec2.SecurityGroup(this, 'LeadManagerSecurityGroup', {
            securityGroupName: 'lead-manager-security-group',
            vpc: this.leadManagerVpc,
            description: 'Lead manager vpc security group'
        });
        leadManagerSecGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());


        this.workerVpc = new ec2.Vpc(this, 'WorkerVpc', {
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

        const workerSecGroup = new ec2.SecurityGroup(this, 'WorkerSecurityGroup', {
            securityGroupName: 'worker-security-group',
            vpc: this.workerVpc,
            description: 'Worker vpc security group'
        });
        workerSecGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());

        const peer = new ec2.CfnVPCPeeringConnection(this, 'LeadManagerWorkerPeer', {
            vpcId: this.leadManagerVpc.vpcId,
            peerVpcId: this.workerVpc.vpcId
        })

        this.leadManagerVpc.selectSubnets({subnetGroupName: "LeadManagerVpcSubnet1a"})
            .subnets.forEach((subnet) => {
            new ec2.CfnRoute(this, "lead-manager-to-worker-route", {
                routeTableId: subnet.routeTable.routeTableId,
                destinationCidrBlock: "10.1.0.0/16",
                vpcPeeringConnectionId: peer.ref
            })
        })

        this.workerVpc.selectSubnets({subnetGroupName: "WorkerVpcSubnet1a"})
            .subnets.forEach((subnet) => {
            new ec2.CfnRoute(this, "WorkerToLeadManagerRoute", {
                routeTableId: subnet.routeTable.routeTableId,
                destinationCidrBlock: "10.0.0.0/16",
                vpcPeeringConnectionId: peer.ref
            })
        })
    }
}

export class EC2Setup extends cdk.Construct {

    readonly leadManagerInstance: ec2.Instance
    readonly workerInstance: ec2.Instance

    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        this.leadManagerInstance = new ec2.Instance(this, 'LeadManagerInstance', {})
    }
}
