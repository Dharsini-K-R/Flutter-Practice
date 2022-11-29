import { createSlice } from "@reduxjs/toolkit";
import flattenDeep from "lodash/flattenDeep";
import { set } from "idb-keyval";
import uniq from "lodash/uniq";
import isEqual from "lodash/isEqual";

import { userRoles, getUserRole } from "cloudclapp/src/store/auth";

import { getWorkflow } from "msa2-ui/src/api/workflow";
import { getImage } from "msa2-ui/src/api/repository";
import {
  listEnvironment,
  readEnvironmentSummary,
} from "cloudclapp/src/api/environment";
import { getTags } from "cloudclapp/src/api/cost";
import {
  getCloudVendors as readCloudVendors,
  cloudConnectionSummary,
} from "cloudclapp/src/api/cloud";
import { getTenantsByManager } from "msa2-ui/src/api/tenant";
import { getPermissionProfileById } from "msa2-ui/src/api/permissionProfiles";

import CloudVendor from "cloudclapp/src/services/CloudVendor";

export const initialState = {
  ready: false,
  organisation: {},
  environments: [],
  tags: [],
  cloudVendors: {},
  environmentSummary: {},
  workflows: {},
  organisationList: [],
  connectionSummary: [],
  permissions: [],
};
const designationsSlice = createSlice({
  name: "designations",
  initialState,
  reducers: {
    setDesignationsReady(state, action) {
      state.ready = true;
    },
    setOrganisation(state, action) {
      state.organisation = action.payload;
    },
    setEnvironments(state, action) {
      state.environments = action.payload;
    },
    setTags(state, action) {
      state.tags = action.payload;
    },
    setCloudVendors(state, action) {
      state.cloudVendors = action.payload;
    },
    setConnectionSummary(state, action) {
      state.connectionSummary = action.payload;
    },
    setEnvironmentSummary(state, action) {
      state.environmentSummary = action.payload;
    },
    setWorkflows(state, action) {
      const { workflowUri, workflow } = action.payload;
      state.workflows[workflowUri] = workflow;
    },
    setOrganisationList(state, action) {
      state.organisationList = action.payload;
    },
    resetOrganisation(state) {
      state.organisation = initialState.organisation;
      state.environments = initialState.environments;
      state.tags = initialState.tags;
      state.environmentSummary = initialState.environmentSummary;
      state.connectionSummary = initialState.connectionSummary;
    },
    clearEnvironments(state) {
      state.environments = [];
    },
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
  },
  extraReducers: {
    // We have to use the string directly here because if
    // we import the auth module we get a circular dependency
    "auth/logout": () => {
      return initialState;
    },
  },
});

export const getDesignationsReady = ({ designations }) => designations.ready;

export const getOrganisation = ({ designations }) => designations.organisation;

export const getOrganisationId = ({ designations }) =>
  designations.organisation.id;

export const getOrganisationName = ({ designations }) =>
  designations.organisation.name;

export const getEnvironmentById = (id) => ({ designations }) =>
  designations.environments.find(({ envId }) => envId === id);

export const getEnvironments = (cloudVendor) => (states) => {
  const { designations } = states;
  if (cloudVendor) {
    return designations.environments.filter(
      (environment) => environment.cloudVendor === cloudVendor,
    );
  }
  return designations.environments;
};

export const get_Tags = ({ designations }) => designations.tags;

export const getAvailableOrganisations = ({ designations }) =>
  designations.organisationList;

export const isMultiOrg = ({ designations }) =>
  designations.organisationList && designations.organisationList.length > 1;

export const getCloudVendors = ({ designations }) => designations.cloudVendors;
export const getConnectionSummary = ({ designations }) =>
  designations.connectionSummary;

export const getServiceFromEnvironment = (environment = {}) => ({
  designations,
}) =>
  CloudVendor.getServiceFromEnvironment(environment, designations.cloudVendors);

