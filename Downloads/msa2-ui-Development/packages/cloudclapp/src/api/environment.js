import { get, post, destroy, put } from "msa2-ui/src/api/request";
import Repository from "msa2-ui/src/services/Repository";

const API = process.env.REACT_APP_API_PATH;

export const createEnvironment = ({ body, token }) => {
  const {
    name,
    description,
    cloudVendor,
    cloudService,
    ipAddress,
    dnsEntry,
    newRootUsername,
    password,
    activation,
    productionEnvironment,
    orgName = "",
    importFlag = false,
    envWFUri,
    appWFUri,
  } = body;

  return post({
    url: `${API}/ccla/environment/create`,
    body: {
      envName: name,
      description,
      cloudVendor,
      cloudService,
      orgName,
      envIp: ipAddress,
      envHostname: dnsEntry,
      username: newRootUsername,
      password,
      isActivate: activation,
      isProduction: productionEnvironment,
      importFlag,
      envWFUri: Repository.addExtension(envWFUri, "xml"),
      appWFUri: Repository.addExtension(appWFUri, "xml"),
    },
    token,
  });
};

export const createEnvironmentFromBlueprint = ({
  body,
  token,
  blueprintPath,
}) => {
  const { name, description, productionEnvironment, orgName = "" } = body;

  return post({
    url: `${API}/ccla/environment/create`,
    queryParams: {
      blueprintPath,
    },
    body: {
      envName: name,
      description,
      orgName,
      isProduction: productionEnvironment,
    },
    token,
  });
};

// temporary function to remove extension from wf path.
// API should accept wf without extension in create environment
const removeExtension = (response) => ({
  ...response,
  envWFUri: Repository.stripFileExtensionFromString(response.envWFUri),
  appWFUri: Repository.stripFileExtensionFromString(response.appWFUri),
});

// https://10.31.1.52/swagger/#/CCLAP%20Environment%20management/getEnvironment
export const getEnvironment = ({ envId, token, transforms = [] }) => {
  return get({
    url: `${API}/ccla/environment/${envId}`,
    token,
    transforms: [removeExtension],
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20Environment%20management/deleteEnvironmentById
export const deleteEnvironment = ({ envId, token }) => {
  return destroy({
    url: `${API}/ccla/environment/${envId}`,
    token,
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20Environment%20management/getEnvironmentList
export const listEnvironment = ({ orgId, token, transforms = [] }) => {
  return get({
    url: `${API}/ccla/environment/list/${orgId}`,
    token,
    transforms,
  });
};

// https://10.31.1.52/swagger/#/ccla/environment/summary/{orgId}
export const readEnvironmentSummary = ({ orgId, token }) => {
  return get({
    url: `${API}/ccla/environment/summary/${orgId}`,
    token,
  });
};

// https://10.31.1.52/swagger/#/ccla/environment/update-owner/${envId}
export const changeOwner = ({ token, envId, ownerId }) => {
  return put({
    url: `${API}/ccla/environment/update-owner/${envId}?ownerId=${ownerId}`,
    token,
  });
};

//https://10.31.1.52/swagger/#/Lookup/getUsers
export const getUsersBySubtenant = ({ token, subtenantId }) => {
  return get({
    url: `${API}/lookup/v1/users/${subtenantId}`,
    token,
  });
};
