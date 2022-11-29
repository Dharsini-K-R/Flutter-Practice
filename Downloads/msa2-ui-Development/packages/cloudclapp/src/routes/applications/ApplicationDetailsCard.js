import React, { useState } from "react";
import { ImageIcon, TrashAltIcon } from "react-line-awesome";
import { Typography, Grid, makeStyles, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import ApplicationDetailsModal from "./ApplicationDetailsModal";

const useStyles = makeStyles(({ palette, typography, breakpoints }) => ({
  applicationContainer: (props) => ({
    width: props.width,
    boxSizing: "border-box",
    marginLeft: "1%",
    marginBottom: "1%",
    borderRadius: 4,
    backgroundColor: palette.background.applicationCardGrey,
    padding: "1%",
  }),
  iconWrapper: {
    boxSizing: "border-box",
    background: palette.common.white,
    padding: 5,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsWrapper: {
    paddingLeft: 15,
  },
  icon: {
    fontSize: "24px",
    boxSizing: "border-box",
    color: palette.background.appBar,
    paddingLeft: "1%",
    paddingBottom: "1%",
  },
  ratingNumbers: {
    fontWeight: "500",
    color: typography.body1.color,
    textAlign: "left",
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  applicationListSpacing: {
    paddingTop: "10%",
  },
  applicationName: {
    fontSize: "14px",
    color: typography.body1.color,
    fontWeight: "bold",
  },
  applicationVersion: {
    color: "#27343B",
    fontSize: 12,
    fontWeight: 500,
  },
  applicationDescription: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "left",
  },
  buttonText: {
    fontSize: 14,
    color: palette.primary.main,
    // marginLeft: 6,
  },
  viewButton: {
    padding: 0,
  },
  appAccessButton: {
    marginLeft: 16,
  },
  appAppAccessHref: {
    textDecoration: "none",
  },
  deleteButton: {
    padding: 0,
    height: "auto",
    minWidth: 0,
    alignItems: "flex-start",
  },
  trashIcon: {
    fontSize: 18,
    color: palette.error.main,
  },
}));

const ApplicationDetailsCard = ({
  index,
  input,
  deleteItemCallBack,
  showDeleteIcon = true,
  showViewDetails = false,
  width,
}) => {
  const [appDetailDialog, setAppDetailDialog] = useState(false);
  const classes = useStyles({ width });
  const { t } = useTranslation();
  const appAccess = input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_ACCESS];
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      direction="row"
      className={classes.applicationContainer}
    >
      <Grid item xs={2}>
        {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO] !== "" ? (
          <div className={classes.iconWrapper}>
            <img
              alt="Docker Logo"
              width="32px"
              height="32px"
              src={input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]}
            />
          </div>
        ) : (
          <ImageIcon className={classes.icon} />
        )}
      </Grid>
      <Grid item className={classes.detailsWrapper} xs={10}>
        <Grid container>
          <Grid item container xs direction="column">
            <Typography
              id={`APPLICATION_DETAILS_CARD_APPLICATION_NAME_${index}`}
              className={`${classes.applicationName}`}
            >
              {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]}
            </Typography>
            <Typography
              id={`APPLICATION_DETAILS_CARD_APPLICATION_VERSION_${index}`}
              className={classes.applicationVersion}
            >
              {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_VERSION]}
            </Typography>
          </Grid>
          {showDeleteIcon && (
            <Grid container item xs={1} justifyContent="flex-end">
              <Button
                id={`APPLICATION_DETAILS_CARD_DELETE_BUTTON_${
                  input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]
                }`}
                onClick={() =>
                  deleteItemCallBack(
                    input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG],
                  )
                }
                className={classes.deleteButton}
              >
                <TrashAltIcon className={classes.icon} />
              </Button>
            </Grid>
          )}
        </Grid>
        <Typography
          id={`APPLICATION_DETAILS_CARD_APPLICATION_DESCRIPTION_${index}`}
          className={classes.applicationDescription}
        >
          {input[DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]}
        </Typography>
        {showViewDetails && (
          <Button
            id={`APPLICATION_DETAILS_CARD_VIEW_DETAILS_BUTTON_${index}`}
            className={classes.viewButton}
            onClick={() => {
              setAppDetailDialog(true);
            }}
          >
            <Typography
              id={`APPLICATION_DETAILS_CARD_VIEW_DETAILS_${index}`}
              className={classes.buttonText}
            >
              {t("View Details")}
            </Typography>
          </Button>
        )}
        {appAccess?.endsWith("80") && (
          <a
            href={"http://" + appAccess}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.appAppAccessHref}
          >
            <Button
              id={`APPLICATION_DETAILS_CARD_APP_ACCESS_BUTTON_${index}`}
              className={classes.appAccessButton}
            >
              <Typography
                id={`APPLICATION_DETAILS_APP_ACCESS_${index}`}
                className={classes.buttonText}
              >
                {t("App Access")}
              </Typography>
            </Button>
          </a>
        )}
        {appDetailDialog && (
          <ApplicationDetailsModal
            input={input}
            width={width}
            index={index}
            onClose={() => setAppDetailDialog(false)}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ApplicationDetailsCard;