export const getEnvironmentSummary = ({ designations }) =>
  designations.environmentSummary;

export const getPermissions = ({ designations }) => designations.permissions;

export const getAccessibility = (permissions, path = "", role) => {
  if (role !== userRoles.MANAGER) {
    return true;
  }
  const categories = path.split(".");
  const permission = permissions.find(
    ({ categoryName, subCategoryName, actionName }) =>
      categoryName === categories[0] &&
      subCategoryName === categories[1] &&
      actionName === categories[2],
  );
  return permission?.right ?? false;
};

export const getPermission = (category, subCategory, action) => (state) => {
  const {
    designations: { permissions },
  } = state;
  const role = getUserRole(state);
  return getAccessibility(
    permissions,
    [category, subCategory, action].join("."),
    role,
  );
};

export const getUserList = ({ designations }) =>
  designations.environmentSummary?.managerList;

export const getUserById = (value, key = "id") => ({ designations }) => {
  const managerList = designations.environmentSummary?.managerList ?? [];
  return managerList.find((manager) => manager[key] === value);
};

export const getWorkflows = ({ designations }) => designations.workflows;

export const getWorkflowByUri = (workflowUri) => ({ designations }) =>
  designations.workflows[workflowUri];

export const fetchTags = async (dispatch, getState) => {
  const state = getState();

  const {
    auth: { token },
    designations: { environments },
  } = state;

  const serviceIds = environments
    .map(({ serviceId }) => serviceId)
    .filter((serviceId) => Boolean(serviceId));

  if (!serviceIds.length) {
    return [];
  }

  const [error, tags] = await getTags({
    serviceIds,
    token,
  });
  if (error) {
    return [];
  }

  if (tags !== undefined) {
    tags.forEach((o, i) => (o.id = i + 1));
  }

  dispatch(setTags(tags));

  return tags;
};

export const fetchEnvironments = async (dispatch, getState) => {
  const state = getState();
  const {
    auth: { token },
    designations: { environments },
  } = state;

  const orgId = getOrganisationId(state);
  if (!orgId) {
    return [];
  }

  const [error, fetchedEnvironments] = await listEnvironment({ orgId, token });
  if (error) {
    return [];
  }
  if (!isEqual(fetchedEnvironments, environments)) {
    dispatch(setEnvironments(fetchedEnvironments));
    dispatch(fetchTags)
  }
  return environments;
};

export const fetchCloudVendors = async (dispatch, getState) => {
  const state = getState();
  const {
    auth: { token },
  } = state;

  const [error, cloudVendors] = await readCloudVendors({
    token,
    transforms: [],
  });
  if (error) {
    return [];
  }

  dispatch(setCloudVendors(cloudVendors));
  // Fetch logo and cache them
  // await is not needed as it should be async
  const logoUrls = flattenDeep(
    Object.values(cloudVendors).map(({ logo, services }) => [
      logo,
      Object.values(services).map(({ logo }) => logo),
    ]),
  );

  Promise.all(logoUrls.map((path) => getImage({ token, path }))).then(
    (responses) => {
      responses.forEach(([, { blob }], i) => {
        set(logoUrls[i], blob);
      });
    },
  );

  return cloudVendors;
};

export const fetchConnectionSummary = async (dispatch, getState) => {
  const state = getState();
  const {
    auth: { token },
  } = state;

  const orgId = getOrganisationId(state);

  const [error, connectionSummary] = await cloudConnectionSummary({
    orgId,
    token,
  });
  if (error) {
    return [];
  }

  dispatch(setConnectionSummary(connectionSummary));
  return connectionSummary;
};

export const fetchEnvironmentSummary = async (dispatch, getState) => {
  const state = getState();
  const {
    auth: { token },
    designations: { environmentSummary },
  } = state;

  const orgId = getOrganisationId(state);
  if (!orgId) {
    return [];
  }
  const [error, response] = await readEnvironmentSummary({
    orgId,
    token,
  });
  if (error) {
    return [];
  }

  if (!isEqual(response, environmentSummary)) {
    dispatch(setEnvironmentSummary(response));
  }

  return response;
};

