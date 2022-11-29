import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import { Badge } from "@material-ui/core";

import { CloudIcon, StreamIcon } from "react-line-awesome";

import { managedEntityStatus } from "msa2-ui/src/Constants";
import { workflowStatus } from "msa2-ui/src/Constants";

const useStyles = makeStyles(({ palette, typography }) => {
  return {
    icon: {
      color: typography.body1.color,
    },
    badge: {
      backgroundColor: ({ backgroundColor }) => backgroundColor,
      boxShadow: ({ boxShadow }) => `${boxShadow} ${palette.background.paper}`,
      padding: 0,
      bottom: "30%",
    },
    label: {
      padding: "10px",
      fontWeight: "500",
      color: typography.subtitle2.color,
    },
  };
});

const STYLES = {
  large: { iconSize: 44, badgeSize: 14, boxShadow: "inset 0 0 0 6px" },
  medium: { iconSize: 28, badgeSize: 10, boxShadow: "0 0 0 2px" },
  small: { iconSize: 21, badgeSize: 8, boxShadow: "0 0 0 2px" },
};

export const ICONS = {
  environment: CloudIcon,
  deployment: StreamIcon,
};

const StatusBadgeIcon = ({
  icon: Icon = ICONS.environment,
  size = "medium",
  label,
  status,
  type = "environment",
  ...props
}) => {
  let statusDetails;
  if (type === "environment") {
    statusDetails = managedEntityStatus[status];
  } else {
    statusDetails = workflowStatus.find((wf) => wf.status === status);
  }
  const { icon: StatusIcon, color } = statusDetails ?? {};

  const { iconSize, badgeSize, boxShadow } = STYLES[size];
  const isLarge = iconSize > 36;
  const classes = useStyles({
    backgroundColor: isLarge ? undefined : color,
    boxShadow,
  });

  return (
    // Try to overwrite id as this can appear on DOM multiple times
    <>
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
        <Icon className={classes.icon} style={{ fontSize: iconSize }} />
      </Badge>
      <span className={classes.label}>{label}</span>
    </>
  );
};

StatusBadgeIcon.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOf(Object.keys(STYLES)),
  status: PropTypes.string,
  label: PropTypes.string,
};

export default StatusBadgeIcon;
