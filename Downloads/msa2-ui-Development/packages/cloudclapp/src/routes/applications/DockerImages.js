import React from "react";
import {
  Grid,
  Typography,
  FormGroup,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Box,
} from "@material-ui/core";
import { ImageIcon, CheckCircleOIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import { formatDateOrString } from "msa2-ui/src/utils/date";

const useStyles = makeStyles(({ palette, typography }) => ({
  text: {
    boxSizing: "border-box",
    textAlign: "left",
  },
  ratingNumbers: {
    fontWeight: "500",
    color: typography.body1.color,
    textAlign: "left",
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  ratingText: {
    color: palette.text.support,
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  dockerImageType: {
    boxSizing: "border-box",
    borderRadius: "40px",
    color: palette.common.white,
    textAlign: "left",
    lineHeight: "normal",
    fontSize: "x-small",
    paddingTop: "4px",
    paddingBottom: "4px",
    paddingLeft: "4px",
    paddingRight: "4px",
  },
  dockerImageTypeOfficial: {
    backgroundColor: "#2e8964",
  },
  dockerImageTypeVerified: {
    backgroundColor: "#023E8A",
  },
  icon: {
    fontSize: "50px",
    boxSizing: "border-box",
    color: palette.background.appBar,
    paddingLeft: "3%",
    paddingBottom: "1%",
  },
  dockerDescriptionText: {
    paddingTop: "1%",
    color: typography.body1.color,
    lineHeight: "16px",
    paddingBottom: "1%",
  },
  boxBorder: {
    border: "1px solid #B2BCCE",
    width: "95%",
    boxSizing: "border-box",
    borderRadius: "4px",
    backgroundColor: "rgba(68,93,110,0.1)",
  },
  spanImageText: {
    marginLeft: "3px",
    marginRight: "3px",
  },
  boxPadding: {
    paddingTop: "1%",
    paddingBottom: "1%",
    paddingLeft: "1%",
  },
  dockerLogoPadding: {
    paddingLeft: "10%",
  },
  dockerSpacing: {
    paddingTop: "1%",
  },
}));

const DockerImages = ({
  input,
  index,
  addItemsCallBack,
  removeItemsCallBack,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box>
      <Box className={classes.dockerSpacing} />

      <Box className={`${classes.boxBorder} ${classes.boxPadding}`}>
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
          direction="row"
        >
          <Grid item xs={1}>
            <Box className={classes.dockerLogoPadding}>
              {input.logo_url?.small !== "" || input.logo_url?.large !== "" ? (
                <img
                  alt="Docker Logo"
                  width="50px"
                  height="50px"
                  src={input.logo_url?.small || input.logo_url?.large}
                />
              ) : (
                <ImageIcon className={classes.icon} />
              )}
            </Box>
          </Grid>

          <Grid item xs={7}>
            <Grid container direction="column">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Box>
                  <Typography
                    id={`dockerImage_name_${index}`}
                    className={`${classes.text} ${classes.ratingNumbers}`}
                  >
                    {" "}
                    {input.name}{" "}
                  </Typography>
                </Box>
                <Box p={1}>
                  {input.filter_type === "official" && (
                    <CheckCircleOIcon
                      className={`${classes.dockerImageType} ${classes.dockerImageTypeOfficial}`}
                    >
                      <span className={classes.spanImageText}>
                        {t("Official Image")}
                      </span>
                    </CheckCircleOIcon>
                  )}
                  {input.filter_type === "verified_publisher" && (
                    <CheckCircleOIcon
                      className={`${classes.dockerImageType} ${classes.dockerImageTypeVerified}`}
                    >
                      <span className={classes.spanImageText}>
                        {t("Verified Publisher")}
                      </span>
                    </CheckCircleOIcon>
                  )}
                </Box>
              </Box>
              <Typography
                id={`dockerImage_last_updated_${index}`}
                className={`${classes.text} ${classes.ratingText}`}
              >
                {" "}
                {t("Last Updated")}
                {": "}
                {formatDateOrString(
                  input.updated_at,
                  "dd MMM yyyy HH:mm:ss",
                )}{" "}
              </Typography>
              <Typography
                id={`dockerImage_description_${index}`}
                className={`${classes.text} ${classes.dockerDescriptionText}`}
              >
                {" "}
                {input.short_description}{" "}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={1}>
            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="flex-end"
              direction="column"
            >
              <Typography
                id={`dockerImage_rating_${index}`}
                className={`${classes.text} ${classes.ratingNumbers}`}
              >
                {" "}
                {input.pull_count}{" "}
              </Typography>
              <Typography className={`${classes.text} ${classes.ratingText}`}>
                {" "}
                {t("Downloads")}{" "}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={1}></Grid>

          <Grid item xs={1}>
            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="stretch"
              direction="column"
            >
              <Typography
                id={`dockerImage_stars_${index}`}
                className={`${classes.text} ${classes.ratingNumbers}`}
              >
                {" "}
                {input.star_count}{" "}
              </Typography>
              <Typography className={`${classes.text} ${classes.ratingText}`}>
                {" "}
                {t("Stars")}{" "}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={1}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    id={`demo-checkbox-${index}`}
                    onChange={(e) =>
                      e.target.checked
                        ? addItemsCallBack(
                            input.name,
                            input.slug,
                            input.short_description,
                            input.logo_url?.small || input.logo_url?.large,
                          )
                        : removeItemsCallBack(input.slug)
                    }
                  />
                }
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DockerImages;
