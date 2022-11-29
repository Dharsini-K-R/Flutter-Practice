import React from "react";
import { render } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";
import { StylesProvider } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core";
import SnackbarProvider from "cloudclapp/src/SnackbarProvider";
import createTheme from "cloudclapp/src/styles/theme";
import thunk from "redux-thunk";
const middlewares = [thunk];

const msaTheme = createTheme();

// Make generated classNames consistent for snapshots
const generateClassName = (rule, styleSheet) =>
  `${styleSheet.options.classNamePrefix}-${rule.key}`;

const AllTheProviders = ({ children }) => {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={msaTheme}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

const customRender = (component, options, initialRoute = "/") => {
  const componentWithRouter = (
    <Router basename={initialRoute}>{component}</Router>
  );

  return render(componentWithRouter, { wrapper: AllTheProviders, ...options });
};

const renderWithProvider = ({
  childComponent,
  mockStore,
  mockState = {},
  initialRoute,
}) => {
  const store = mockStore || configureMockStore(middlewares)(mockState);

  return {
    ...customRender(
      <Provider store={store}>{childComponent}</Provider>,
      null,
      initialRoute,
    ),
    store,
  };
};

const customRenderHook = (callback, options = {}) => {
  const wrapper = options.wrapper || AllTheProviders;

  return renderHook(callback, { ...options, wrapper });
};

// re-export everything
export * from "@testing-library/react";

// override render and renderHook methods
export {
  customRender as render,
  renderWithProvider,
  customRenderHook as renderHook,
  act as actOnHook,
  userEvent,
};
