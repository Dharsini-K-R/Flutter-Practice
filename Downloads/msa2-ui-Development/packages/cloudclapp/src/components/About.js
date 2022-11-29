import React from "react";
import { useTranslation } from "react-i18next";

import useApi from "cloudclapp/src/hooks/useApi";
import { getSystemVersion } from "cloudclapp/src/api/settings";

import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

import { ReactComponent as CloudclappLogo } from "cloudclapp/src/assets/logo.svg";

const useStyles = makeStyles(({ palette }) => ({
  logo: {
    width: "100%",
  },
}));

const About = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [isLoading, , { version, build, uiVersion } = {}, ,] = useApi(
    getSystemVersion,
  );
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box p={1}>
                <Typography variant="body1">{t("Version")}:</Typography>
              </Box>
              <Box p={1}>
                <Typography id="ABOUT_CLOUDCLAPP_VERSION">{version}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box p={1}>
                <Typography variant="body1">{t("Build")}:</Typography>
              </Box>
              <Box p={1}>
                <Typography id="ABOUT_CLOUDCLAPP_BUILD">{build}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box p={1}>
                <Typography variant="body1">{t("UI Version")}:</Typography>
              </Box>
              <Box p={1}>
                <Typography id="ABOUT_CLOUDCLAPP_UI_VERSION">
                  {uiVersion}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
      <CloudclappLogo className={classes.logo} />
    </>
  );
};

export default About;
