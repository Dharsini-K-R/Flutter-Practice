import React from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { getEnvironments } from "cloudclapp/src/store/designations";

import Deployments from "cloudclapp/src/routes/deployments/Deployments";
import Instance from "cloudclapp/src/routes/environments/details/instances/Instance";

const ROOT_PATH = "/deployments";
const DeploymentsRouter = () => {
  const { pathname } = useLocation();
  const environments = useSelector(getEnvironments());
  const instanceId = pathname.replace(ROOT_PATH, "").split("/")[1];
  const isValidId = environments.some(({ deployments }) =>
    deployments?.some(({ deploymentId }) => deploymentId === instanceId),
  );

  return (
    <Switch>
      <Route path={`${ROOT_PATH}/:instanceId`}>
        {isValidId ? (
          <Instance key={instanceId} />
        ) : (
          <Redirect to={ROOT_PATH} />
        )}
      </Route>
      <Route path={`${ROOT_PATH}`}>
        <Deployments />
      </Route>
    </Switch>
  );
};

export default DeploymentsRouter;
