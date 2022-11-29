import React from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import { Typography, Card, CardActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { mergeStyles } from "msa2-ui/src/utils/styles";
import commonStyles from "cloudclapp/src/styles/commonStyles";
import { snackbarVariantStyles } from "cloudclapp/src/styles/commonStyles";

import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";

const localStyles = (theme) => ({
  card: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 24,
    paddingLeft: 24,
    marginLeft: "auto",
  },
  typography: {
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.colors.white,
  },
  actionRoot: {
    marginTop: 0,
    marginRight: -8,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 24,
  },
  icons: {
    marginLeft: "auto",
  },
});
const styles = mergeStyles([snackbarVariantStyles, commonStyles, localStyles]);

const Snackbar = (props) => {
  const { classes, variant, message, addActions } = props;
  const { closeSnackbar } = useSnackbar();
  return (
    <Card
      className={[
        classes[variant] || classes.default,
        classes.card,
        classes.commonFlexEnd,
      ].join(" ")}
    >
      <Typography variant="body2" className={classes.typography}>
        {message}
      </Typography>

      <CardActions
        classes={{ root: classes.actionRoot }}
        className={classes.commonFlexEnd}
      >
        <SnackbarAction
          id={props.id}
          variant={variant}
          handleClose={closeSnackbar}
          addActions={addActions}
        />
      </CardActions>
    </Card>
  );
};

Snackbar.propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string,
  addActions: PropTypes.array,
};

export default withStyles(styles)(Snackbar);
