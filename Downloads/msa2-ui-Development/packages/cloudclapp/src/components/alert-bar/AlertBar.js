import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import {
  ExclamationTriangleIcon,
  CloseIcon,
  RefreshIcon,
} from "react-line-awesome";

const useStyles = makeStyles(() => ({
  alertWrapper: {
    fontSize: 14,
    backgroundColor: "#EB4E58",
    color: "#FFF",
    alignItems: "center",
    height: 40,
  },
  fullHeight: {
    height: "100%",
  },
  icon: {
    fontSize: 20,
    color: "#FFF",
  },
  message: {
    marginTop: 4,
  },
}));

const AlertBar = ({
  message,
  onReload,
  onClose = () => {},
  reverseMargin = 0,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [show, setShow] = useState(true);
  return (
    <Collapse in={show}>
      <Grid
        container
        alignItems="center"
        className={classes.alertWrapper}
        style={{
          width: `calc(100% + ${reverseMargin * 2}px)`,
          marginLeft: -reverseMargin,
          marginTop: -reverseMargin,
        }}
      >
        <Grid item xs={2}></Grid>
        <Grid
          item
          xs={8}
          container
          justifyContent="center"
          className={classes.fullHeight}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={classes.fullHeight}
          >
            <Box p={1}>
              <ExclamationTriangleIcon className={classes.icon} />
            </Box>
            <Box p={1} className={classes.fullHeight}>
              <Tooltip title={message}>
                <Typography variant="subtitle1" className={classes.message}>
                  {message}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2} container justifyContent="flex-end">
          {onReload && (
            <Tooltip title={t("Reload")}>
              <IconButton
                id="ALERT_BAR_RELOAD_BUTTON"
                className={classes.icon}
                onClick={onReload}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t("Close")}>
            <IconButton
              id="ALERT_BAR_CLOSE_BUTTON"
              className={classes.icon}
              onClick={() => {
                onClose();
                setShow(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Collapse>
  );
};

AlertBar.propTypes = {
  message: PropTypes.string.isRequired,
  onReload: PropTypes.func,
  onClose: PropTypes.func,
  reverseMargin: PropTypes.number,
};

export default AlertBar;
