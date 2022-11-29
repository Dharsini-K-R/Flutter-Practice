import { get, put, post } from "msa2-ui/src/api/request";
const API = process.env.REACT_APP_API_PATH;

// https://10.31.1.5/swagger/#/Repository/listBlueprints
export const getBluePrints = ({ token, orgId }) => {
  return get({
    url: `${API}/repository/ccla/blueprints`,
    token,
    queryParams: {
      orgId,
    },
  });
};

// https://10.31.1.5/swagger/#/Repository/addBlueprint
export const createBluePrint = ({
  name,
  blueprintPath,
  designPreviewPath,
  description = "",
  tags = [],
  tfPathForEnv = "",
  tfPathForApp = "",
  content = "",
  type = "",
  providers = [],
  applications = [],
  compliances = [],
  token,
}) => {
  return post({
    url: `${API}/repository/ccla/blueprint`,
    body: {
      name,
      blueprintPath,
      designPreviewPath,
      description,
      tags,
      tfPathForEnv,
      tfPathForApp,
      content,
      type,
      providers,
      applications,
      compliances,
    },
    token,
  });
};

// https://10.31.1.5/swagger/#/Repository/addBlueprint
export const updateBluePrint = ({
  name,
  blueprintPath,
  designPreviewPath,
  description = "",
  tags = [],
  tfPathForEnv = "",
  tfPathForApp = "",
  content = "",
  type = "",
  providers = [],
  applications = [],
  compliances = [],
  token,
}) => {
  return put({
    url: `${API}/repository/ccla/blueprint`,
    body: {
      name,
      blueprintPath,
      designPreviewPath,
      description,
      tags,
      tfPathForEnv,
      tfPathForApp,
      content,
      type,
      providers,
      applications,
      compliances,
    },
    token,
  });
};

// TODO
export const saveBluePrint = () => {};
// TODO
export const deleteBluePrint = () => {};
