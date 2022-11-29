import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import useApi from "cloudclapp/src/hooks/useApi";
import { getImage } from "msa2-ui/src/api/repository";
import { getCloudVendors } from "cloudclapp/src/store/designations";

import { makeStyles } from "@material-ui/core";
import { CloudIcon } from "react-line-awesome";
import classNames from "classnames";

const useStyles = makeStyles(({ palette, colors }) => {
  const PADDING = 5;
  return {
    icon: {
      boxSizing: "border-box",
      background: palette.common.white,
      padding: PADDING,
      borderRadius: 4,
    },
    custom: ({ size }) => ({
      width: size + PADDING * 2,
      height: size + PADDING * 2,
    }),
    default: ({ size }) => ({
      fontSize: size,
      color: colors.grey,
    }),
  };
});

const CloudVendorIcon = ({ size = 32, vendor, service, ...props }) => {
  const cloudVendors = useSelector(getCloudVendors);

  const vendorLogo = cloudVendors[vendor]?.logo;
  const serviceLogo = cloudVendors[vendor]?.services[service]?.logo;
  const path = serviceLogo ?? vendorLogo;
  const alt = serviceLogo
    ? cloudVendors[vendor]?.services[service]?.displayName
    : cloudVendors[vendor]?.displayName;

  const [, , { url } = {}] = useApi(getImage, { path }, !path);

  const classes = useStyles({ size });

  return url ? (
    <img
      alt={alt}
      src={url}
      className={classNames(classes.icon, classes.custom)}
      {...props}
    />
  ) : (
    <CloudIcon
      className={classNames(classes.icon, classes.default)}
      {...props}
    />
  );
};

CloudVendorIcon.propTypes = {
  size: PropTypes.number,
  vendor: PropTypes.string,
  service: PropTypes.string,
};

export default CloudVendorIcon;
