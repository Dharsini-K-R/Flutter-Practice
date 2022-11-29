import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Chip } from "@material-ui/core";
import Log from "msa2-ui/src/services/Log";

const SeverityBadge = ({ severityLevel }) => {
  const { t } = useTranslation();

  if (severityLevel === undefined) {
    return null;
  }

  const { label, color, textColor } =
    Log.SEVERITY_LEVELS()[severityLevel] ?? {};
  const chipLabel = label ? `${severityLevel}: ${t(label)}` : severityLevel;

  return (
    <Chip
      label={chipLabel}
      style={{
        backgroundColor: color ?? "transparent",
        textTransform: "uppercase",
        color: textColor,
        fontWeight: 500,
      }}
    />
  );
};

SeverityBadge.propTypes = {
  severityLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SeverityBadge;
