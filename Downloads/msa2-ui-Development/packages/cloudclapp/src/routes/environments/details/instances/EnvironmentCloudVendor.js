import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { getCloudVendors } from "cloudclapp/src/store/designations";
import CloudVendorIcon from "cloudclapp/src/components/cloud-vendor-icon";

const useStyles = makeStyles(({ palette, typography }) => ({
  icon: {
    fontSize: "42px",
    boxSizing: "border-box",
    background: palette.common.white,
    padding: 5,
    borderRadius: 4,
  },
  serviceDetails: {
    fontSize: 13,
    color: typography.body3.color,
    marginLeft: 10,
  },
  serviceName: {
    fontWeight: 600,
  },
  boldText: {
    fontWeight: 500,
  },
}));

const EnvironmentCloudVendor = ({ environment }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const cloudVendors = useSelector(getCloudVendors);
  const {
    description,
    envIp,
    envHostname,
    cloudVendor: cloudVendorName,
    cloudService: cloudServiceName,
  } = environment;
  const cloudVendor = cloudVendors[cloudVendorName];
  const cloudService = cloudVendor?.services[cloudServiceName];
  return (
    <Grid item>
      <Box display="flex" flexDirection="row" alignItems={"center"}>
        <Box>
          <CloudVendorIcon
            vendor={cloudVendorName}
            service={cloudServiceName}
          />
        </Box>
        <Box p={1}>
          <Typography
            id="INSTANCE_DETAILS_ENVIRONMENT_SERVICE_NAME"
            className={classes.serviceDetails}
          >
            <span className={classes.serviceName}>
              {cloudService?.displayName}
            </span>
            {" - "}
            <span>{cloudVendor?.displayName}</span>
          </Typography>
          <Typography
            id="INSTANCE_DETAILS_ENVIRONMENT_DESCRIPTION"
            className={classes.serviceDetails}
          >
            {description}
          </Typography>
          <Grid container item>
            <Typography
              id="INSTANCE_DETAILS_ENVIRONMENT_IP_ADDRESS"
              className={classes.serviceDetails}
            >
              <span className={classes.boldText}>
                {t("IP Address")}
                {":"}
              </span>{" "}
              {envIp}
            </Typography>
            <Typography
              id="INSTANCE_DETAILS_ENVIRONMENT_HOSTNAME"
              className={classes.serviceDetails}
            >
              <span className={classes.boldText}>
                {t("Host Name")}
                {":"}
              </span>{" "}
              {envHostname}
            </Typography>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

EnvironmentCloudVendor.propTypes = {
  environment: PropTypes.object.isRequired,
  cloudVendor: PropTypes.object.isRequired,
};
export default EnvironmentCloudVendor;
