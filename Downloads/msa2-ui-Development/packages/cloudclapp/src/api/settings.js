import { get } from "msa2-ui/src/api/request";
import { editTenant, deleteTenant } from "msa2-ui/src/api/tenant";

const currentMsaVersion = process.env.REACT_APP_MSA_VERSION;

/**
 * Adds the current UI commit hash so it's easier to track what the currently
 * deployed version is
 * @param {object} response
 */
const addUiHash = (response) => ({
  ...response,
  uiVersion: currentMsaVersion ?? "Development",
});

/*
 * No Swagger doc exists, this is hosted directly on the front container
 */
export const getSystemVersion = () => {
  return get({
    /**
     * The trailing slash here is very important for local proxying
     * If it is not there, the front nginx container will redirect you
     * which will bring up all sorts of CORs issues
     */
    url: `/ccla_version/`,
    transforms: [addUiHash],
  });
};

export const editOrganisationName = ({token, name, prefix}) => {
  return editTenant({token, name, prefix});
}

export const deleteOrganisation = ({token, prefix}) => {
  return deleteTenant({token, prefix});
}
