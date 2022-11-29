import React, { useEffect } from "react";
import {
  Grid,
  Box,
  makeStyles,
  Tabs,
  Tab,
  Typography,
} from "@material-ui/core";
import i18n from "cloudclapp/src/localisation/i18n";
import { LightbulbIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import { buildRoute, getParentRoute } from "msa2-ui/src/utils/urls";
import Cost from "./Cost";
import {
  Link,
  Route,
  Redirect,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  // {
  //   id: "security",
  //   label: i18n.t("Security"),
  //   Component: Security,
  // },
  {
    id: "cost",
    label: i18n.t("Cost"),
    Component: Cost,
  },
  // {
  //   id: "activity",
  //   label: i18n.t("Activity"),
  //   Component: Activity,
  // },
];

const InsightDetail = () => {
  const dispatch = useDispatch();
  const commonClasses = useCommonStyles();
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const defaultRoute = buildRoute(url, TABS[0].id);

  useEffect(() => {
  }, [dispatch]);

  const currentTab = TABS.findIndex(
    ({ id }) => id === pathname.replace(url, "").split("/")[1],
  );
  const canViewCost = useSelector(getPermission("insights", "cost", "view"));

  const FINAL_TABS = canViewCost
    ? TABS
    : TABS.filter((tab) => tab.id !== "cost");

  const handleTabChange = (_, index) => {
    history.push(buildRoute(getParentRoute(pathname), FINAL_TABS[index].id));
  };

  return (
    <Box data-testid="insights-dockerhub-component">
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
            <LightbulbIcon className={commonClasses.commonPageHeaderIcon} />
          </Grid>
          <Grid item>
            <Typography
              id="insights_title"
              variant="h4"
              className={commonClasses.commonPageHeaderText}
            >
              {" "}
              {t("Insights")}
            </Typography>
          </Grid>
        </Grid>
      </div>

      <Box className={`${classes.tabsBackground} ${classes.tabsBoxHeight}`}>
        <Grid item xs={12}>
          <Tabs
            value={currentTab < 0 ? 0 : currentTab}
            onChange={handleTabChange}
          >
            {FINAL_TABS.map(({ id, label }) => (
              <Tab
                key={id}
                component={Link}
                id={`INSIGHTS_${id.toUpperCase()}_TAB`}
                label={label}
                to={buildRoute(getParentRoute(pathname), id)}
              />
            ))}
          </Tabs>
        </Grid>

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
      </Box>
    </Box>
  );
};

export default InsightDetail;
