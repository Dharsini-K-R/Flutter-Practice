import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
export const deployments = [
  {
    envId: 126,
    deployments: [
      {
        deploymentId: "126027",
        deploymentName: "New APP deployment",
      },
      {
        deploymentId: "126016",
        deploymentName: "New APP deployment 3",
      },
    ],
  },
  {
    envId: 118,
    deployments: [
      {
        deploymentId: "126029",
        deploymentName: "New APP deployment 2",
      },
    ],
  },
];

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
  serviceId: null,
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

export const applications = [
  {
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]: "NATS0",
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]: "NATS0",
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_VERSION]: "V2.1.9",
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]:
      "Amazon Web Services provides Information Technology infrastructure services to businesses in the form of web services",
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]:
      "https://d1q6f0aelx0por.cloudfront.net/product-logos/library-nats-logo.png",
  },
];

export const cloudVendor = { vendor: "aws", service: "eks" };

export const workflowData = [
  {
    name:
      "Process/cloudclapp-wf/Provision_Apps_EKS_Cluster/Process_Generate_Application_WF",
    displayName: "Restart APP",
    type: "UPDATE",
    visibility: 5,
    allowSchedule: null,
    tasks: null,
  },
  {
    name: "Process/cloudclapp-wf/Provision_Apps_EKS_Cluster/Process_Resume_APP",
    displayName: "Resume APP",
    type: "UPDATE",
    visibility: 5,
    allowSchedule: null,
    tasks: null,
  },
  {
    name: "Process/cloudclapp-wf/Provision_Apps_EKS_Cluster/Process_Pause_APP",
    displayName: "Pause APP",
    type: "UPDATE",
    visibility: 5,
    allowSchedule: null,
    tasks: null,
  },
];

export const userList = [
  {
    id: 130,
    baseRole: {
      id: 2,
      name: "Administrator",
    },
    externalReference: "NCLG130",
    login: "hto@openmsa.co",
    operator: {
      id: 33,
      abonnes: [],
      baseUrl: null,
      isPartner: false,
      name: "hto org 1103",
      prefix: "00u",
      address: {
        city: "",
        country: "",
        fax: "",
        mail: "",
        phone: "",
        streetName1: "",
        streetName2: "",
        streetName3: "",
        zipCode: "",
      },
      customersCount: 0,
      adminsCount: 0,
      managersCount: 0,
      externalReference: "hto org 1103",
    },
    acteurId: 495,
    address: {
      city: "",
      country: "",
      fax: null,
      mail: "hto@openmsa.co",
      phone: "",
      streetName1: "",
      streetName2: "",
      streetName3: "",
      zipCode: "",
    },
    delegationProfileId: 0,
    userType: 2,
    delegations: null,
    delegationsPerCustomer: {},
    netceloId: {
      ubiID: "00uG130",
      thePrefix: "00u",
      id: 130,
      customerPrefix: "00u",
    },
    isExternalAuth: false,
    activationKey: null,
    ccla: false,
    attachedCustomerIds: null,
    firstname: "",
    attachedOperatorIds: [33],
    manageAllUsers: false,
    name: "hto@openmsa.co",
    sort: "NAME",
    ldapAuthentication: false,
    delegationProfilePerCustomer: {},
  },
  {
    id: 125,
    baseRole: {
      id: 2,
      name: "Administrator",
    },
    externalReference: "NCLG125",
    login: "hto@openmsa.com",
    operator: {
      id: 29,
      abonnes: [],
      baseUrl: null,
      isPartner: false,
      name: "brand new hto org!",
      prefix: "00p",
      address: {
        city: "",
        country: "",
        fax: "",
        mail: "",
        phone: "",
        streetName1: "",
        streetName2: "",
        streetName3: "",
        zipCode: "",
      },
      customersCount: 0,
      adminsCount: 0,
      managersCount: 0,
      externalReference: "htoExtRef",
    },
    acteurId: 454,
    address: {
      city: "",
      country: "",
      fax: null,
      mail: "hto@openmsa.com",
      phone: "",
      streetName1: "",
      streetName2: "",
      streetName3: "",
      zipCode: "",
    },
    delegationProfileId: 0,
    userType: 2,
    delegations: null,
    delegationsPerCustomer: {},
    netceloId: {
      ubiID: "00pG125",
      thePrefix: "00p",
      id: 125,
      customerPrefix: "00p",
    },
    isExternalAuth: false,
    activationKey: null,
    ccla: false,
    attachedCustomerIds: null,
    firstname: "",
    attachedOperatorIds: [29],
    manageAllUsers: false,
    name: "hto@openmsa.com",
    sort: "NAME",
    ldapAuthentication: false,
    delegationProfilePerCustomer: {},
  },
];

