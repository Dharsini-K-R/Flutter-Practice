import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { Button, Typography, IconButton } from "@material-ui/core";
import createTheme from "cloudclapp/src/styles/theme";

import { ReactComponent as CloseWhite } from "msa2-ui/src/assets/icons/closeWhite.svg";

const theme = createTheme();

const styles = {
  button: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.25,
    color: theme.colors.white,
    borderRadius: 4,
    padding: 1,
  },
  closeButton: {
    borderRadius: 4,
    padding: 5,
  },
  actionWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const buttonColor = {
  default: {
    color: theme.colors.blueLight,
  },
  success: {
    color: theme.colors.white,
  },
  error: {
    color: theme.colors.white,
  },
};

/**
 * This component can be only used in "action" props for "enqueueSnackbar" which is provided by "WithSnackbar"
 * @param id is provided by "action" props. it will be used to indentify each snackbars
 * @param handleClose pass "closeSnackbar" function which is provided by "WithSnackbar" when you need close button.
 * @param addActions an array when you need additional conents. pass "name" and "function" to show a button next to dismiss button.
 *                   or pass "component" to add fully customised component.
 * @return action for "enqueueSnackbar"
 */
class SnackbarAction extends Component {
  render() {
    const { id, handleClose, addActions, variant } = this.props;

    return (
      <>
        {addActions && (
          <div style={styles.actionWrapper}>
            {addActions.map((action, i) => (
              <Fragment key={i}>
                {action.component ? (
                  action.component
                ) : (
                  <Button onClick={action.function} style={styles.button}>
                    <Typography
                      style={buttonColor[variant] || buttonColor.default}
                    >
                      {action.name || "SEE DETAILS"}
                    </Typography>
                  </Button>
                )}
              </Fragment>
            ))}
          </div>
        )}
        {handleClose && (
          <IconButton
            style={styles.closeButton}
            onClick={() => handleClose(id)}
          >
            <CloseWhite />
          </IconButton>
        )}
      </>
    );
  }
}

SnackbarAction.propTypes = {
  id: PropTypes.number.isRequired,
  variant: PropTypes.string,
  handleClose: PropTypes.func,
  addActions: PropTypes.array,
};

export default SnackbarAction;
