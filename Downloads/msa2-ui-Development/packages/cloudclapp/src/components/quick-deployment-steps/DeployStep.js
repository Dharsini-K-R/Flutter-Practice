import React, { useState } from "react";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";

import { Divider, Grid, Typography, Box, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { getCloudVendors } from "cloudclapp/src/store/designations";
import { getServiceFromEnvironment } from "cloudclapp/src/services/CloudVendor";

import useApi from "cloudclapp/src/hooks/useApi";
import { getEstimation } from "cloudclapp/src/api/cost";

import CloudVendorIcon from "cloudclapp/src/components/cloud-vendor-icon";
import ApplicationSummaryTile from "cloudclapp/src/components/deployments/ApplicationSummaryTile";
import sum from "lodash/sum";
import {
  DEPLOYMENT_VARIABLES_NAME,
  DEPLOYMENT_ESTIMATE_GRANULARITY,
} from "cloudclapp/src/Constants";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    cloudIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "4px",
      boxShadow: `0px 4px 16px ${palette.background.boxShadow}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    flexColumn: {
      paddingLeft: "16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    cloudVendor: {
      fontWeight: "bold",
    },
    fontSubtext: {
      color: palette.background.subTextGrey,
      fontSize: "12px",
      fontWeight: "600",
    },
    flexEnd: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    estimate: {
      marginRight: 5,
    },
    total: {
      marginRight: 10,
    },
    totalUnit: {
      marginLeft: 4,
    },
    totalWrapper: {
      marginTop: 10,
    },
  };
});

const DeployStep = ({
  environmentContext,
  deploymentContext,
  selectedCloudCnt,
  selectedEnv,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const applications = deploymentContext[DEPLOYMENT_VARIABLES_NAME.APPLICATION];
  const cloudVendors = useSelector(getCloudVendors);
  const cloudService = getServiceFromEnvironment(selectedEnv, cloudVendors);

  const [granularity, setGranularity] = useState(
    DEPLOYMENT_ESTIMATE_GRANULARITY.HOURLY,
  );

  const [, error, cost, ,] = useApi(getEstimation, {
    cloudVendor: selectedEnv.cloudVendor,
    cloudService: selectedEnv.cloudService,
    environmentContext,
    deploymentContext,
    applications,
    granularity: granularity.value,
  });

  const environmentCost = cost?.environment ?? 0;
  const applicationCost = cost?.applications
    ? sum(
        Object.values(cost.applications).map((price) =>
          isNaN(price) ? 0 : price,
        ),
      )
    : 0;

  const selectedCloudConnectioName =
    selectedCloudCnt?.connections?.[0]?.connectionName;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" className={classes.flexEnd}>
          {t("Deploying")}
        </Typography>
      </Grid>
      <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
        <Typography className={classes.estimate}>{t("Estimate by")}</Typography>
        <SelectField
          id="DEPLOY_ESTIMATE_GRANULARITY"
          className={classes.selectInput}
          options={Object.values(DEPLOYMENT_ESTIMATE_GRANULARITY)}
          value={granularity}
          onChange={(granularity) => {
            setGranularity(granularity);
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        container
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        {applications?.map((data, index) => {
          const id = data[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG];
          const price = cost?.applications?.[id];
          const Footer = () => {
            if (!price) {
              return null;
            }
            return (
              <>
                {"$"}
                <NumberFormat
                  value={price}
                  displayType={"text"}
                  thousandSeparator
                />
                {" / "}
                {granularity.unit}
              </>
            );
          };

          return (
            <ApplicationSummaryTile key={index} input={data} Footer={Footer} />
          );
        })}
      </Grid>

      <Grid item xs={12} container justifyContent="flex-end">
        <Typography gutterBottom variant="body1">
          {"$"}
          <NumberFormat
            value={applicationCost}
            displayType={"text"}
            thousandSeparator
          />
          {" / "}
          {granularity.unit}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h5" className={classes.flexEnd}>
          {t("To Environment")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <div className={classes.cloudIcon}>
            <CloudVendorIcon
              vendor={selectedEnv.cloudVendor}
              service={selectedEnv.cloudService}
            />
          </div>
          <div className={classes.flexColumn}>
            <div>
              <span className={classes.cloudVendor} id={`DEPLOY_ENV_NAME`}>
                {selectedEnv.envName}
              </span>
            </div>

            <div className={classes.fontSubtext} id={`DEPLOY_VENDOR_NAME`}>
              {cloudService.displayName}
              {selectedCloudConnectioName && " - "}
              {selectedCloudConnectioName}
            </div>
          </div>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        container
        justifyContent="flex-end"
        alignItems="center"
      >
        <Typography variant="body1">
          {"$"}
          <NumberFormat
            value={environmentCost}
            displayType={"text"}
            thousandSeparator
          />
          {" / "}
          {granularity.unit}
        </Typography>
      </Grid>
      <Divider />
      <Grid
        item
        xs={12}
        container
        justifyContent="flex-end"
        alignItems="center"
        className={classes.totalWrapper}
      >
        {error ? (
          <Typography variant="subtitle1" className={classes.total}>
            {error.message}
          </Typography>
        ) : (
          cost && (
            <>
              <Typography variant="subtitle1" className={classes.total}>
                {t("Total")}
              </Typography>
              <Typography variant="h5">
                {"$"}
                <NumberFormat
                  value={environmentCost + applicationCost}
                  displayType={"text"}
                  thousandSeparator
                />
              </Typography>
              <Typography variant="subtitle1" className={classes.totalUnit}>
                {" / "}
                {granularity.unit}
              </Typography>
            </>
          )
        )}
      </Grid>
    </Grid>
  );
};

export default DeployStep;
