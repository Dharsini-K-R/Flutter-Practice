export const organisation = [
  { environmentCount: 20, usersCount: 1, prefix: "00p" },
];

export const environments = [
  {
    status: "Critical",
    version: "V1.1.1",
    user: "Bib Dev",
    env: "Development",
    envData:
      "Development Environment for all new projects and major updates. Nginx and PHP added to the Environment",
    deplymentCount: "2",
    cost: "58.2",
  },
];

export const cloudVendors = {
  aws: {
    displayName: "AWS",
    category: "Public Cloud",
    logo: "Process/cloudclapp-wf/CCLA_Adapters/logos/aws.logo",
    credentials_required: ["aws_access_key", "aws_secret_key"],
    services: {
      eks: {
        displayName: "Elastic Container Service for Kubernetes",
        logo: "Process/cloudclapp-wf/CCLA_Adapters/logos/aws_eks.logo",
        workflow: {
          env:
            "Process/cloudclapp-wf/Provision_an_EKS_Cluster__AWS_/Provision_an_EKS_Cluster__AWS_",
          appsDeployment:
            "Process/cloudclapp-wf/Provision_Apps_EKS_Cluster/Provision_Apps_EKS_Cluster",
          scanApp:
            "Process/cloudclapp-wf/Scan_a_App_Container_/Scan_a_App_Container_",
        },
      },
    },
  },
  azure: {
    displayName: "AZURE",
    category: "Public Cloud",
    logo: "Process/cloudclapp-wf/CCLA_Adapters/logos/azure.logo",
    credentials_required: ["azure_client_id", "azure_client_secret"],
    services: {
      aks: {
        displayName: "Azure Kubernetes Service",
        logo: "Process/cloudclapp-wf/CCLA_Adapters/logos/azure_aks.logo",
        workflow: {
          env:
            "Process/cloudclapp-wf/Provision_an_AKS_Cluster__AZURE_/Provision_an_AKS_Cluster__AZURE_",
          appsDeployment:
            "Process/cloudclapp-wf/Provision_an_AKS_Apps__AZURE_/Provision_an_AKS_Apps__AZURE_",
          scanApp:
            "Process/cloudclapp-wf/Scan_a_App_Container_/Scan_a_App_Container_",
        },
      },
    },
  },
  gcp: {
    displayName: "Google Cloud Platform",
    category: "Public Cloud",
    logo: "Process/cloudclapp-wf/CCLA_Adapters/logos/gcp.logo",
    credentials_required: [
      "gcp_service_account_email",
      "gcp_private_key_id",
      "gcp_private_key",
      "gcp_client_id",
    ],
    services: {
      gke: {
        displayName: "Google Kubernetes Engine",
        logo: "Process/cloudclapp-wf/CCLA_Adapters/logos/gcp_gke.logo",
        workflow: {
          env:
            "Process/cloudclapp-wf/Provision_an_GKE_Cluster__GCP_/Provision_an_GKE_Cluster__GCP_",
          appsDeployment:
            "Process/cloudclapp-wf/Provision_Apps_GKE_Cluster/Provision_Apps_GKE_Cluster",
          scanApp:
            "Process/cloudclapp-wf/Scan_a_App_Container_/Scan_a_App_Container_",
        },
      },
    },
  },
};
