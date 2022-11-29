import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Grid, Box, Tabs, Tab, Button } from "@material-ui/core";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import TabPanel from "msa2-ui/src/components/TabPanel";
import CloudConnection from "./CloudConnection";
import uniq from "lodash/uniq";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchConnectionSummary,
  fetchEnvironmentSummary,
  getConnectionSummary,
} from "cloudclapp/src/store/designations";

import CloudVendorIcon from "cloudclapp/src/components/cloud-vendor-icon";

const useStyles = makeStyles(({ palette }) => {
  return {
    flexCenter: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: "20px",
    },
    loadingWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
    },
    cloudIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "4px",
      boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    flexColumn: {
      paddingLeft: "16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    cloudVendor: {
      fontWeight: "bold",
    },
    fontConnected: {
      color: palette.background.checkGreen,
      fontSize: "12px",
      fontWeight: "600",
    },
    fontSubtext: {
      color: palette.background.subTextGrey,
      fontSize: "12px",
      fontWeight: "600",
    },
    tabPanel: {
      minHeight: "300px",
    },
  };
});

function a11yProps(index) {
  return {
    id: `manage_connections_tab_${index}`,
    "aria-controls": `tabpanel_${index}`,
  };
}

export const CloudCard = ({ cloudCardData, index, onClose }) => {
  const classes = useStyles();
  const [connectionDialog, setConnectionDialog] = useState(false);
  const { t } = useTranslation();
  const connection = cloudCardData.connections[0];

  return (
    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
      <div className={classes.cloudIcon}>
        <CloudVendorIcon vendor={cloudCardData.cloudVendor} />
      </div>
      <div className={classes.flexColumn}>
        <div>
          <span
            className={classes.cloudVendor}
            id={`CLOUD_CARD_VENDOR_NAME_${index}`}
          >
            {cloudCardData.vendorDisplayName}
          </span>
          {connection?.connectionName && " - "}
          <span id={`CLOUD_CARD_VENDOR_CONNECTION_NAME_${index}`}>
            {connection?.connectionName}
          </span>
        </div>
        {connection?.connectionStatus === "Connected" ? (
          <div
            className={classes.fontConnected}
            id={`CLOUD_CARD_CONNECTED_${index}`}
          >
            {connection?.connectionStatus}
          </div>
        ) : (
          <div
            className={classes.fontSubtext}
            id={`CLOUD_CARD_NOTCONNECTED_${index}`}
          >
            {connection?.connectionStatus}
          </div>
        )}
      </div>
      <Box sx={{ flex: "1 1 auto" }} />
      {connection?.connectionName ? (
        <Button
          color="primary"
          id={`CLOUD_CONNECTION_MANAGE_${index}`}
          onClick={setConnectionDialog}
        >
          {t("Manage")}
        </Button>
      ) : (
        <Button
          color="primary"
          id={`CLOUD_CONNECTION_MANAGE_${index}`}
          onClick={setConnectionDialog}
        >
          {t("Connect")}
        </Button>
      )}
      {connectionDialog && (
        <CloudConnection
          cloudContData={cloudCardData}
          onClose={() => {
            onClose();
            setConnectionDialog(false);
          }}
        />
      )}
    </Box>
  );
};

const ManageConnections = ({ onClose }) => {
  const [tabSelected, setTabSelected] = useState(0);
  const dispatch = useDispatch();

  const connectionSummary = useSelector(getConnectionSummary);

  const classes = useStyles();
  const { t } = useTranslation();

  const handleTabChange = (event, newValue) => {
    setTabSelected(newValue);
  };

  const onCloseCard = () => {
    dispatch(fetchConnectionSummary);
    dispatch(fetchEnvironmentSummary);
  };

  useEffect(() => {
    dispatch(fetchConnectionSummary);
    dispatch(fetchEnvironmentSummary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cloudTypes =
    connectionSummary?.length &&
    uniq(connectionSummary.map(({ cloudType }) => cloudType));

  return (
    <Dialog
      id="MANAGE_CONNECTIONS"
      maxWidth="sm"
      onClose={onClose}
      title={t("Manage Connections")}
      data-testid="cloud-connections-dialog"
    >
      <Grid>
        <Grid sx={{ width: "100%" }}>
          <Tabs value={tabSelected} onChange={handleTabChange}>
            {cloudTypes &&
              cloudTypes.map((cloudType, index) => {
                return (
                  <Tab
                    label={`${t(
                      `${cloudType} (${
                        connectionSummary.filter(
                          (filter) => filter.cloudType === `${cloudType}`,
                        ).length
                      })`,
                    )}`}
                    {...a11yProps(index)}
                    id={`CLOUD_CONNECTION_PUBLIC_TAB_${index}_BTN`}
                    key={index}
                  />
                );
              })}
          </Tabs>

          {cloudTypes &&
            cloudTypes.map((cloudType, index) => {
              return (
                <TabPanel
                  id={`CLOUD_CONNECTION_${cloudType}_TAB`}
                  value={tabSelected}
                  index={index}
                  className={classes.tabPanel}
                  key={index}
                >
                  {connectionSummary
                    .filter((filter) => filter.cloudType === `${cloudType}`)
                    .map((data, id) => {
                      return (
                        <CloudCard
                          cloudCardData={data}
                          index={id}
                          key={id}
                          onClose={onCloseCard}
                        />
                      );
                    })}
                </TabPanel>
              );
            })}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ManageConnections;
