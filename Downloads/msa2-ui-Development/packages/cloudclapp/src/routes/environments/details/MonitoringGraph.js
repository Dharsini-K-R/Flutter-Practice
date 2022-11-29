import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Grid,
  makeStyles,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import { monitoringPeriods } from "cloudclapp/src/routes/environments/Constants";
import Graph from "msa2-ui/src/routes/integration/managed-entities/detail/monitoring-graphs/graph/Graph";
import useApi from "cloudclapp/src/hooks/useApi";
import { getDefaultGraphs } from "msa2-ui/src/routes/integration/managed-entities/detail/monitoring-graphs/utils.js";
import isEmpty from "lodash/isEmpty";
import { getOrganisation } from "cloudclapp/src/store/designations";
import ManagedEntity from "msa2-ui/src/services/ManagedEntity";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import { DownloadIcon } from "react-line-awesome";

const useStyles = makeStyles(({ palette, typography }) => ({
  environmentWrapper: {
    marginTop: "1%",
    background: palette.background.paper,
    boxSizing: "border-box",
    borderRadius: 8,
    boxShadow:
      "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
  },
  environmentTitleWrapper: {
    borderBottom: "1px solid #B2BCCE",
    padding: "1%",
  },
  envName: {
    fontSize: 18,
    fontWeight: 600,
    color: typography.body1.color,
  },
  selectDate: {
    paddingLeft: 20,
    alignItems: "center",
  },
  selectLabel: {
    alignItems: "center",
    fontWeight: "bold",
  },
  selectInput: {
    marginLeft: 10,
  },
  graphsWrap: {
    position: "relative",
    minHeight: 500,
  },
}));

const MonitoringGraph = ({ envEntityId }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [dateInput, setDateInput] = useState(monitoringPeriods[1]);
  const commonClasses = useCommonStyles();

  const { prefix } = useSelector(getOrganisation);
  const deviceUbiId = ManagedEntity.buildUbiId(prefix, envEntityId);

  const [graphsLoading, , graphs = []] = useApi(getDefaultGraphs, {
    deviceUbiId,
    monitoringPeriod: dateInput.value,
  });

  return (
    <Grid container className={classes.environmentWrapper}>
      <Grid
        item
        xs={12}
        container
        justifyContent="space-between"
        alignItems={"center"}
        className={classes.environmentTitleWrapper}
      >
        <Grid item xs>
          <Typography
            id="ENVIRONMENT_MONITORING_TITLE"
            className={classes.envName}
          >
            {t("Monitoring")}
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs
          className={classes.selectDate}
          justifyContent="flex-end"
        >
          <Grid item>
            <Typography
              id="ENVIRONMENT_MONITORING_DATE_FILTER_TEXT"
              className={classes.selectLabel}
            >
              {t("Period")}
            </Typography>
          </Grid>
          <Grid item>
            <SelectField
              id="ENVIRONMENT_MONITORING_DATE_FILTER"
              className={classes.selectInput}
              width={170}
              options={monitoringPeriods}
              value={dateInput}
              onChange={(event) => setDateInput(event)}
              disabled={graphsLoading || isEmpty(graphs)}
            ></SelectField>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ padding: "1%" }}>
        {graphsLoading ? (
          <div className={commonClasses.commonNoContentWrapper}>
            <CircularProgress aria-label={t("Loading")} />
          </div>
        ) : isEmpty(graphs) ? (
          <Typography
            id="ENVIRONMENT_MONITORING_NO_DATA"
            className={`${commonClasses.commonNoContentWrapper}`}
          >
            {t("Monitoring information not found")}
          </Typography>
        ) : (
          graphs.map(({ id, name, kpis, data }) => (
            <Grid item xs={12}>
              <Graph
                key={id}
                t={t}
                name={name}
                kpis={kpis}
                data={data}
                chartType="line"
                downloadIcon={DownloadIcon}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
};

export default MonitoringGraph;
