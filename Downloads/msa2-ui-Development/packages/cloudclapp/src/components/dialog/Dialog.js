import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import { CircularProgress, makeStyles } from "@material-ui/core";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

import { TimesIcon } from "react-line-awesome";

import {
  Dialog as MaterialUiDialog,
  Button,
  Grid,
  Divider,
  IconButton,
  DialogContent,
  DialogTitle,
  DialogActions,
  Tooltip,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles(({ palette }) => ({
  contentWrapper: (props) => ({
    padding: 25,
    lineHeight: 1.5,
    letterSpacing: 0.25,
    textAlign: props.textAlignment,
    overflowX: "clip",
    position: props.position,
  }),
  tabsWrapper: {
    padding: "0 16px",
  },
  dialogContent: {
    paddingBottom: 20,
    fontSize: "1rem",
    color: palette.text.secondary,
  },
  dialogErrorContent: {
    paddingBottom: 20,
    fontSize: "0.8rem",
    color: palette.text.error,
  },
  actions: {
    padding: 16,
  },
  loader: {
    marginRight: 20,
  },
  extraAction: {
    marginRight: 10,
  },
}));

const Dialog = ({
  id,
  maxWidth = "xs",
  fullWidth = true,
  onClose,
  onExec,
  onCancel,
  extraAction,
  extraLabel,
  execLabel,
  cancelLabel,
  isLoading,
  disabled = false,
  icon,
  title = "Dialog",
  tabs,
  content,
  errorContent,
  children,
  classes,
  buttonClasses,
  validation,
  open = true,
  noActions = false,
  noPadding = false,
  textAlignment = "center",
  position = "static",
  dialogActions: ActionsComponent,
}) => {
  const localClasses = useStyles({ textAlignment, position });
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();
  const prefix = id ? id.toUpperCase() + "_" : "";

  return (
    <MaterialUiDialog
      id={`${prefix}DIALOG_TITLE`}
      open={open}
      onClose={(e, reason) => {
        onClose(e);
      }}
      aria-labelledby="modalArea"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableEscapeKeyDown={disabled}
      classes={{
        ...classes,
        paper: commonClasses.commonDialogPaper,
      }}
    >
      <DialogTitle
        id={`${prefix}modalArea`}
        className={commonClasses.commonDialogHeader}
        disableTypography
      >
        {icon && (
          <div className={commonClasses.commonDialogHeaderIcon}>{icon}</div>
        )}
        {title && (
          <Typography
            variant="h5"
            className={commonClasses.commonDialogHeaderTitle}
          >
            {title}
          </Typography>
        )}
        <IconButton
          id={`${prefix}DIALOG_BTN_CLOSE`}
          onClick={onClose}
          className={commonClasses.commonDialogHeaderCloseButton}
        >
          <TimesIcon />
        </IconButton>
      </DialogTitle>

      {tabs && (
        <Grid className={localClasses.tabsWrapper}>
          {tabs}
          <Divider color="secondary" />
        </Grid>
      )}

      <DialogContent
        className={localClasses.contentWrapper}
        style={{ padding: noPadding ? 0 : undefined }}
      >
        {content && (
          <Typography variant="body2" className={localClasses.dialogContent}>
            {content}
          </Typography>
        )}
        {errorContent && (
          <Typography
            variant="body2"
            className={localClasses.dialogErrorContent}
          >
            {errorContent}
          </Typography>
        )}
        {children}
      </DialogContent>

      {ActionsComponent && (
        <DialogActions
          className={localClasses.actions}
          id={`${prefix}DIALOG_ACTIONS`}
        >
          <ActionsComponent />
        </DialogActions>
      )}

      {!noActions && (
        <DialogActions
          className={localClasses.actions}
          id={`${prefix}DIALOG_ACTIONS`}
        >
          <Grid container justifyContent="flex-start" alignContent="center">
            {(onExec || onCancel) && (
              <Button
                id={`${prefix}DIALOG_ACTIONS_BTN_CANCEL`}
                variant="text"
                size="small"
                color="default"
                className={classnames(
                  commonClasses.commonBtn,
                  commonClasses.commonBtnSecondary,
                  { [buttonClasses]: Boolean(buttonClasses) },
                )}
                onClick={onCancel ?? onClose}
              >
                {cancelLabel ?? t("Cancel")}
              </Button>
            )}
          </Grid>
          <Grid container justifyContent="flex-end" alignContent="center">
            {isLoading && <CircularProgress className={localClasses.loader} />}
            {!onExec && (
              <Button
                id={`${prefix}DIALOG_ACTIONS_BTN_SAVE`}
                variant="contained"
                size="small"
                color="primary"
                className={classnames(
                  commonClasses.commonBtn,
                  commonClasses.commonBtnPrimary,
                  { [buttonClasses]: Boolean(buttonClasses) },
                )}
                onClick={onClose}
                disabled={disabled}
              >
                {t("OK")}
              </Button>
            )}
            {extraAction && extraLabel && (
              <Button
                id={`${prefix}DIALOG_ACTIONS_BTN_EXTRA`}
                variant={"contained"}
                size="small"
                color="primary"
                className={classnames(
                  commonClasses.commonBtn,
                  commonClasses.commonBtnPrimary,
                  { [buttonClasses]: Boolean(buttonClasses) },
                  localClasses.extraAction,
                )}
                onClick={extraAction}
                disabled={disabled}
              >
                {extraLabel}
              </Button>
            )}
            {onExec && (
              <Tooltip title={validation || ""}>
                <span>
                  <Button
                    id={`${prefix}DIALOG_ACTIONS_BTN_SAVE`}
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classnames(
                      commonClasses.commonBtn,
                      commonClasses.commonBtnPrimary,
                      { [buttonClasses]: Boolean(buttonClasses) },
                    )}
                    onClick={onExec}
                    disabled={disabled || Boolean(validation)}
                  >
                    {execLabel || t("OK")}
                  </Button>
                </span>
              </Tooltip>
            )}
          </Grid>
        </DialogActions>
      )}
    </MaterialUiDialog>
  );
};

Dialog.propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  tabs: PropTypes.element,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  errorContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  onExec: PropTypes.func,
  execLabel: PropTypes.string,
  onCancel: PropTypes.func,
  cancelLabel: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.object,
  classes: PropTypes.objectOf(PropTypes.string),
  validation: PropTypes.string,
  extraAction: PropTypes.func,
};

export default Dialog;
