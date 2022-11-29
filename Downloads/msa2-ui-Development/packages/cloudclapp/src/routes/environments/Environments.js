import React from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

import {
  getEnvironmentById,
  getEnvironments,
} from "cloudclapp/src/store/designations";

import CreateDialog from "cloudclapp/src/routes/environments/dialogs/Create";
import EnvironmentDetails from "cloudclapp/src/routes/environments/details";
import Instance from "cloudclapp/src/routes/environments/details/instances/Instance";
import EnvDashboard from "cloudclapp/src/routes/environments/EnvironmentDashboard";
import Deployment from "cloudclapp/src/services/Deployment";
import { ENVIRONMENT_COMMUNITY_ACCOUNT } from "cloudclapp/src/Constants";

const ROOT_PATH = "/environments";
const Environments = () => {
  const { pathname } = useLocation();
  const urlArr = pathname.replace(ROOT_PATH, "").split("/");
  const envId = parseInt(urlArr[1]) || "";
  const instanceId = urlArr[3];
  const environment = useSelector(getEnvironmentById(envId)) ?? {};
  const deployment = Deployment.findById(environment, instanceId);

  const envCount = useSelector(getEnvironments()).length;

  return (
    <Switch>
      <Route path={`${ROOT_PATH}/:envId/deployments/:instanceId`}>
        {deployment ? (
          <Instance key={instanceId} />
        ) : (
          <Redirect to={`${ROOT_PATH}/${envId}`} />
        )}
      </Route>
      <Route exact path={`${ROOT_PATH}/create`}>
        {envCount < ENVIRONMENT_COMMUNITY_ACCOUNT.count ? (
          <>
            <EnvDashboard />
            <CreateDialog />
          </>
        ) : (
          <Redirect to={`${ROOT_PATH}/`} />
        )}
      </Route>
      <Route path={`${ROOT_PATH}/:envId`}>
        {!isEmpty(environment) ? (
          <EnvironmentDetails key={envId} />
        ) : (
          <Redirect to={ROOT_PATH} />
        )}
      </Route>
      <Route path={`${ROOT_PATH}`}>
        <EnvDashboard />
      </Route>
    </Switch>
  );
};

export default Environments;