export const fetchWorkflows = (workflowPaths = []) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const {
    auth: { token },
    designations: { workflows },
  } = state;

  const workflowUris = uniq(workflowPaths);
  const responses = await Promise.all(
    workflowUris.map((workflowUri) =>
      getWorkflow({
        pathToWorkflowDefinitionFile: decodeURIComponent(workflowUri),
        addServiceName: true,
        token,
      }),
    ),
  );
  responses.forEach(([error, response], i) => {
    if (!error) {
      const workflowUri = workflowUris[i];
      const workflow = workflows[workflowUri];
      if (!isEqual(response, workflow)) {
        dispatch(setWorkflows({ workflowUri, workflow: response }));
      }
    }
  });

  return responses;
};

export const fetchOrganisationList = () => async (dispatch, getState) => {
  const { auth = {}, designations = {} } = getState();
  const { token, userDetails } = auth;
  const { organisationList } = designations;

  const [error, response] = await getTenantsByManager({
    token,
    managerId: userDetails?.id,
    transforms: [(response) => response.filter((tenant) => tenant.cclatenant)],
  });
  if (!response || isEqual(response, organisationList) || error) {
    return;
  }
  if (response) {
    dispatch(setOrganisationList(response));
  }

  if (response.length > 0) {
    const organisation = response.find(
      ({ id }) => designations.organisation.id === id,
    );
    if (organisation) {
      // If there is current organisation in the list, update it if info is changed
      if (!isEqual(response, organisation)) {
        dispatch(setOrganisation(organisation));
      }
    } else {
      // If there is no organisation found (initial call or deleted), set the first org
      dispatch(setOrganisation(response[0]));
    }
  }

  return response;
};

export const fetchPermissionProfiles = async (dispatch, getState) => {
  const { auth = {} } = getState();
  const { token, userDetails } = auth;
  if (
    userDetails.delegationProfileId &&
    userDetails.delegationProfileId !== 0
  ) {
    const [error, response] = await getPermissionProfileById({
      id: userDetails.delegationProfileId,
      token,
    });

    if (!response || error) {
      return;
    }
    const { permissionList } = response;
    if (permissionList) {
      dispatch(setPermissions(permissionList));
    }
    return permissionList;
  }
  return {};
};

export const fetchDesignations = () => async (dispatch, getState) => {
  await Promise.all([
    dispatch(fetchOrganisationList()),
    dispatch(fetchCloudVendors),
  ]);
  const state = getState();
  //fetchOrganisation is removed as fetchOrganisationList performs the same operation
  await dispatch(fetchEnvironmentSummary);
  await dispatch(fetchConnectionSummary);
  await dispatch(fetchPermissionProfiles);
  // This should come after fetchOrganisationList as it needs orgId
  dispatch(setDesignationsReady());
  // The calls below can come after logging in

  const cloudVendors = getCloudVendors(state);
  const workflowUris = flattenDeep(
    Object.values(cloudVendors).map(({ services = {} }) =>
      Object.values(services || {}).map(({ workflow }) =>
        Object.values(workflow || {}),
      ),
    ),
  ).filter((uri) => Boolean(uri));
  // todo: might need change the timing to fetch workflows when we get huge cloud vendor list.
  dispatch(fetchWorkflows(workflowUris));
};

export const {
  setDesignationsReady,
  setOrganisation,
  setEnvironments,
  setTags,
  setCloudVendors,
  setConnectionSummary,
  setEnvironmentSummary,
  setWorkflows,
  setOrganisationList,
  clearEnvironments,
  resetOrganisation,
  setPermissions,
} = designationsSlice.actions;
export default designationsSlice.reducer;
