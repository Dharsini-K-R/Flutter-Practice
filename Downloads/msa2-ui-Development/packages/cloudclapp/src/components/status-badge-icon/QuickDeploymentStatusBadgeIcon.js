import React from "react";
import PropTypes from "prop-types";

import { Grid, makeStyles } from "@material-ui/core";
import { Badge } from "@material-ui/core";
import { quickDeploymentStatus } from "cloudclapp/src/Constants.js"

const useStyles = makeStyles(({ palette, typography }) => {
  return {
    icon: {
      color: typography.body1.color,
    },
    badgeContainer: {
      padding: 15,
      justifyContent: "center"
    },
    badge: {
      backgroundColor: ({ backgroundColor }) => backgroundColor,
      padding: 0,
      height: "15px",
      minWidth: "15px",
      borderRadius: "15px",
      right: 0,
      color: palette.background.paper

    },
    label: {
      padding: "10px",
      fontWeight: "500",
      color: typography.subtitle2.color,
    },
  };
});

const STYLES = {
  large: { iconSize: 37, badgeSize: 12 },
  medium: { iconSize: 28, badgeSize: 10 },
  small: { iconSize: 21, badgeSize: 8 },
};

const QuickDeploymentStatusBadgeIcon = ({
  icon: Icon,
  size = "large",
  label,
  status,
  selectedValue,
  ...props
}) => {
  const statusDetails = quickDeploymentStatus[status]

  const { icon: StatusIcon, color } = statusDetails ?? {};

  const { iconSize, badgeSize, boxShadow } = STYLES[size];
  const isLarge = iconSize > 36;
  const classes = useStyles({
    backgroundColor: color,
    boxShadow,
  });

  return (
    // Try to overwrite id as this can appear on DOM multiple times
    <>
      <Grid container className={classes.badgeContainer}>
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant={isLarge ? "standard" : "dot"}
          classes={{ badge: status ? classes.badge : undefined }}
          badgeContent={
            isLarge && StatusIcon ? (
              <StatusIcon
                style={{
                  width: badgeSize,
                  height: badgeSize,
                }}
              />
            ) : (
              undefined
            )
          }
          {...props}
        >
          <Icon className={classes.icon} style={{ fontSize: iconSize, color: color }} />
        </Badge>
      </Grid>
      <span className={classes.label} style={{ color: color }}>{label}</span>
      <span className={classes.label}>{selectedValue}</span>
    </>
  );
};

QuickDeploymentStatusBadgeIcon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOf(Object.keys(STYLES)),
  status: PropTypes.string,
  label: PropTypes.string,
};

export default QuickDeploymentStatusBadgeIcon;
