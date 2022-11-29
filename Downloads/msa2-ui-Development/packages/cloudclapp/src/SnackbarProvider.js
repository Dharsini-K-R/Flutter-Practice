import React from "react";
import { SnackbarProvider as NotistackSnackbarProvider } from "notistack";

/**
 * MATERIAL UI
 */
import { withStyles } from "@material-ui/core";

/**
 * COMPONENTS
 */
import Snackbar from "cloudclapp/src/components/snackbar/Snackbar";
import { snackbarVariantStyles } from "cloudclapp/src/styles/commonStyles";

const SnackbarProvider = ({ classes, children }) => {
  return (
    <NotistackSnackbarProvider
      classes={{
        base: classes.default,
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      hideIconVariant
      children={(key) => <Snackbar id={key} />}
    >
      {children}
    </NotistackSnackbarProvider>
  );
};

export default withStyles(snackbarVariantStyles)(SnackbarProvider);
