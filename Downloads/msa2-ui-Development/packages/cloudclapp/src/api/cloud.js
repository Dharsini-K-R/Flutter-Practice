import { get, post, put, destroy } from "msa2-ui/src/api/request";

const API = process.env.REACT_APP_API_PATH;

export const getCloudVendors = ({ token, transforms = [] }) => {
  return get({
    url: `${API}/ccla/cloud/vendors`,
    token,
    transforms,
  });
};

// https://10.31.1.52/swagger/#/cloud/connections/{orgId}
export const cloudConnectionSummary = ({ orgId, token }) => {
  return get({
    url: `${API}/ccla/cloud/connections/${orgId}`,
    token,
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20cloud%20vendors%20management/getCloudCredentialDetails
export const getCloudConnection = ({
  operatorPrefix,
  vendor,
  connectionName,
  transforms = [],
  token,
}) => {
  return get({
    url: `${API}/ccla/cloud/connections/${operatorPrefix}/${vendor}/${connectionName}`,
    token,
    transforms,
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20cloud%20vendors%20management/createCloudConnection
export const createCloudConnection = ({
  orgId,
  vendor,
  connectionName,
  credentials,
  token,
}) => {
  return post({
    url: `${API}/ccla/cloud/connections/${orgId}/${vendor}`,
    // Note: for the current version, there will be always one connection per cloud
    body: [{ connectionName, credentials }],
    token,
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20cloud%20vendors%20management/updateCloudConnection
export const updateCloudConnection = ({
  orgId,
  vendor,
  connectionName,
  credentials,
  token,
}) => {
  return put({
    url: `${API}/ccla/cloud/connections/${orgId}/${vendor}/${connectionName}`,
    body: { credentials },
    token,
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20cloud%20vendors%20management/deleteCloudConnection
export const deleteCloudConnection = ({
  orgId,
  vendor,
  connectionName,
  token,
}) => {
  return destroy({
    url: `${API}/ccla/cloud/connections/${orgId}/${vendor}/${connectionName}`,
    token,
  });
};
