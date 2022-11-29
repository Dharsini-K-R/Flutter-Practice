import React from "react";
import { useSelector } from "react-redux";

import {
  Route,
  Switch,
  Redirect,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import i18n from "cloudclapp/src/localisation/i18n";

import { getUserRole } from "cloudclapp/src/store/auth";
import {
  getPermissions,
  getAccessibility,
} from "cloudclapp/src/store/designations";

import DockerHub from "./DockerHub";
import VirtualMachine from "./VirtualMachine";
import PrivateDockerHub from "./PrivateDockerHub";

import { buildRoute } from "msa2-ui/src/utils/urls";
import { useLocation } from "react-router-dom";

import Applications from "./Applications";

const ROOT_PATH = "/applications";
export const TABS = [
  {
    id: "docker-hub",
    imageType: "docker",
    permissionSubcategory: "dockerHub",
    label: i18n.t("Docker Hub"),
    showTabForRelease: true,
    Component: DockerHub,
  },
  {
    id: "private-docker-hub",
    imageType: "docker",
    permissionSubcategory: "privateDockerHub",
    label: i18n.t("Private Docker Hub"),
    showTabForRelease: true,
    Component: PrivateDockerHub,
  },
  {
    id: "virtual-machine",
    imageType: "vm",
    permissionSubcategory: "virtualMachine",
    label: i18n.t("Virtual Machine"),
    showTabForRelease: true,
    Component: VirtualMachine,
  },
  {
    id: "recently-used",
    label: i18n.t("Recently Used"),
    showTabForRelease: false,
  },
  {
    id: "local-source",
    label: i18n.t("Local Source"),
    showTabForRelease: false,
  },
];
const ApplicationsRouter = () => {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const userRole = useSelector(getUserRole);
  const permissionProfiles = useSelector(getPermissions);

  const TABS_TO_DISPLAY = TABS.filter(({ permissionSubcategory }) =>
    // If features should be hidden by Permission, we will filter it out.
    getAccessibility(
      permissionProfiles,
      ["applications", permissionSubcategory, "view"].join("."),
      userRole,
    ),
  );
  const defaultRoute = buildRoute(url, TABS_TO_DISPLAY[0].id);
  const tabId = pathname.split("/")[2];

  return (
    <Switch>
      <Route exact path={ROOT_PATH}>
        <Redirect to={defaultRoute} />
      </Route>

      <Route path={TABS_TO_DISPLAY.map(({ id }) => buildRoute(ROOT_PATH, id))}>
        <Applications
          tabId={tabId}
          onTabChange={(index) => {
            history.push(buildRoute(ROOT_PATH, TABS_TO_DISPLAY[index].id));
          }}
        />
      </Route>
      <Redirect to={defaultRoute} />
    </Switch>
  );
};

export default ApplicationsRouter;
