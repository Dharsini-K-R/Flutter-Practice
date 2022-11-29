import { get, post, put, destroy } from "msa2-ui/src/api/request";

const API = process.env.REACT_APP_API_PATH;

// https://10.31.1.5/swagger/#/Operator/getTenantVariables
export const getTagDetails = ({ orgId, token }) => {
  return get({
    url: `${API}/operator/id/${orgId}/variables`,
    token,
  });
};

// https://10.31.1.5/swagger/#/Operator/updateOperatorName_1
export const createTag = ({ orgId, token, data }) => {
  return post({
    url: `${API}/operator/id/${orgId}/variables`,
    token,
    body: [{ name: "CLOUDCLAPP_TAGS", value: data }],
  });
};

// https://10.31.1.5/swagger/#/Operator/updateOperatorVariable
export const updateTag = ({ orgId, token, data }) => {
  return put({
    url: `${API}/operator/id/${orgId}/variables`,
    token,
    body: [{ name: "CLOUDCLAPP_TAGS", value: data }],
  });
};

// https://10.31.1.5/swagger/#/Operator/deleteGlobalConfigurationVariable
export const deleteTag = ({ orgId, token, name }) => {
  return destroy({
    url: `${API}/operator/id/${orgId}/variables`,
    queryParams: {
      variableName: name,
    },
    token,
  });
};
