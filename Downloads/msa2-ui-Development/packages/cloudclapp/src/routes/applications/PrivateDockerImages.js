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
import { ImageIcon } from "react-line-awesome";
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

const PrivateDockerImages = ({
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
              <ImageIcon className={classes.icon} />
            </Box>
          </Grid>

          <Grid item xs={7}>
            <Grid container direction="column">
              <Typography
                id={`dockerImage_name_${index}`}
                className={`${classes.text} ${classes.ratingNumbers}`}
              >
                {" "}
                {input.name}{" "}
              </Typography>
              <Typography
                id={`dockerImage_last_updated_${index}`}
                className={`${classes.text} ${classes.ratingText}`}
              >
                {" "}
                {t("Last Updated")}
                {": "}
                {formatDateOrString(
                  input.last_updated,
                  "dd MMM yyyy HH:mm:ss",
                )}{" "}
              </Typography>
              <Typography
                id={`dockerImage_description_${index}`}
                className={`${classes.text} ${classes.dockerDescriptionText}`}
              >
                {" "}
                {input.namespace}{" "}
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
                          input.name,
                          input.namespace,
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

export default PrivateDockerImages;