export const monitoringGraph = [
  {
    id: "AVAILABILITY",
    name: "Availability",
    kpis: {
      latency: {
        color: "#24a36a",
        label: "Latency",
        id: "latency",
        suffix: "ms",
      },
      ttl: {
        color: "#0059a7",
        label: "TTL",
        id: "ttl",
      },
    },
    verticalLabel: "y",
    data: [
      {
        time: 1648485360000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648485600000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648485840000,
        latency: 0.25,
        ttl: 64,
      },
      {
        time: 1648486080000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648486320000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648486560000,
        latency: 2500,
        ttl: 64,
      },
      {
        time: 1648486800000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648487040000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648487280000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648487520000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648487760000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648488000000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648488240000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648488480000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648488720000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648488960000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648489200000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648489440000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648489680000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648489920000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648490160000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648490400000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648490640000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648490880000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648491120000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648491360000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648491600000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648491840000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648500240000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648500480000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648500720000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648500960000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648501200000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648501440000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648501680000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648501920000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648502160000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648502400000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648502640000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648502880000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648503120000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648503360000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648503600000,
        latency: 0.25,
        ttl: 64,
      },
      {
        time: 1648559520000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648559760000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648560000000,
        latency: 0,
        ttl: 64,
      },
      {
        time: 1648560240000,
        latency: 0.25,
        ttl: 64,
      },
      {
        time: 1648560480000,
        latency: 0,
        ttl: 64,
      },
    ],
  },
];
export const getEnvironmentResponse = [
  false,
  null,
  {
    envName: "hto env 01",
    envId: 144,
    envUbiqubeId: "00pA144",
    description: "2nd",
    cloudVendor: "Cloud/AWS",
    orgName: "htoExtRef",
    envIp: "127.0.0.1",
    envHostname: "temp-host",
    username: "12",
    envReference: "0419674e-a030-4fb9-b47a-94bcb8de6d0e",
    importFlag: false,
    serviceId: "126087",
    serviceName: null,
    envWFUri:
      "Process/cloudclapp-wf/Provision_an_EKS_Cluster__AWS_/Provision_an_EKS_Cluster__AWS_",
    appWFUri:
      "Process/cloudclapp-wf/Provision_Apps_EKS_Cluster/Provision_Apps_EKS_Cluster",
    deploymentCount: 49,
    userCount: 4,
    scanData: null,
    cclapOwner: 125,
    envEntityId: 323,
  },
  {
    "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
    connection: "close",
    "content-length": "576",
    "content-type": "application/json",
    date: "Wed, 23 Mar 2022 04:05:00 GMT",
    expires: "0",
    pragma: "no-cache",
    server: "nginx/1.21.6",
    vary: "Accept-Encoding",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-powered-by": "Express",
    "x-xss-protection": "1; mode=block",
    status: 200,
  },
  null,
];

