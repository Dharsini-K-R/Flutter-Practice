import React from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import SearchBar from "cloudclapp/src/components/searchBar/SearchBar";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import TablePagination from "cloudclapp/src/components/TablePagination";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";

const useStyles = makeStyles(({ palette }) => ({
  boxWidthPadding: {
    width: "100%",
    paddingTop: "2%",
    paddingLeft: "2%",
  },
  selectInput: {
    marginLeft: 10,
    fontWeight: "300",
    fontStyle: "normal",
    fontSize: "6px",
    lineHeight: "18px",
  },
}));

const filterBySeverity = [
  {
    value: -1,
    label: "All Severity",
    status: "All Severity",
  },
  {
    value: 0,
    label: "Emergency",
    status: "Emergency",
  },
  {
    value: 1,
    label: "Alert",
    status: "Alert",
  },
  {
    value: 2,
    label: "Critical",
    status: "Critical",
  },
  {
    value: 3,
    label: "Error",
    status: "Error",
  },
  {
    value: 4,
    label: "Warning",
    status: "Warning",
  },
  {
    value: 5,
    label: "Notice",
    status: "Notice",
  },
  {
    value: 6,
    label: "Informational",
    status: "Informational",
  },
  {
    value: 7,
    label: "Debug",
    status: "Debug",
  },
];

const LogsSearchAndFilter = ({
  onSearchChangeCallBack,
  onFilterChangeCallBack,
  severity,
  totalLogsCount,
  rowsPerPage,
  currentPage,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Box className={classes.boxWidthPadding}>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item xs={8}>
          <Box display="flex" flexDirection="row" alignItems={"center"}>
            <Box>
              <SearchBar
                id="ENVIRONMENT_LOGS"
                placeholderText={t("Search...")}
                onChangeCallback={onSearchChangeCallBack}
                width="100%"
                border="1px solid #B2BCCE"
              />
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Box paddingLeft={4}>
                <Typography id="ENVIRONMENT_LOGS_SELECT">
                  {t("Filter By")}
                </Typography>
              </Box>
              <Box>
                <SelectField
                  id="ENVIRONMENT_LOGS_FILTER"
                  className={classes.selectInput}
                  width={170}
                  options={filterBySeverity}
                  value={
                    severity === undefined
                      ? filterBySeverity[0]
                      : filterBySeverity[severity + 1]
                  }
                  onChange={(event) => onFilterChangeCallBack(event)}
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box display="flex" flexDirection="row" alignItems={"flex-end"}>
            <TablePagination
              count={totalLogsCount}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

LogsSearchAndFilter.propTypes = {
  onSearchChangeCallBack: PropTypes.func.isRequired,
  onFilterChangeCallBack: PropTypes.func.isRequired,
  severity: PropTypes.number,
  totalLogsCount: PropTypes.number,
  rowsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
};
export default LogsSearchAndFilter;
