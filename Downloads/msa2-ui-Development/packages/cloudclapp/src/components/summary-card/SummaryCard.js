import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import SecurityStatusIcon from "cloudclapp/src/components/security-status-icon";
import { formatDateOrString } from "msa2-ui/src/utils/date";
import { CircularProgress } from "@material-ui/core";
import { ENVIRONMENT_SUMMARY_CARDS } from "cloudclapp/src/Constants";

const useStyles = makeStyles(({ palette, typography }) => {
  return {
    cardStyle: {
      height: "220px",
      padding: "5px",
      borderRadius: "10px",
      boxShadow:
        "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
    },
    bodyWrapper: {
      alignItems: "center",
      height: "7em",
    },
    headerWrapper: {
      height: "2em",
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    opaqueIcon: {
      fontSize: "35px",
      opacity: "0.2",
    },
    bodyText: {
      color: typography.body1.color,
      fontWeight: "500",
    },
    securityStatus: (props) => ({
      fontSize: 40,
      color: props.statusColor,
    }),
    textSupport: {
      color: palette.text.support,
      marginTop: "10px",
      fontWeight: "600",
    },
    button: {
      color: palette.primary.main,
      "&.MuiButton-outlined": {
        border: `1px solid ${palette.primary.main}`,
      },
    },
    lastAdded: {
      color: palette.text.support,
      fontWeight: "600",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    iconWrapper: {
      width: 75,
    },
    fullWidth: {
      width: "100%",
    },
    loader: {
      height: 150,
    },
  };
});
const SummaryCard = ({
  title,
  icon: SummaryIcon,
  count = 0,
  prefix = "",
  noDataText,
  buttonText,
  buttonDisabled = false,
  disabledButtonText = "",
  onClickCallback,
  securityLabel,
  status,
  statusColor,
  updatedAt,
  isLoading = false,
  idPrefix = "",
}) => {
  const classes = useStyles({ statusColor });
  const { t } = useTranslation();
  return (
    <Card className={classes.cardStyle}>
      <CardContent>
        <Grid
          container
          className={`${classes.flexSpaceBtw} ${classes.headerWrapper}`}
        >
          <Typography variant="h5" id={`${idPrefix}_CARD_TITLE`}>
            {title}
          </Typography>
          <SummaryIcon
            className={classes.opaqueIcon}
            id={`${idPrefix}_CARD_ICON`}
          />
        </Grid>

        {isLoading ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            className={classes.loader}
          >
            <CircularProgress aria-label={t("Loading")} />
          </Grid>
        ) : (
          <>
            {title === ENVIRONMENT_SUMMARY_CARDS.SECURITY ||
            title === ENVIRONMENT_SUMMARY_CARDS.WEBAPPSECURITY ? (
              <Grid container className={classes.bodyWrapper}>
                <Grid
                  item
                  className={classes.iconWrapper}
                  container
                  alignContent="center"
                >
                  <SecurityStatusIcon
                    id={`${idPrefix}_CARD_SECURITY_STATUS_ICON`}
                    status={status}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    id={`${idPrefix}_CARD_SECURITY_STATUS`}
                    variant="h5"
                    className={classes.securityStatus}
                  >
                    {securityLabel}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid container className={classes.bodyWrapper}>
                {count > 0 ? (
                  <Typography
                    variant="h2"
                    className={classes.bodyText}
                    id={`${idPrefix}_CARD_COUNT`}
                  >
                    {prefix}
                    {count}
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    className={classes.textSupport}
                    id={`${idPrefix}_CARD_NO_DATA`}
                  >
                    {noDataText}
                  </Typography>
                )}
              </Grid>
            )}

            <Grid container className={classes.flexSpaceBtw}>
              <Tooltip title={buttonDisabled ? disabledButtonText : undefined}>
                <Grid item xs>
                  {buttonText && (
                    <Button
                      variant="outlined"
                      id={`${idPrefix}_CARD_ACTION_BUTTON`}
                      className={classes.button}
                      onClick={onClickCallback}
                      disabled={buttonDisabled}
                    >
                      {buttonText}
                    </Button>
                  )}
                </Grid>
              </Tooltip>
              {updatedAt &&
              (count > 0 ||
                title === ENVIRONMENT_SUMMARY_CARDS.SECURITY ||
                title === ENVIRONMENT_SUMMARY_CARDS.WEBAPPSECURITY) ? (
                <Grid item xs className={classes.fullWidth}>
                  <Typography variant="body1" className={classes.lastAdded}>
                    {t("Last Added")}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={classes.lastAdded}
                    id={`${idPrefix}_CARD_LAST_UPDATED_AT`}
                  >
                    {formatDateOrString(updatedAt, "dd MMM yyyy HH:mm:ss")}
                  </Typography>
                </Grid>
              ) : null}
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
