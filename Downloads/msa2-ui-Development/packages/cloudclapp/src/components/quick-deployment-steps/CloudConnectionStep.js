import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  makeStyles,
  Radio,
  TextField,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { startCase, isEmpty } from "lodash";
import usePostApi from "cloudclapp/src/hooks/usePostApi";
import { createCloudConnection } from "cloudclapp/src/api/cloud";

import { useSelector, useDispatch } from "react-redux";
import {
  getOrganisationId,
  getCloudVendors,
  fetchConnectionSummary,
  fetchEnvironmentSummary,
} from "cloudclapp/src/store/designations";

import CloudVendorIcon from "cloudclapp/src/components/cloud-vendor-icon";
import { userRoles, getUserRole } from "cloudclapp/src/store/auth";

const useStyles = makeStyles((theme) => {
  const { palette, spacing } = theme;

  return {
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
    flexEnd: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    checkboxStyle: {
      padding: "15px",
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    formField: {
      margin: `${spacing(2)}px 0`,
      textAlign: "left",
      weight: "100%",
    },
    conectBtn: {
      width: "30%",
    },
    noConnectionText: {
      color: palette.text.support,
      fontWeight: "600",
    },
  };
});

const CloudConnectionStep = ({
  selectedCloud,
  setSelectedCloud,
  connectionSummary = [],
  isDisabled,
  setSelectedCloudCnt,
}) => {
  const orgId = useSelector(getOrganisationId);
  const cloudVendors = useSelector(getCloudVendors);
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(setSelectedCloud?.vendorDisplayName);
    setVendor(setSelectedCloud);
  }, [setSelectedCloud]);

  const [value, setValue] = useState();
  const [vendor, setVendor] = useState();

  const classes = useStyles();
  const { t } = useTranslation();

  const [credentials, setCredentials] = useState({});
  const [onClickConnect] = usePostApi(
    createCloudConnection,
    {
      orgId,
      vendor: vendor?.cloudVendor,
      connectionName: `${vendor?.cloudVendor}-connection-1`,
      credentials,
    },
    () => {
      dispatch(fetchConnectionSummary);
      dispatch(fetchEnvironmentSummary);
      setVendor((prev) => ({
        ...prev,
        connections: [
          {
            connectionStatus: "",
            connectionName: `${vendor?.cloudVendor}-connection-1`,
          },
        ],
      }));
    },
  );

  const handleChange = (data) => {
    setValue(data.vendorDisplayName);
    setVendor(data);
    selectedCloud(data);
    isDisabled(false);
  };

  const userRole = useSelector(getUserRole);
  const isManager = userRole >= userRoles.MANAGER;

  const visibleConnections = connectionSummary.filter((item) =>
    isManager ? item.connections[0]?.connectionName : true,
  );

  return (
    <>
      <Grid>
        <Typography gutterBottom variant="h5" className={classes.flexEnd}>
          {t("Choose a Cloud Provider")}
        </Typography>
        {visibleConnections?.length ? (
          visibleConnections.map((item, index) => {
            const connection = item.connections[0];

            return (
              <Box
                key={index}
                sx={{ display: "flex", flexDirection: "row", pt: 2 }}
              >
                <Radio
                  color="primary"
                  checked={value === item?.vendorDisplayName}
                  onChange={() => handleChange(item)}
                  size="small"
                  className={classes.checkboxStyle}
                  id={`CLOUD_CONNECTION_CHECKOUT_${index}`}
                />
                <div className={classes.cloudIcon}>
                  <CloudVendorIcon vendor={item?.cloudVendor} />
                </div>
                <div className={classes.flexColumn}>
                  <div>
                    <span
                      className={classes.cloudVendor}
                      id={`CLOUD_CONNECTION_VENDOR_NAME_${index}`}
                    >
                      {item.vendorDisplayName}
                    </span>
                    {connection?.connectionName && " - "}
                    <span
                      id={`CLOUD_CONNECTION_VENDOR_CONNECTION_NAME_${index}`}
                    >
                      {connection?.connectionName}
                    </span>
                  </div>
                  {connection?.connectionStatus === "Connected" ? (
                    <div
                      className={classes.fontConnected}
                      id={`CLOUD_CONNECTION_CONNECTED_${index}`}
                    >
                      {connection?.connectionStatus}
                    </div>
                  ) : (
                    <div
                      className={classes.fontSubtext}
                      id={`CLOUD_CONNECTION_NOTCONNECTED_${index}`}
                    >
                      {connection?.connectionStatus}
                    </div>
                  )}
                </div>
              </Box>
            );
          })
        ) : (
          <Typography variant="body1" className={classes.noConnectionText}>
            {t("There are no cloud Connections")}
          </Typography>
        )}
        {value && isEmpty(vendor.connections[0]?.connectionName) && (
          <Box sx={{ display: "flex", flexDirection: "column", pt: 3 }}>
            <Typography gutterBottom variant="h5" className={classes.flexEnd}>
              {t("Enter Key", { value })}
            </Typography>
            <div className={classes.cloudDesc}>
              <span>
                {t(
                  "Service provider will provide you with a KEY when you create AWS account.",
                  { value },
                )}
              </span>{" "}
              {/* <span className={classes.helperText}>
                   If you don't have an account, click here to create an account
                  {t("click here to create an account")}
                </span> */}
            </div>
            <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
              {cloudVendors[vendor.cloudVendor].credentials_required.map(
                (lable, index) => {
                  return (
                    <Grid className={classes.flexSpaceBtw} key={index}>
                      {" "}
                      <Grid item>
                        <Typography
                          variant="body1"
                          id={`CLOUD_CONNECTION_${index}`}
                        >
                          {startCase(lable)}
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          variant="outlined"
                          id={`CLOUD_CONNECTION_KEY_${index}`}
                          label={null}
                          required
                          className={classes.formField}
                          fullWidth={true}
                          value={credentials[lable]}
                          onChange={({ target: { value } }) => {
                            setCredentials({
                              ...credentials,
                              [lable]: value,
                            });
                          }}
                          multiline
                          maxRows={3}
                        />
                      </Grid>
                    </Grid>
                  );
                },
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Button
                id="CLOUD_CONNECTION_SUCCESS"
                variant="contained"
                color="primary"
                className={classes.conectBtn}
                onClick={onClickConnect}
              >
                {t("Connect")}
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default CloudConnectionStep;
