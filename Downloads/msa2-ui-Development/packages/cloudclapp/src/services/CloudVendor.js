import flatten from "lodash/flatten";

export const getServiceFromEnvironment = (environment = {}, cloudVendors) =>
  cloudVendors[environment.cloudVendor]?.services[environment.cloudService] ??
  {};

export const getWFUrisFromEnvironment = (environment = {}, cloudVendors) => {
  const service = getServiceFromEnvironment(environment, cloudVendors);
  const envWFUri = service.workflow?.env ?? environment.envWFUri;
  const appWFUri = service.workflow?.appsDeployment ?? environment.appWFUri;

  // Only for CCLA v1.0 has an wf path in environment object, otherwise get it from cloudVendors object
  const oldService = Object.values(
    cloudVendors[environment.cloudVendor]?.services ?? {},
  ).find((service) => service.workflow.env === envWFUri);

  const scanApp = service.workflow?.scanApp ?? oldService?.workflow.scanApp;
  const scanWebApp =
    service.workflow?.scanWebApp ?? oldService?.workflow.scanWebApp;
  return { envWFUri, appWFUri, scanApp, scanWebApp };
};

export const getCloudVendorServices = (cloudVendors = {}) => {
  const services = [];
  Object.keys(cloudVendors).forEach((cloudVendorName) => {
    Object.keys(cloudVendors[cloudVendorName]?.services).forEach(
      (cloudServiceName) => {
        services.push({
          ...(cloudVendors[cloudVendorName]?.services[cloudServiceName] || {}),
          cloudServiceName,
          cloudVendorName,
        });
      },
    );
  });
  return services;
};

export const getFlattenedServices = (cloudVendors) =>
  flatten(
    Object.values(cloudVendors).map(({ services }) => Object.values(services)),
  );

export const getServiceFromWFPath = (workflowPath, cloudVendors) => {
  let path = "";
  Object.entries(cloudVendors).forEach(([, { services }]) =>
    Object.entries(services).forEach(([, { workflow, logo }]) => {
      if (Object.values(workflow).includes(workflowPath)) {
        path = logo;
      }
    }),
  );
  return path;
};

export const getServicesByImageType = (
  cloudVendor = {},
  imageType = "docker",
) => {
  const services = [];
  Object.keys(cloudVendor?.services || {}).forEach((cloudServiceName) => {
    const service = cloudVendor?.services[cloudServiceName];
    if (service.imageType === imageType) {
      services.push(service);
    }
  });
  return services;
};

export default {
  getServiceFromEnvironment,
  getWFUrisFromEnvironment,
  getCloudVendorServices,
  getServiceFromWFPath,
  getFlattenedServices,
  getServicesByImageType,
};
