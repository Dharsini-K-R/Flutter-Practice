import ManagedEntity from "msa2-ui/src/services/ManagedEntity";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";

const buildDefaultContext = ({ prefix, entityId }) => {
  if (!prefix || !entityId) return {};

  // Sets ME id as a initial context
  return {
    [DEPLOYMENT_VARIABLES_NAME.ENVIRONMENT_MANAGED_ENTITY]: ManagedEntity.buildUbiId(
      prefix,
      entityId,
    ),
  };
};

const findById = (environment = {}, deploymentId) =>
  environment.deployments?.find(
    (deployment) => deployment.deploymentId === deploymentId,
  );

export default { buildDefaultContext, findById };
