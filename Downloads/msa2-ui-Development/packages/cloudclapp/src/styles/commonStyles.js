import { makeStyles } from "@material-ui/core";

const commonStyles = ({ palette, breakpoints }) => ({
  commonTextBold: {
    fontWeight: "bold",
  },
  commonTextItalic: {
    fontStyle: "italic",
  },
  commonTextNoWrap: {
    whiteSpace: "nowrap",
  },
  commonFormRowHint: {
    color: palette.text.support,
    fontStyle: "italic",
  },
  commonTextColorError: {
    color: `${palette.text.error}!important`,
  },
  commonLoginFormWrapper: {
    alignSelf: "center",
    textAlign: "center",
    minWidth: 640,
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    boxShadow:
      "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
  },
  commonBtn: {},
  commonBtnPrimary: {},
  commonBtnSecondary: {},
  commonDialogPaper: {
    background: palette.background.paper,
    borderRadius: 8,
    boxShadow:
      "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 24px rgba(49, 64, 90, 0.1), 0px 4px 16px rgba(178, 188, 206, 0.2)",
  },
  commonDialogPaperNoOverflow: {
    overflow: "initial",
  },
  commonDialogHeader: {
    alignItems: "center",
    background: palette.background.dialogHeader,
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 16px",
  },
  commonDialogHeaderIcon: {
    display: "flex",
  },
  commonDialogHeaderTitle: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "32px",
  },
  commonDialogHeaderCloseButton: {},
  commonDialogContent: {},
  commonDialogActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  commonPageHeaderText: {
    fontWeight: 600,
    color: palette.background.appBar,
  },
  commonPageHeaderIcon: {
    fontSize: "50px",
    fontWeight: 600,
    color: palette.background.appBar,
  },
  commonPageHeaderGrid: {
    alignItems: "center",
    padding: "30px 0",
  },
  commonPageHeaderContainer: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    padding: "0 1%",
  },
  commonFlexStart: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  commonTabIcon: {
    fontSize: 15,
    marginRight: 6.5,
  },
  commonXSOnlyFlexStart: {
    justifyContent: "flex-end",
    [breakpoints.only("xs")]: {
      justifyContent: "flex-start",
    },
  },
  commonFlexEnd: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  commonContainer: {
    backgroundColor: palette.background.paper,
    boxShadow:
      "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
    borderRadius: 8,
    display: "flex",
  },
  commonNoContentWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    fontSize: "15px",
    height: "100%",
    alignItems: "center",
  },
  commonTextEllipsis: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  commonLoaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
});
export const snackbarVariantStyles = ({ palette }) => ({
  default: {
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    minWidth: "auto",
  },
  success: {
    backgroundColor: palette.success.main,
    minWidth: "auto",
  },
  error: {
    backgroundColor: palette.error.main,
    minWidth: "auto",
  },
  warning: {
    backgroundColor: palette.warning.main,
    minWidth: "auto",
  },
});

export const useCommonStyles = makeStyles(commonStyles);

export default commonStyles;
