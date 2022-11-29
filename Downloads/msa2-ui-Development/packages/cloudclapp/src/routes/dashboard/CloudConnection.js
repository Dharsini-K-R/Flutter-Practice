import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import useApi from "cloudclapp/src/hooks/useApi";
import usePostApi from "cloudclapp/src/hooks/usePostApi";
import {
  createCloudConnection,
  updateCloudConnection,
  deleteCloudConnection,
  getCloudConnection,
} from "cloudclapp/src/api/cloud";

import {
  makeStyles,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useSelector } from "react-redux";
import {
  getCloudVendors,
  getOrganisation,
} from "cloudclapp/src/store/designations";

import { startCase } from "lodash";

import CloudVendorIcon from "cloudclapp/src/components/cloud-vendor-icon";

const useStyles = makeStyles(({ palette, spacing }) => {
  return {
    loadingWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      backgroundColor: palette.background.subTextGrey,
    },
    cloudIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "4px",
      boxShadow: `0px 4px 16px ${palette.background.boxShadow}`,
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
    flexSpaceBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "20px",
    },
    formField: {
      margin: `${spacing(1)}px 0`,
      textAlign: "left",
      weight: "100%",
    },
    cloudDesc: {
      color: palette.text.support,
      fontSize: "14px",
      paddingTop: "16px",
      textAlign: "left",
    },
    helperText: {
      color: palette.primary.main,
      cursor: "pointer",
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
  };
});

const CloudConnection = ({ onClose, cloudContData }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const connection = cloudContData.connections[0];
  const hasConnection = Boolean(connection?.connectionName);

  const { id: orgId, prefix } = useSelector(getOrganisation);

  const [credentials, setCredentials] = useState({});

  const cloudVendors = useSelector(getCloudVendors);

  const [isLoading] = useApi(
    getCloudConnection,
    {
      operatorPrefix: prefix,
      vendor: cloudContData.cloudVendor,
      connectionName: connection?.connectionName,
      transforms: [
        (response) => {
          setCredentials(response);
          return response;
        },
      ],
    },
    !hasConnection,
  );

  const [onClickConnect, isConnecting] = usePostApi(
    createCloudConnection,
    {
      orgId,
      vendor: cloudContData.cloudVendor,
      connectionName: `${cloudContData.cloudVendor}-connection-1`,
      credentials,
    },
    onClose,
  );
  const [onClickUpdate, isUpdating] = usePostApi(
    updateCloudConnection,
    {
      orgId,
      vendor: cloudContData.cloudVendor,
      connectionName: connection?.connectionName,
      credentials,
    },
    onClose,
  );

  const [onClickDelete, isDeleting] = usePostApi(
    deleteCloudConnection,
    {
      orgId,
      vendor: cloudContData.cloudVendor,
      connectionName: connection?.connectionName,
    },
    onClose,
  );

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      title={`${cloudContData.vendorDisplayName} ${t("Connections")}`}
      data-testid="manage-connections-dialog"
      disabled={isLoading || isConnecting || isUpdating || isDeleting}
      onExec={hasConnection ? onClickUpdate : onClickConnect}
      execLabel={hasConnection ? t("Update") : t("Connect")}
      extraAction={hasConnection ? onClickDelete : undefined}
      extraLabel={hasConnection ? t("Delete") : undefined}
    >
      <Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              justifyContent: "flex-start",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className={classes.cloudIcon}>
              <CloudVendorIcon vendor={cloudContData.cloudVendor} />
            </div>
            <div className={classes.flexColumn}>
              <div>
                <span
                  className={classes.cloudVendor}
                  id="MANAGE_CLOUD_VENDOR_NAME"
                >
                  {cloudContData.vendorDisplayName}
                </span>
                {hasConnection && " - "}
                <span id="MANAGE_CLOUD_VENDOR_CONNECTION_NAME">
                  {connection?.connectionName}
                </span>
              </div>
              {connection?.connectionStatus === "Connected" ? (
                <div
                  className={classes.fontConnected}
                  id="MANAGE_CLOUD_CONNECTED"
                >
                  {connection?.connectionStatus}
                </div>
              ) : (
                <div
                  className={classes.fontSubtext}
                  id="MANAGE_CLOUD_NOTCONNECTED"
                >
                  {connection?.connectionStatus}
                </div>
              )}
            </div>
          </Box>
          {cloudVendors[cloudContData.cloudVendor]?.helper !== null && (
            <Box
              sx={{
                justifyContent: "flex-start",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                size="small"
                target="_blank"
                id={`MANAGE_CONNECTION_${cloudContData.cloudVendor}_HELPER`}
                href={cloudVendors[cloudContData.cloudVendor]?.helper}
              >
                {t("HELPER")}
              </Button>
            </Box>
          )}
        </Box>
        <div className={classes.cloudDesc}>
          <span>
            {t(
              "Service provider will provide you with a KEY when you create AWS account.",
              { value: cloudContData.vendorDisplayName },
            )}
          </span>{" "}
          {/* <span className={classes.helperText}>
            If you don't have an account, click here to create an account
            {t("click here to create an account")}
          </span> */}
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
          {cloudVendors[cloudContData.cloudVendor].credentials_required.map(
            (lable, index) => {
              return (
                <Grid className={classes.flexSpaceBtw} key={index}>
                  {" "}
                  <Grid item>
                    <Typography variant="body1" id="MANAGE_CLOUD_LABEL">
                      {startCase(lable)}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      value={credentials[lable]}
                      onChange={({ target: { value } }) => {
                        setCredentials({ ...credentials, [lable]: value });
                      }}
                      variant="outlined"
                      id={`MANAGE_CONNECTION_KEY_${index}`}
                      label={null}
                      required
                      className={classes.formField}
                      disabled={
                        isLoading || isConnecting || isUpdating || isDeleting
                      }
                      fullWidth={true}
                      multiline
                      maxRows={3}
                    />
                  </Grid>
                </Grid>
              );
            },
          )}
        </Box>
      </Grid>
    </Dialog>
  );
};

export default CloudConnection;
