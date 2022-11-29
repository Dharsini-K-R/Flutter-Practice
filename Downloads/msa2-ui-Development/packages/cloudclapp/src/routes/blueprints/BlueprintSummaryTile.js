import React, { useEffect, useState } from "react";
import { ImageIcon, UserAltIcon } from "react-line-awesome";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  makeStyles,
  Avatar,
  Chip,
} from "@material-ui/core";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { formatDateOrString } from "msa2-ui/src/utils/date";
import CloudVendorIcon from "cloudclapp/src/components/cloud-vendor-icon";
import BlueprintDetailDialog from "./BlueprintDetailDialog";
import { getImageCache } from "cloudclapp/src/store/storage";
import { getToken } from "cloudclapp/src/store/auth";
import { ReactComponent as CloudClappLogoSVG } from "cloudclapp/src/assets/cloudclapp-logo.svg";
import { ReactComponent as UbiqubeLetteringSVG } from "cloudclapp/src/assets/UbiqubeLetteringVector.svg";

const useStyles = makeStyles(({ palette }) => ({
  bluePrintCardBoxBorder: {
    border: "1px solid rgba(178, 188, 206, 1)",
    width: "31%",
    boxSizing: "border-box",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow:
      "0px 2px 8px 0px rgba(178, 188, 206, 0.2), 0px 4px 24px 0px rgba(49, 64, 90, 0.1)",
    "&.MuiBox-root": {
      padding: "0px 0px 0px 0px",
    },
  },
  blueprintTopBorder: {
    width: "100%",
    height: "150px",
    backgroundColor: "rgba(178, 188, 206, 0.2)",
    padding: "20px 10px 10px 10px",
  },
  blueprintBottomBorder: {
    width: "100%",
    height: "100px",
    padding: "10px 10px 15px 10px",
  },
  icon: {
    fontSize: "100px",
    color: palette.background.appBar,
    paddingLeft: "1%",
    paddingBottom: "1%",
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
  date: {
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "16px",
    color: palette.text.support,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    paddingBottom: "10px",
  },
  blueprintName: {
    fontWeight: "700",
    fontSize: "12px",
    lineHeight: "16px",
    color: "#1A202F",
    textAlign: "center",
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
  fullWidth: {
    width: "100%",
  },
  text: {
    boxSizing: "border-box",
    textAlign: "left",
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

const BlueprintSummaryTile = ({
  blueprintLogo,
  blueprintOwner,
  blueprintCreationDate,
  blueprintPreview,
  blueprintName,
  providers,
  applications = [],
  description,
  path,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const applicationsArrayToDisplay = applications?.slice(0, 2);
  const token = useSelector(getToken);
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [previewURL, setPreviewURL] = useState();
  const openBlueprintDialog = () => {
    setShowBlueprint(true);
  };
  const isOwnerUbiqube =
    !isEmpty(blueprintOwner) && blueprintOwner.toLowerCase() === "ubiqube";

  const closeBlueprintDialog = () => {
    setShowBlueprint(false);
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
      <Box
        component="span"
        p={4}
        className={classes.bluePrintCardBoxBorder}
        data-testid="blueprints-summary-tile"
        onClick={openBlueprintDialog}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          direction="row"
          className={classes.blueprintTopBorder}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between"
            className={classes.fullWidth}
          >
            <Box>
              <Grid
                container
                justifyContent="center"
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
                      id={`blueprint_name_${blueprintName}`}
                      className={`${classes.text} ${classes.ownerName}`}
                    >
                      {" "}
                      {blueprintOwner}{" "}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography
                id={`blueprint_updated_date_${blueprintName}`}
                className={`${classes.text} ${classes.date}`}
              >
                {" "}
                {formatDateOrString(
                  blueprintCreationDate,
                  "dd MMM yyyy HH:mm:ss",
                )}{" "}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            className={classes.thumbnail}
          >
            {!isEmpty(previewURL) ? (
              <img alt="Preview" width="150px" height="75px" src={previewURL} />
            ) : (
              <ImageIcon className={classes.icon} />
            )}
          </Box>
        </Grid>

        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          direction="row"
          className={classes.blueprintBottomBorder}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.fullWidth}
          >
            <Box>
              <Typography
                id={`blueprint_description_${blueprintName}`}
                className={classes.blueprintName}
              >
                {" "}
                {blueprintName}{" "}
              </Typography>
            </Box>

            <Box>
              {applications.length > 0 && (
                <Chip
                  id={`blueprint_contains_app_${blueprintName}`}
                  className={classes.containsApp}
                  label={t("Contains App")}
                />
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.fullWidth}
          >
            <Box className={classes.fullWidth}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                {providers?.length > 0 &&
                  providers.map((item) => (
                    <CloudVendorIcon
                      id={`blueprint_environment_${item}_${blueprintName}`}
                      vendor={item.toLowerCase()}
                    />
                  ))}
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-end"
              className={classes.fullWidth}
            >
              {applicationsArrayToDisplay?.length > 0 &&
                applicationsArrayToDisplay.map((item) => (
                  <Chip
                    id={`blueprint_application_${blueprintName}`}
                    className={classes.containsApp}
                    label={item}
                  />
                ))}
              {applications?.length > 2 && (
                <Typography
                  id={`blueprint_application_extra_count_${blueprintName}`}
                  className={classes.extraAppsCount}
                >
                  {" "}
                  {"+"}
                  {applications?.length - 2}{" "}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
      {showBlueprint && (
        <BlueprintDetailDialog
          onClose={closeBlueprintDialog}
          blueprintOwner={blueprintOwner}
          applications={applications}
          blueprintName={blueprintName}
          description={description}
          blueprintLogo={blueprintLogo}
          blueprintPreview={blueprintPreview}
          path={path}
        />
      )}
    </>
  );
};

export default BlueprintSummaryTile;
