import { createSlice } from "@reduxjs/toolkit";
import set from "lodash/set";
import i18n from "cloudclapp/src/localisation/i18n";
import { getOrganisationId } from "./designations";
import {
  checkRepositoryExistence,
  readRepository,
} from "msa2-ui/src/api/repository";
import { DASHBOARD_EDIT_DROPDOWN } from "cloudclapp/src/Constants";
import { isEmpty } from "lodash";

import { logout } from "./auth";

export const SETTINGS = {
  language: {
    label: i18n.t("Language"),
    type: "text",
    options: ["en", "jp"],
    defaultValue: "en",
    onChange: (lng) => {
      i18n.changeLanguage(lng);
    },
  },
  tableRows: {
    label: i18n.t("Table Rows"),
    type: "number",
    options: [10, 25, 50],
    applicationsDockerhub: {
      label: i18n.t("Dockerhub"),
    },
    deploymentLogs: {
      label: i18n.t("Deployment Logs"),
    },
    environmentLogs: {
      label: i18n.t("Environment Logs"),
    },
  },
};

const initialValues = Object.entries(SETTINGS).reduce((acc, [key, value]) => {
  const subObject = Object.entries(value).reduce(
    (acc, [subKey, { label, defaultValue, options }]) => {
      return label
        ? {
            ...acc,
            [subKey]:
              defaultValue ??
              options?.[0] ??
              value.defaultValue ??
              value.options?.[0],
          }
        : acc;
    },
    {},
  );

  return Object.values(value).every(({ label }) => !label)
    ? { ...acc, [key]: value.defaultValue ?? value.options?.[0] }
    : { ...acc, [key]: subObject };
}, {});

export const initialState = {
  ...initialValues,
  appTheme: 0,
  uiSettings: {},
};

const settings = createSlice({
  name: "Settings",
  initialState,
  reducers: {
    initializeSettings(state, action) {
      const { key, value } = action.payload;
      set(state, key, { ...state[key], ...value });
    },
    changeSettings(state, action) {
      set(state, action.payload.key, action.payload.value);
    },
    changeTableRowsSetting(state, action) {
      state.tableRows[action.payload.table] = action.payload.numberOfRows;
    },
    changeLanguage(state, action) {
      state.language = action.payload;
      SETTINGS.language.onChange(action.payload);
    },
    setUISettings(state, action) {
      state.uiSettings = action.payload;
    },
  },
  extraReducers: {
    [logout]: () => {
      return initialState;
    },
  },
});

export const getSettings = ({ settings }) => settings;

export const getAppTheme = ({ settings }) => settings.appTheme;

export const getTableRowsSetting = (type) => ({ settings }) =>
  settings.tableRows[type];

export const getLanguage = ({ settings }) => settings.language;

export const getUISettings = ({ settings }) => settings.uiSettings;

export const fetchUISettings = async (dispatch, getState) => {
  dispatch(setUISettings({}));
  const state = getState();
  const {
    auth: {
      token,
      userDetails: { id },
    },
  } = state;

  const orgId = getOrganisationId(state);
  if (!orgId) {
    return [];
  }

  const content = {
    dashboardView: DASHBOARD_EDIT_DROPDOWN.APP,
  };

  const [, fetchedIfExists] = await checkRepositoryExistence({
    uri: `Datafiles/ccla_dashboard/${orgId}_${id}`,
    token,
  });

  if (fetchedIfExists) {
    const [, fetchedSettings] = await readRepository({
      uri: `Datafiles/ccla_dashboard/${orgId}_${id}`,
      token,
    });
    if (!isEmpty(fetchedSettings.content)) {
      dispatch(setUISettings(fetchedSettings.content));
      return null;
    }
  }

  dispatch(setUISettings(content));

  return null;
};

export const {
  initializeSettings,
  changeSettings,
  changeTableRowsSetting,
  changeLanguage,
  setUISettings,
} = settings.actions;

export default settings.reducer;
