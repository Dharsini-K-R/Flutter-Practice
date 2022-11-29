import { createSlice } from "@reduxjs/toolkit";
import { login } from "msa2-ui/src/api/auth";
import { fetchDesignations } from "./designations";
import { userRoles } from "msa2-ui/src/Constants";
export { userRoles, rootUser } from "msa2-ui/src/Constants";

export const roles = [
  {
    id: 1,
    name: "Super Administrator",
  },
  {
    id: 2,
    name: "Administrator",
  },
  {
    id: 3,
    name: "Privileged Manager",
  },
  {
    id: 4,
    name: "Manager",
  },
];

export const initialState = {
  token: "",
  isAuth: false,
  hasError: false,
  errorMessage: null,
  userDetails: {
    baseRole: {
      id: null,
    },
    address: {},
  },
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess(state, action) {
      state.token = action.payload.token;
      state.isAuth = true;
      state.userDetails = action.payload.userDetails;
      state.hasError = false;
      state.errorMessage = null;
    },
    authError(state, action) {
      state.token = "";
      state.isAuth = false;
      state.hasError = true;
      state.errorMessage = action.payload;
    },
    logout({ userType }) {
      return { ...initialState, userType };
    },
    updateUserDetails(state, action) {
      const newUserDetails = action.payload;
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          ...newUserDetails,
        },
      };
    },
  },
});

export const getToken = ({ auth }) => auth.token;
export const getIsAuth = ({ auth }) => auth.isAuth;
export const getUserDetails = ({ auth }) => auth.userDetails;

export const getIsRootUser = ({ auth }) =>
  auth.userDetails.baseRole.id === userRoles.PRIVILEGED_ADMINISTRATOR;

export const getIsManager = ({ auth }) =>
  auth.userDetails.baseRole.id === userRoles.MANAGER;

export const getUserRole = ({ auth }) => {
  return auth.userDetails.baseRole.id;
};

export const {
  authSuccess,
  authError,
  logout,
  updateUserDetails,
} = auth.actions;

export const signIn = (credentials) => async (dispatch) => {
  const [error, response] = await login({ credentials });

  if (error) {
    dispatch(authError(error));
  } else {
    dispatch(authSuccess(response));
    await dispatch(fetchDesignations());
  }

  return [error, response];
};

export const { setUserType } = auth.actions;

export default auth.reducer;
