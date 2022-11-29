import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip as Tooltips,
  makeStyles,
} from "@material-ui/core";

import { COST_GRAPH, MONITORING_PERIODS } from "cloudclapp/src/Constants";
import { formatDateOrString } from "msa2-ui/src/utils/date";
import { getVendorCost } from "cloudclapp/src/api/cost";
import {
  getOrganisationId,
  getCloudVendors,
} from "cloudclapp/src/store/designations";
import { useSelector } from "react-redux";
import useApi from "cloudclapp/src/hooks/useApi";
import { merge, keyBy, values, isEmpty } from "lodash";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import CustomPeriodPicker from "cloudclapp/src/components/custom-period-picker/CustomPeriodPicker.js";
import DateRangeIcon from "@material-ui/icons/DateRange";
import CloseIcon from "@material-ui/icons/Close";
import { QuestionCircleIcon } from "react-line-awesome";
import BarCharts from "./BarCharts";

const useStyles = makeStyles(() => {
  return {
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    Loadspinner: {
      marginLeft: "10px",
      marginTop: "5px",
    },
    errorMessage: {
      margin: 30,
    },
  };
});

const CloudProviderCost = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [dateInput, setDateInput] = useState(MONITORING_PERIODS.MONTHLY);

  const [isCustomPeriodShown, setIsCustomPeriodShown] = useState(false);
  const [isRemoveFilter, setIsRemoveFilter] = useState(false);
  const [monitoringPeriod, setMonitoringPeriod] = useState(COST_GRAPH.INITIAL);

  let chartData = [{}];

  const cloudVendors = useSelector(getCloudVendors);
  const orgId = useSelector(getOrganisationId);

  const [isLoading, error, vendorCost, ,] = useApi(getVendorCost, {
    orgId,
    region: "ap-southeast-1",
    granularity: dateInput.value,
    startDate: formatDateOrString(monitoringPeriod[0], "yyyy-MM-dd"),
    endDate: formatDateOrString(monitoringPeriod[1], "yyyy-MM-dd"),
  });

  const availableVendors = Object.entries(cloudVendors).filter(([vendor]) =>
    vendorCost ? Boolean(vendorCost[vendor]?.length) : true,
  );

  if (!error && vendorCost && availableVendors.length) {
    const main = availableVendors.reduce((acc, [vendor, { displayName }]) => {
      const costData = vendorCost[vendor][0]?.[`${vendor}-connection-1`] ?? [];
      const ret = costData.map((entry) => ({
        date: formatDateOrString(entry.startDate, dateInput.format),
        [displayName]: entry.cost.toFixed(2),
      }));
      return { ...acc, [vendor]: ret };
    }, {});

    const mergeCloudData = (main) => {
      if (main !== undefined) {
        const temp = {};
        Object.keys(main).forEach((cloud) => {
          const key = keyBy(main[cloud], "date");
          return merge(temp, key);
        });

        chartData = values(temp);
      }
    };

    mergeCloudData(main);
  }

  const handleCustomPeriodVisibility = () =>
    setIsCustomPeriodShown(!isCustomPeriodShown);

  const handleMonitoringPeriodChange = (
    customPeriod,
    shouldToggleVisibility = true,
  ) => {
    setMonitoringPeriod(customPeriod);
    shouldToggleVisibility && handleCustomPeriodVisibility();
    setIsRemoveFilter(shouldToggleVisibility);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <div className={classes.flexSpaceBtw}>
          <Typography variant="h5">{t("Costs / Cloud Provider")}</Typography>
        </div>
        <Grid container alignItems="center" justifyContent="center">
          <Typography className={classes.errorMessage}>
            {error.getMessage(t("Unable to load Cost per Cloud Provider."))}
          </Typography>
        </Grid>
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={7}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box p={1}>
              <Typography noWrap variant="h5">
                {t("Costs / Cloud Provider")}
              </Typography>
            </Box>
            <Tooltips
              title={
                <React.Fragment>
                  <Typography color="inherit">{t("Cost / Clouds")}</Typography>
                  {t(
                    "The Cost is based on your credentials you saved as Cloud Connection. Some data might not be related to your Environments as It shows all costs linked to the cloud accounts.",
                  )}
                </React.Fragment>
              }
              arrow
            >
              <QuestionCircleIcon style={{ fontSize: 20, color: "#384052" }} />
            </Tooltips>
            <Box p={1}>
              <Tooltips title={t("Select custom period")}>
                <IconButton
                  id="COST_GRAPHS_OPEN_PERIOD_POPUP"
                  onClick={handleCustomPeriodVisibility}
                >
                  <DateRangeIcon color={"primary"} />
                </IconButton>
              </Tooltips>
            </Box>
            {isRemoveFilter && (
              <Box>
                <Tooltips title={t("Clear")}>
                  <IconButton
                    id="COST_GRAPHS_RESET_PERIOD"
                    onClick={() =>
                      handleMonitoringPeriodChange(COST_GRAPH.INITIAL, false)
                    }
                  >
                    <CloseIcon color="action" />
                  </IconButton>
                </Tooltips>
              </Box>
            )}
            {isLoading && (
              <Box p={1}>
                <div className={classes.Loadspinner}>
                  <CircularProgress size={20} sx={{ p: 3 }} />
                </div>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={5} container justifyContent="flex-end">
          <SelectField
            id="COST_GRAPHS_DATE_FILTER"
            className={classes.selectInput}
            width={170}
            options={Object.values(MONITORING_PERIODS)}
            value={dateInput}
            onChange={(event) => {
              setDateInput(event);
            }}
            disabled={isLoading || isEmpty(chartData)}
          />
        </Grid>
      </Grid>

      {availableVendors.length ? (
        <>
          <BarCharts data={chartData} vendor={availableVendors} />
        </>
      ) : (
        <Grid container alignItems="center" justifyContent="center">
          <Typography className={classes.errorMessage}>
            {t("There are no data to show.")}
          </Typography>
        </Grid>
      )}
      {isCustomPeriodShown && (
        <CustomPeriodPicker
          values={monitoringPeriod}
          onClose={handleCustomPeriodVisibility}
          onSelect={handleMonitoringPeriodChange}
          minDate={COST_GRAPH.MIN_DATE}
          maxDate={COST_GRAPH.MAX_DATE}
        />
      )}
    </>
  );
};

export default CloudProviderCost;
