import i18n from "i18next";
import {
  CityIcon,
  StoreIcon,
  CloudIcon,
  StreamIcon,
  VectorSquareIcon,
  PlusCircleIcon,
  LightbulbIcon,
  UserLockIcon,
} from "react-line-awesome";

import { getAccessibility } from "cloudclapp/src/store/designations";
import { ENVIRONMENT_COMMUNITY_ACCOUNT } from "cloudclapp/src/Constants";
import {
  getOrganisationName,
} from "cloudclapp/src/store/designations";
import Dashboard from "cloudclapp/src/routes/dashboard/Dashboard";
import ApplicationsRouter from "cloudclapp/src/routes/applications/";
import Environments from "cloudclapp/src/routes/environments/Environments";
import DeploymentsRouter from "cloudclapp/src/routes/deployments/";
import Insights from "cloudclapp/src/routes/insights/Insights";
import Governance from "cloudclapp/src/routes/governance/Governance";
import Blueprints from "cloudclapp/src/routes/blueprints/Blueprints";

import { TABS as APPLICATION_TABS } from "cloudclapp/src/routes/applications";

const MainMenu = [
  {
    label: i18n.t("Dashboard"),
    getLabel: getOrganisationName,
    icon: CityIcon,
    route: "/dashboard",
    exact: true,
    component: Dashboard,
    id: "PRIMARY_MENU_NAV_BTN_DASHBOARD",
  },
  {
    label: i18n.t("Blueprints"),
    icon: VectorSquareIcon,
    route: "/blueprints",
    component: Blueprints,
    id: "PRIMARY_MENU_NAV_BTN_BLUEPRINTS",
  },
  {
    label: i18n.t("Marketplace"),
    icon: StoreIcon,
    route: "/applications",
    component: ApplicationsRouter,
    id: "PRIMARY_MENU_NAV_BTN_APPLICATIONS",
    getHidden: ({ auth, designations: { permissions } }) => {
      const userRole = auth.userDetails.baseRole.id;
      const visibleTabs = APPLICATION_TABS.filter(({ permissionSubcategory }) =>
        getAccessibility(
          permissions,
          ["applications", permissionSubcategory, "view"].join("."),
          userRole,
        ),
      );
      return visibleTabs.length === 0;
    },
  },
  {
    label: i18n.t("Environments"),
    icon: CloudIcon,
    route: "/environments",
    component: Environments,
    id: "PRIMARY_MENU_NAV_BTN_ENVIRONMENTS",
    childItems: [
      {
        id: "PRIMARY_MENU_ACTION_BTN_ADD_ENVIRONMENT",
        label: "Add Environment",
        icon: PlusCircleIcon,
        route: "/environments/create",
        isAction: true,
        getDisabled: ({ designations }) => {
          const envCount = designations.environments.length;
          return envCount >= ENVIRONMENT_COMMUNITY_ACCOUNT.count;
        },
        disabledToolTipMessage: i18n.t(
          "With a Community Account, you cannot add more than 5 environments.",
        ),
        getHidden: ({ auth, designations: { permissions } }) => {
          const userRole = auth.userDetails.baseRole.id;
          const canCreateEnvironment = getAccessibility(
            permissions,
            ["environments", "general", "create"].join("."),
            userRole,
          );
          return !canCreateEnvironment;
        },
      },
    ],
  },
  {
    label: i18n.t("Deployments"),
    icon: StreamIcon,
    route: "/deployments",
    component: DeploymentsRouter,
    id: "PRIMARY_MENU_NAV_BTN_DEPLOYMENTS",
  },
  {
    label: i18n.t("Insights"),
    icon: LightbulbIcon,
    route: "/insights",
    component: Insights,
    id: "PRIMARY_MENU_NAV_BTN_INSIGHTS",
    getHidden: ({ auth, designations: { permissions } }) => {
      const userRole = auth.userDetails.baseRole.id;
      const canViewCost = getAccessibility(
        permissions,
        ["insights", "cost", "view"].join("."),
        userRole,
      );
      return !canViewCost;
    },
  },
  {
    label: i18n.t("Governance"),
    icon: UserLockIcon,
    route: "/Governance",
    component: Governance,
    id: "PRIMARY_MENU_NAV_BTN_GOVERNANACE",
    getHidden: ({ auth, designations: { permissions } }) => {
      const userRole = auth.userDetails.baseRole.id;
      const canViewUser = getAccessibility(
        permissions,
        ["governance", "user", "view"].join("."),
        userRole,
      );
      const canViewTags = getAccessibility(
        permissions,
        ["governance", "tags", "view"].join("."),
        userRole,
      );
      const canViewAuditLogs = getAccessibility(
        permissions,
        ["governance", "auditLogs", "view"].join("."),
        userRole,
      );
      return !(canViewUser || canViewTags || canViewAuditLogs);
    }
  },
];

export default MainMenu;
