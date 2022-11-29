import React from "react";
import { makeStyles, Chip } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  chip: {
    borderRadius: 12,
    marginLeft: 8,
    fontWeight: 400,
  },
}));

const SecurityChip = ({ count, idPrefix, severityId, color, label }) => {
  const classes = useStyles();
  const hasSeverity = count > 0;
  return (
    <Chip
      key={severityId}
      id={`${idPrefix}_${severityId.toUpperCase()}`}
      variant={hasSeverity ? "default" : "outlined"}
      label={label ? `${label} ${count}` : `${count}`}
      style={
        hasSeverity ? { backgroundColor: color } : { color, borderColor: color }
      }
      className={classes.chip}
    />
  );
};

SecurityChip.propTypes = {
  count: PropTypes.number.isRequired,
  idPrefix: PropTypes.string.isRequired,
  severityId: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string,
};
export default SecurityChip;
