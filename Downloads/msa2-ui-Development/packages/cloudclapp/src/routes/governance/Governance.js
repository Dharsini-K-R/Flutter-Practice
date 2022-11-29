import React from "react";
import i18n from "cloudclapp/src/localisation/i18n";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import {
  Grid,
  Box,
  makeStyles,
  Tabs,
  Tab,
  Typography,
} from "@material-ui/core";
import { buildRoute, getParentRoute } from "msa2-ui/src/utils/urls";
import {
  Link,
  Route,
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

import { UserLockIcon } from "react-line-awesome";
import Users from "./Users";
import AuditLogs from "./AuditLogs";
import ManageTags from "./ManageTags";

import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => ({
  tabsBackground: {
    borderRadius: "8px",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
  tabsBoxHeight: {
    height: "80%",
  },
}));

const TABS = [
  {
    id: "users",
    label: i18n.t("Users"),
    Component: Users,
  },
  {
    id: "tags",
    label: i18n.t("Tags"),
    Component: ManageTags,
  },
  {
    id: "auditLogs",
    label: i18n.t("Audit Logs"),
    Component: AuditLogs,
  },
];

const Governance = () => {
  const commonClasses = useCommonStyles();
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const defaultRoute = buildRoute(url, TABS[0].id);
  const canViewAuditLogs = useSelector(
    getPermission("governance", "auditLogs", "view"),
  );
  const canViewUsers = useSelector(
    getPermission("governance", "user", "view"),
  );
  const canViewTags = useSelector(
    getPermission("governance", "tags", "view"),
  );

  const FINAL_TABS = TABS.filter((tab) => {
    switch(tab.id) {
      case "auditLogs" : return canViewAuditLogs;
      case "users": return canViewUsers;
      case "tags": return canViewTags;
      default : return false;
    }
  });

  const currentTab = FINAL_TABS.findIndex(
    ({ id }) => id === pathname.replace(url, "").split("/")[1],
  );

  const handleTabChange = (_, index) => {
    history.push(buildRoute(getParentRoute(pathname), FINAL_TABS[index].id));
  };

  return (
    <div data-testId="governance-compnonent">
      <div
        className={commonClasses.commonPageHeaderContainer}
        data-testid="insights-container"
      >
        <Grid
          container
          className={commonClasses.commonPageHeaderGrid}
          spacing={2}
        >
          <Grid item>
            <UserLockIcon className={commonClasses.commonPageHeaderIcon} />
          </Grid>
          <Grid item>
            <Typography
              id="governance_title"
              variant="h4"
              className={commonClasses.commonPageHeaderText}
            >
              {" "}
              {t("Governance")}
            </Typography>
          </Grid>
        </Grid>
      </div>
      <Box className={`${classes.tabsBackground} ${classes.tabsBoxHeight}`}>
        <Grid item xs={12} style={{ boxSizing: "border-box" }}>
          <Tabs
            value={currentTab < 0 ? 0 : currentTab}
            onChange={handleTabChange}
          >
            {FINAL_TABS.map(({ id, label }) => (
              <Tab
                key={id}
                component={Link}
                id={`GOVERNANCE_${id.toUpperCase()}_TAB`}
                label={label}
                to={buildRoute(getParentRoute(pathname), id)}
              />
            ))}
          </Tabs>
        </Grid>
      </Box>
      <Grid item xs={12}>
        <Switch>
          <Route exact path={path}>
            <Redirect to={defaultRoute} />
          </Route>
          {FINAL_TABS.map(({ id, Component }) => (
            <Route path={buildRoute(path, id)} key={id}>
              <Component />
            </Route>
          ))}
          <Redirect to={defaultRoute} />
        </Switch>
      </Grid>
    </div>
  );
};

export default Governance;
