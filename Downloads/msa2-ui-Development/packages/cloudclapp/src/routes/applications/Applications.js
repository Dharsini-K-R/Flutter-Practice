import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";

import { Grid, makeStyles, Tabs, Tab, Box } from "@material-ui/core";
import ApplicationPageHeader from "./ApplicationPageHeader";
import QuickDeployment from "./QuickDeployment";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import { TABS } from "./";
import { useSelector } from "react-redux";
import { getUserRole } from "cloudclapp/src/store/auth";
import {
  getPermissions,
  getPermission,
  getAccessibility,
} from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => ({
  tabsBackground: {
    borderRadius: "8px",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
  tabText: {
    textTransform: "none",
    paddingBottom: "1%",
    paddingTop: "1%",
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
  },
  customStyleOnActiveTab: {
    color: "#40a9ff",
    textTransform: "none",
    paddingBottom: "1%",
    paddingTop: "1%",
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
  },
  tabPanel: {
    width: "100%",
    height: "100%",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
  boxWidthPadding: {
    width: "100%",
    paddingTop: "2%",
    paddingLeft: "2%",
    paddingBottom: "2%",
  },
  tabsBoxHeight: {
    height: "80%",
  },
  topPadding: {
    paddingTop: "10%",
  },
}));

/*
  visibleTab = "" (it will display All tabs) || "virtual-machine" (it will display only vm tab) || "docker-hub" (it will display only docker tab)
*/
const Applications = ({
  showPageHeader = true,
  showQuickDeployment = true,
  setApplicationsCallBack,
  tabId,
  onTabChange,
  visibleTab = "",
}) => {
  const [
    imagesArrayForDeployment,
    setImagesArrayForDeployment,
  ] = React.useState([]);
  const permissionProfiles = useSelector(getPermissions);
  const userRole = useSelector(getUserRole);
  const canCreateDeployment = useSelector(
    getPermission("deployments", "general", "create"),
  );

  const setApplicationsTabsCallBack = (applicationsArray) => {
    setImagesArrayForDeployment(applicationsArray);
  };

  const TABS_TO_DISPLAY = TABS.filter((tab) =>
    // If visibleTab is passed, show only passed tab
    // This is used to filter tabs out based on imageType set in Cloud
    visibleTab ? tab.id.includes(visibleTab) : true,
  ).filter(({ permissionSubcategory }) =>
    // If features should be hidden by Permission, we will filter it out.
    getAccessibility(
      permissionProfiles,
      ["applications", permissionSubcategory, "view"].join("."),
      userRole,
    ),
  );

  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const { Component } = TABS_TO_DISPLAY[selectedTab] || {};
  const [selectedCloud, setSelectedCloud] = useState();
  const handleTabChange = (_, index) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setSelectedTab(index);
    }
  };

  useEffect(() => {
    if (tabId) {
      setSelectedTab(TABS_TO_DISPLAY.findIndex(({ id }) => tabId === id));
    }
  }, [TABS_TO_DISPLAY, tabId]);

  return (
    <Box data-testid="applications-dockerhub-component">
      {showPageHeader && <ApplicationPageHeader />}

      <Box className={`${classes.tabsBackground} ${classes.tabsBoxHeight}`}>
        <Grid item xs={12} style={{ boxSizing: "border-box" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            {TABS_TO_DISPLAY.map(
              ({ id, label, showTabForRelease }, index) =>
                showTabForRelease && (
                  <Tab
                    key={id}
                    id={`applications-tab-${index}`}
                    aria-controls={`tabpanel-${index}`}
                    label={label}
                  />
                ),
            )}
          </Tabs>
        </Grid>
        {Component && (
          <Grid item xs={12}>
            <Component
              setSelectedCloud={setSelectedCloud}
              setApplicationsCallBack={setApplicationsCallBack}
              setApplicationsTabsCallBack={setApplicationsTabsCallBack}
              disableMarketPlaceSelect={visibleTab === "virtual-machine"}
            />
          </Grid>
        )}
      </Box>

      <Box className={classes.topPadding} />

      {showQuickDeployment && canCreateDeployment && (
        <Box className={`${classes.tabsBackground} ${classes.boxWidthPadding}`}>
          <QuickDeployment
            selectedCloud={selectedCloud}
            defaultContext={{
              [DEPLOYMENT_VARIABLES_NAME.APPLICATION]: imagesArrayForDeployment,
            }}
            imageType={TABS[selectedTab].imageType}
          />
        </Box>
      )}
    </Box>
  );
};

Applications.propTypes = {
  showPageHeader: PropTypes.bool,
  showQuickDeployment: PropTypes.bool,
  setApplicationsCallBack: PropTypes.func,
  tabId: PropTypes.string,
  onTabChange: PropTypes.func,
  visibleTab: PropTypes.string,
};

export default Applications;
