import React from "react";
import { useTranslation } from "react-i18next";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import EnvironmentCloudVendor from "./EnvironmentCloudVendor";
import EnvironmentSectionHeader from "./EnvironmentSectionHeader";
import PropTypes from "prop-types";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    marginTop: "1%",
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: palette.text.support,
  },
  environmentWrapper: {
    marginTop: "1%",
    background: "rgba(68,93,110,0.1)",
    boxSizing: "border-box",
    padding: "1%",
  },
  appContainer: {
    marginTop: "1%",
  },
}));

const EnvironmentDetail = ({
  environment,
  cloudVendor,
  isLoading = false,
  status,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Grid container className={classes.container}>
      <Typography id="INSTANCE_DETAILS_ENVIRONMENT" className={classes.title}>
        {t("ENVIRONMENT")}
      </Typography>
      <Grid container className={classes.environmentWrapper}>
        <EnvironmentSectionHeader
          title={environment.envName}
          status={status}
          owner={environment.cclapOwner}
          isLoading={isLoading}
          configTab={false}
        />
        <Grid container className={classes.appContainer}>
          <EnvironmentCloudVendor
            environment={environment}
            cloudVendor={cloudVendor}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

EnvironmentDetail.propTypes = {
  environment: PropTypes.object.isRequired,
  status: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default EnvironmentDetail;
