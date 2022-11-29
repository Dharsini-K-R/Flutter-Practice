import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Grid } from "@material-ui/core";

import { workflowStatus } from "cloudclapp/src/Constants";

const useStyles = makeStyles(() => {
  return {
    innerIcon: {
      position: "relative",
    },
  };
});

const SecurityStatusIcon = ({ size = 48, status = "NONE", ...props }) => {
  const classes = useStyles();

  const { iconSecurity: WrapperIcon, icon: Icon, color } =
    workflowStatus.find((wf) => wf.status === status) ?? {};

  return (
    <Grid container alignItems="center" justifyContent="center" {...props}>
      <WrapperIcon
        id="SECURITY_STATUS_ICON_WRAPPER"
        style={{ fontSize: size, color }}
      >
        <Icon
          id="SECURITY_STATUS_ICON"
          className={classes.innerIcon}
          style={{
            fontSize: size * 0.4,
            color,
            top: -size * 0.23,
            left: -size * 0.7,
          }}
        />
      </WrapperIcon>
    </Grid>
  );
};

SecurityStatusIcon.propTypes = {
  size: PropTypes.number,
  status: PropTypes.string,
};

export default SecurityStatusIcon;
