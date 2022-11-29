import { isEmpty } from "lodash";
export const getEnvironmentByDeploymentId = (environments, deploymentId) => {
  return environments?.find((env) => {
    return env.deployments?.find((dep) => dep.deploymentId === deploymentId);
  });
};

export const getDeploymentsCount = (environments) => {
  let count = 0
  environments.forEach(env => {
    if (!isEmpty(env.deployments)) {
      count += env.deployments.length
    }
  });
  return count
}