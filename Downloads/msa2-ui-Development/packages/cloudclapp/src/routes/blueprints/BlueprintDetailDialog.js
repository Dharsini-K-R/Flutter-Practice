import React, { useEffect, useState } from "react";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { useTranslation } from "react-i18next";
import {
  makeStyles,
  Grid,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@material-ui/core";
import { PropTypes } from "prop-types";
import { ImageIcon } from "react-line-awesome";
import { isEmpty } from "lodash";
import { UserAltIcon } from "react-line-awesome";
import { getImageCache } from "cloudclapp/src/store/storage";
import { useSelector } from "react-redux";
import { getToken } from "cloudclapp/src/store/auth";
import CreateDialog from "../../routes/environments/dialogs/Create";
import { getEnvironments } from "../../store/designations";
import { ENVIRONMENT_COMMUNITY_ACCOUNT } from "cloudclapp/src/Constants";
import { ReactComponent as CloudClappLogoSVG } from "cloudclapp/src/assets/cloudclapp-logo.svg";
import { ReactComponent as UbiqubeLetteringSVG } from "cloudclapp/src/assets/UbiqubeLetteringVector.svg";

const useStyles = makeStyles(({ palette, typography }) => ({
  icon: {
    fontSize: "100px",
    color: palette.background.appBar,
    paddingLeft: "1%",
    paddingBottom: "1%",
  },
  preview: {
    width: "100%",
    backgroundColor: "rgba(178, 188, 206, 0.2)",
  },
  previewTypography: {
    paddingBottom: "1%",
    paddingTop: "3%",
    color: palette.text.support,
    lineHeight: "normal",
    fontWeight: "700",
  },
  bluePrintDetail: {
    paddingTop: "3%",
    width: "100%",
  },
  avatar: {
    height: 24,
    width: 24,
    color: palette.text.secondary,
    backgroundColor: "rgba(68,93,110,0.1)",
  },
  ownerName: {
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "16px",
    color: palette.text.secondary,
    textAlign: "left",
    paddingLeft: "15%",
  },
  text: {
    boxSizing: "border-box",
    textAlign: "left",
  },
  containsApp: {
    fontWeight: "400",
    color: palette.text.secondary,
    textAlign: "center",
    lineHeight: "16px",
    background: "rgba(178, 188, 206, 0.2)",
    borderRadius: "40px",
  },
  extraAppsCount: {
    color: "#1A202F",
    textAlign: "center",
  },
  blueprintName: {
    fontWeight: "700",
    fontSize: "16px",
    lineHeight: "16px",
    color: "#1A202F",
    textAlign: "center",
  },
  blueprintDescription: {
    paddingTop: "1%",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "20px",
    color: typography.body1.color,
    textAlign: "center",
  },
  cloudclapplogo: {
    borderRadius: "10px 0 0 10px",
  },
  ubiqubeLettering: {
    paddingLeft: 10,
    borderRadius: "10px 0 0 10px",
    paddingBottom: 4,
  },
}));

const BlueprintDetailDialog = ({
  onClose,
  blueprintOwner,
  applications,
  blueprintName,
  description,
  blueprintLogo,
  blueprintPreview,
  path,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const applicationsArrayToDisplay = applications?.slice(0, 2);
  const token = useSelector(getToken);
  const [createEnvironment, setCreateEnvrionment] = useState(false);
  const [previewURL, setPreviewURL] = useState();
  const environments = useSelector(getEnvironments());
  const isOwnerUbiqube =
    !isEmpty(blueprintOwner) && blueprintOwner.toLowerCase() === "ubiqube";
  const canCreateEnvironment =
    environments.length >= ENVIRONMENT_COMMUNITY_ACCOUNT.count ? false : true;

  const useBlueprintAsNewEnvrionment = () => {
    setCreateEnvrionment(true);
  };

  const closeCreateEnvironmentDialog = () => {
    setCreateEnvrionment(false);
    onClose();
  };

  useEffect(() => {
    if (!isEmpty(blueprintPreview)) {
      getImageCache({ token, path: blueprintPreview }).then((response) => {
        const { url } = response;
        setPreviewURL(url);
      });
    }
  }, [blueprintPreview, token]);

  return (
    <>
      <Dialog
        maxWidth="md"
        onClose={onClose}
        title={t("Blueprint")}
        execLabel={t("Use as a New Environment")}
        onExec={useBlueprintAsNewEnvrionment}
        disabled={!canCreateEnvironment}
        validation={
          !canCreateEnvironment
            ? t(
                "With a Community Account, you cannot add more than 5 environments.",
              )
            : undefined
        }
        id={t("USE_AS_ENVIRONMENT")}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="flex-start"
          direction="column"
        >
          <Grid item className={classes.preview} alignItems="center" xs={12}>
            <Grid
              container
              justifyContent="center"
              alignItems="flex-start"
              direction="column"
            >
              <Grid
                item
                className={classes.preview}
                alignItems="center"
                xs={12}
              >
                <Typography
                  className={classes.previewTypography}
                  id="BLUEPRINT_PREVIEW_TEXT"
                >
                  {t("PREVIEW")}
                </Typography>
              </Grid>
              <Grid
                item
                className={classes.preview}
                alignItems="center"
                xs={12}
              >
                {!isEmpty(previewURL) ? (
                  <img
                    alt="Blueprint Logo"
                    width="350px"
                    height="250px"
                    src={previewURL}
                  />
                ) : (
                  <ImageIcon className={classes.icon} />
                )}
              </Grid>
            </Grid>
          </Grid>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.bluePrintDetail}
          >
            <Box>
              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                direction="row"
              >
                <Grid item>
                  {isOwnerUbiqube ? (
                    <CloudClappLogoSVG className={classes.cloudclapplogo} />
                  ) : (
                    <Avatar className={classes.avatar}>
                      <UserAltIcon />
                    </Avatar>
                  )}
                </Grid>
                <Grid item>
                  {isOwnerUbiqube ? (
                    <UbiqubeLetteringSVG className={classes.ubiqubeLettering} />
                  ) : (
                    <Typography
                      id={`blueprint_detail_dialog_name_${blueprintName}`}
                      className={`${classes.text} ${classes.ownerName}`}
                    >
                      {" "}
                      {blueprintOwner}{" "}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {applicationsArrayToDisplay?.length > 0 &&
                applicationsArrayToDisplay.map((item) => (
                  <Chip
                    id={`blueprint_detail_dialog_application_${blueprintName}`}
                    className={classes.containsApp}
                    label={item}
                  />
                ))}
              {applications?.length > 2 && (
                <Typography
                  id={`blueprint_detail_dialog_application_extra_count_${blueprintName}`}
                  className={classes.extraAppsCount}
                >
                  {" "}
                  {"+"}
                  {applications?.length - 2}{" "}
                </Typography>
              )}
            </Box>
          </Box>

          <Grid
            container
            justifyContent="center"
            alignItems="flex-start"
            direction="column"
            className={classes.bluePrintDetail}
          >
            <Typography
              id={`blueprint_detail_dialog_name_${blueprintName}`}
              className={classes.blueprintName}
            >
              {" "}
              {blueprintName}{" "}
            </Typography>
            <Typography
              id={`blueprint_detail_dialog_description_${blueprintName}`}
              className={classes.blueprintDescription}
            >
              {" "}
              {description}{" "}
            </Typography>
          </Grid>
        </Grid>
      </Dialog>
      {createEnvironment && (
        <CreateDialog
          setClose={closeCreateEnvironmentDialog}
          createEnvironmetFromBlueprint={true}
          path={path}
        />
      )}
    </>
  );
};

BlueprintDetailDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BlueprintDetailDialog;