export const environmentSummary = {
  environmentCount: 6,
  usersCount: 3,
  managerList: [
    {
      id: 142,
      baseRole: {
        id: 3,
        name: "Privileged Manager",
      },
      externalReference: "00pG142",
      login: "htoOrgPrivMan",
      operator: {
        id: 29,
        abonnes: [],
        baseUrl: null,
        isPartner: false,
        name: "brand new hto org!",
        prefix: "00p",
        address: {
          city: "",
          country: "",
          fax: "",
          mail: "",
          phone: "",
          streetName1: "",
          streetName2: "",
          streetName3: "",
          zipCode: "",
        },
        customersCount: 0,
        adminsCount: 0,
        managersCount: 0,
        externalReference: "htoExtRef",
      },
      acteurId: 515,
      address: {
        city: "",
        country: "",
        fax: null,
        mail: "hto@ubiqube.com",
        phone: "",
        streetName1: "",
        streetName2: "",
        streetName3: "",
        zipCode: "",
      },
      delegationProfileId: 0,
      userType: 2,
      delegations: null,
      delegationsPerCustomer: {},
      netceloId: {
        ubiID: "00pG142",
        thePrefix: "00p",
        id: 142,
        customerPrefix: "00p",
      },
      isExternalAuth: false,
      activationKey: null,
      ccla: false,
      attachedCustomerIds: [143, 144, 145, 151, 149, 150],
      firstname: "",
      attachedOperatorIds: null,
      manageAllUsers: true,
      name: "hto org priv man",
      sort: "NAME",
      ldapAuthentication: false,
      delegationProfilePerCustomer: {},
    },
    {
      id: 140,
      baseRole: {
        id: 4,
        name: "Manager",
      },
      externalReference: "00pG140",
      login: "htoOrgMan",
      operator: {
        id: 29,
        abonnes: [],
        baseUrl: null,
        isPartner: false,
        name: "brand new hto org!",
        prefix: "00p",
        address: {
          city: "",
          country: "",
          fax: "",
          mail: "",
          phone: "",
          streetName1: "",
          streetName2: "",
          streetName3: "",
          zipCode: "",
        },
        customersCount: 0,
        adminsCount: 0,
        managersCount: 0,
        externalReference: "htoExtRef",
      },
      acteurId: 511,
      address: {
        city: "",
        country: "",
        fax: null,
        mail: "hto@ubiqube.com",
        phone: "",
        streetName1: "",
        streetName2: "",
        streetName3: "",
        zipCode: "",
      },
      delegationProfileId: 0,
      userType: 2,
      delegations: null,
      delegationsPerCustomer: {},
      netceloId: {
        ubiID: "00pG140",
        thePrefix: "00p",
        id: 140,
        customerPrefix: "00p",
      },
      isExternalAuth: false,
      activationKey: null,
      ccla: false,
      attachedCustomerIds: [144],
      firstname: "",
      attachedOperatorIds: null,
      manageAllUsers: false,
      name: "hto org dev guy",
      sort: "NAME",
      ldapAuthentication: false,
      delegationProfilePerCustomer: {},
    },
    {
      id: 125,
      baseRole: {
        id: 2,
        name: "Administrator",
      },
      externalReference: "NCLG125",
      login: "hto@openmsa.com",
      operator: {
        id: 29,
        abonnes: [],
        baseUrl: null,
        isPartner: false,
        name: "brand new hto org!",
        prefix: "00p",
        address: {
          city: "",
          country: "",
          fax: "",
          mail: "",
          phone: "",
          streetName1: "",
          streetName2: "",
          streetName3: "",
          zipCode: "",
        },
        customersCount: 0,
        adminsCount: 0,
        managersCount: 0,
        externalReference: "htoExtRef",
      },
      acteurId: 454,
      address: {
        city: "",
        country: "",
        fax: null,
        mail: "hto@openmsa.com",
        phone: "",
        streetName1: "",
        streetName2: "",
        streetName3: "",
        zipCode: "",
      },
      delegationProfileId: 0,
      userType: 2,
      delegations: null,
      delegationsPerCustomer: {},
      netceloId: {
        ubiID: "00pG125",
        thePrefix: "00p",
        id: 125,
        customerPrefix: "00p",
      },
      isExternalAuth: false,
      activationKey: null,
      ccla: false,
      attachedCustomerIds: null,
      firstname: "",
      attachedOperatorIds: [29],
      manageAllUsers: false,
      name: "hto@openmsa.com",
      sort: "NAME",
      ldapAuthentication: false,
      delegationProfilePerCustomer: {},
    },
  ],
};


export const permissionProfiles = {
  environments: {
    general: {
      create: {
        name: 'create',
        access: false
      },
      tearDown: {
        name: 'tearDown',
        access: true
      },
      delete: {
        name: 'delete',
        access: false
      },
      access: true
    },

  },
  deployments: {
    general: {
      create: {
        name: 'create',
        access: true
      },
      action: {
        name: 'action',
        access: false
      },
      access: true
    },

  },
  applications: {
    dockerHub: {
      view: {
        name: 'view',
        access: true
      },
      access: true
    },
    virtualMachine: {
      view: {
        name: 'view',
        access: false
      },
      access: false
    },
    access: true
  },

  insights: {
    cost: {
      view: {
        name: 'view',
        access: true
      },
      access: true
    },
  },

  governance: {
    auditLogs: {
      view: {
        name: 'view',
        access: false
      },
      access: false
    },
  },
}
