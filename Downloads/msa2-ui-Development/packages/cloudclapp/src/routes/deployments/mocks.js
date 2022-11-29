import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";

export const environments = [
  {
    envName: "Development",
    envId: 99,
    envReference: "68cee9b1-9226-4fdd-a4be-0e1e57977139",
    status: "OK",
    cclapOwner: 0,
    deployments: [
      {
        deploymentId: "126016",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "RUNNING",
      },
      {
        deploymentId: "126088",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "FAIL",
      },
      {
        deploymentId: "126018",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "ENDED",
      },
    ],
    envEntityId: 288,
  },
  {
    envName: "QA",
    envId: 118,
    envReference: "fd8016e0-d367-4179-956e-3f5f35a8d764",
    status: "NEVERREACHED",
    cclapOwner: 105,
    deployments: [
      {
        deploymentId: "126019",
        deploymentName: "Dev_My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "RUNNING",
      },
      {
        deploymentId: "126020",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "FAIL",
      },
      {
        deploymentId: "126021",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "ENDED",
      },
    ],
    envEntityId: 289,
  },
  {
    envName: "Staging",
    envId: 119,
    envReference: "fd8016e0-d367-4179-956e-3f5f35a8d764",
    status: "NEVERREACHED",
    cclapOwner: 105,
    deployments: [
      {
        deploymentId: "126022",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "RUNNING",
      },
      {
        deploymentId: "126023",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "FAIL",
      },
      {
        deploymentId: "126024",
        deploymentName: "My_Big_Shop_Test_4",
        deploymentUser: "test-user",
        status: "ENDED",
      },
    ],
    envEntityId: 289,
  },
];

export const applications = {
  [DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]: "NATS0",
  [DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]: "NATS0",
  [DEPLOYMENT_VARIABLES_NAME.APPLICATION_VERSION]: "V2.1.9",
  [DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]:
    "Amazon Web Services provides Information Technology infrastructure services to businesses in the form of web services",
  [DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]:
    "https://d1q6f0aelx0por.cloudfront.net/product-logos/library-nats-logo.png",
};

export const environment = {
  envName: "hto env 24",
  envId: 126,
  envUbiqubeId: "005A126",
  description: "aslkd adsg aslgd ll",
  cloudVendor: "aws",
  cloudService: "eks",
  orgName: "hto Org extRef",
  envIp: "127.0.0.1",
  envHostname: "temp-host",
  username: "a",
  envReference: "88faa4e6-be22-444f-a085-e362273d76af",
  importFlag: false,
  serviceId: "123",
  serviceName: "Env",
  envWFUri:
    "Process/cloudclapp-wf/Provision_an_EKS_Cluster__AWS_/Provision_an_EKS_Cluster__AWS_",
  appWFUri:
    "Process/cloudclapp-wf/Provision_an_EKS_Apps__AWS_/Provision_an_EKS_Apps__AWS_",
  deploymentCount: 1,
  userCount: 1,
  scanData: null,
  cclapOwner: 105,
  envEntityId: 306,
  status: "Completed",
};
