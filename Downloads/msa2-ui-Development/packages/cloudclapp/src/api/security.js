import { getWorkflowInstances } from "msa2-ui/src/api/workflow";

import { SECURITY_VARIABLES_NAME } from "cloudclapp/src/Constants";
import Process from "msa2-ui/src/services/Process";
import { get, post } from "msa2-ui/src/api/request";
const API = process.env.REACT_APP_API_PATH;

export const getSecurityInstance = ({
  ubiqubeId,
  workflowPath,
  deploymentInstanceId,
  activeDeployments,
  token,
}) => {
  const addSecurityInstance = (response) => {
    const { instances = [], processes } = response;
    const activeInstances = activeDeployments
      ? instances.filter((instance) =>
          activeDeployments?.some(
            (deploymentId) =>
              deploymentId ===
              instance.variables[SECURITY_VARIABLES_NAME.SERVICE_ID],
          ),
        )
      : instances;
    const securityInstance = deploymentInstanceId
      ? activeInstances.find(
          ({ variables }) =>
            variables[SECURITY_VARIABLES_NAME.SERVICE_ID] ===
            deploymentInstanceId,
        )
      : activeInstances[0];
    const availableProcesses = processes.filter(({ type }) =>
      securityInstance ? !Process.isCreate(type) : Process.isCreate(type),
    );
    return { ...response, securityInstance, availableProcesses };
  };
  return getWorkflowInstances({
    ubiqubeId,
    workflowPath,
    sort: "lastupdated",
    sortOrder: "DESC",
    token,
    transforms: [addSecurityInstance],
  });
};

export const postImageScanRequest = ({
  isPrivateRegistry = false,
  containerName,
  token,
}) => {
  return post({
    url: `${API}/ccla/app/image/scan`,
    queryParams: {
      isPrivateRegistry,
    },
    body: {
      containerName,
      token: "11eee98f-b9e4-41d8-a28d-b8696e9179d8",
    },
    token,
  });
};

export const getScanResult = ({ scanId, token }) => {
  return get({
    url: `${API}/ccla/app/image/scan/status`,
    token,
    queryParams: {
      scanId,
    },
  });
};
