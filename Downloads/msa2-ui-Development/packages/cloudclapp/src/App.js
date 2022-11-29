import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import { getIsAuth } from "cloudclapp/src/store/auth";
import { getDesignationsReady } from "cloudclapp/src/store/designations";

import { ThemeProvider } from "@material-ui/core";

import AppWrapper from "cloudclapp/src/components/app/AppWrapper";
import createTheme from "cloudclapp/src/styles/theme";
import Login from "cloudclapp/src/routes/login/Login";
import MainMenu from "cloudclapp/src/components/menu/MainMenu";
import useTimeoutLogout from "cloudclapp/src/hooks/useTimeoutLogout";

function App() {
  const isAuth = useSelector(getIsAuth);
  const designationsReady = useSelector(getDesignationsReady);
  const state = useSelector((state) => ({
    // trim states to minimise rerender time
    auth: state.auth,
    designations: { permissions: state.designations.permissions },
  }));

  // This hook will logout the current user if he/she doesn't perform any click action on app
  // We can't invoke this from index.js because it should be wrapped under provider
  useTimeoutLogout(isAuth);

  if (!isAuth || !designationsReady) {
    const appTheme = createTheme(false);
    return (
      <ThemeProvider theme={appTheme}>
        <Route component={Login} />
      </ThemeProvider>
    );
  }

  const defaultRoute = "/dashboard";
  return (
    <AppWrapper>
      <Switch>
        <Route exact path="/">
          <Redirect to={defaultRoute} />
        </Route>
        <Route exact path="/sign-in">
          <Redirect to={defaultRoute} />
        </Route>
        {MainMenu.filter(({ getHidden }) =>
          getHidden ? !getHidden(state) : true,
        ).map(({ label, route, exact, component }) => (
          <Route key={label} path={route} exact={exact} component={component} />
        ))}
        <Redirect to={defaultRoute} />
      </Switch>
    </AppWrapper>
  );
}

export default App;
