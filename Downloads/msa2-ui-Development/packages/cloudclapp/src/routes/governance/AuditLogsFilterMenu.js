import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  InputAdornment,
  Popover,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import {
  SearchIcon,
  FilterIcon,
  TimesCircleIcon
} from "react-line-awesome";
import TablePagination from "cloudclapp/src/components/TablePagination";
import { getTimestamp } from "msa2-ui/src/utils/date";

const useStyles = makeStyles(
  ({ breakpoints, spacing, palette, typography }) => {
    return {
      menuItem: {
        [breakpoints.up("md")]: {
          width: "auto",
          paddingRight: 15,
          "&:last-child": {
            paddingRight: 0,
          },
        },
      },
      filteredLabel: {
        color: palette.primary.main,
      },
      resetIcon: {
        marginLeft: 10,
      },
      filterField: {
        height: 70,
      },
      inputRoot: {
        "& .Mui-disabled": {
          cursor: "pointer",
        },
      },
      selectInput: {
        fontSize: "0.8125rem",
        lineHeight: "1.2rem",
        padding: "0px 38px 2px 10px",
        textTransform: "capitalize",
        width: 120,
      },
      select: {
        height: 37,
        borderRadius: 20,
        padding: 6,
        marginRight: 10,
        backgroundColor: "transparent",
        "&:hover, &:focus, &:active": {
          backgroundColor: "transparent",
        },
      },
      formControl: {
        margin: spacing(1),
        minWidth: 120,
      },
      searchInputLabel: {
        fontSize: "0.8125rem",
        marginLeft: 10,
      },
      searchField: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 30,
        },
      },
      filterIcon: {
        position: "absolute",
        top: 18,
        left: 15,
      },
      filterInputLabel: {
        fontSize: "0.8125rem",
        position: "absolute",
        top: -8,
        left: 30,
      },
      paper: {
        overflowY: "inherit",
        overflowX: "inherit",
        padding: 10,
      },
      field: {
        textAlign: "left",
        width: 350,
      },
      pagination: {
        marginLeft: "auto",
      },
    };
  },
);

const LogFilterMenu = ({
  searchValue,
  handleSearchByChange,
  userId,
  setUserId,
  IP,
  setIP,
  startDate,
  startDateTimestamp,
  setStartDate,
  setStartDateTimestamp,
  endDate,
  endDateTimestamp,
  setEndDate,
  setEndDateTimestamp,
  count,
  page,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [showFilter, setShowFilter] = useState();

  useEffect(() => {
    if (Boolean(startDate) && endDate === null) {
      setEndDate(new Date());
      setEndDateTimestamp(getTimestamp(new Date()));
    }
  }, [startDate, setEndDateTimestamp, endDate, setEndDate]);

  const isFiltered =
    Boolean(userId) ||
    (Boolean(startDateTimestamp) && Boolean(endDateTimestamp));

  const onChangeStartDate = (value) => {
    setStartDate(value);
    setStartDateTimestamp(getTimestamp(value));
  };

  const onChangeEndDate = (value) => {
    setEndDate(value);
    setEndDateTimestamp(getTimestamp(value));
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="flex-start">
        <Grid item xs={6} md="auto" className={classes.menuItem}>
          <TextField
            id={"AUDIT_LOG_SEARCH_TEXT_FIELD"}
            variant="outlined"
            fullWidth
            className={classes.searchField}
            size={"small"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              inputProps: {
                className: classnames(classes.searchInputLabel),
                "aria-label": t("Search Logs"),
                placeholder: t("Search Logs..."),
              },
            }}
            value={searchValue}
            onChange={({ target: { value } }) => handleSearchByChange(value)}
          />
        </Grid>

        <Grid item xs={6} md="auto" className={classes.menuItem}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            classes={{ root: classes.inputRoot }}
          >
            <InputAdornment className={classes.filterIcon} position="start">
              <FilterIcon color="primary" />
            </InputAdornment>
            <InputLabel
              className={classnames(classes.filterInputLabel, {
                [classes.filteredLabel]: isFiltered,
              })}
            >
              {t("Filter By")}
            </InputLabel>
            <Select
              aria-label={t("Filter By")}
              className={classes.select}
              classes={{ select: classes.selectInput }}
              disabled
              onClick={({ currentTarget }) => setShowFilter(currentTarget)}
              value={""}
            />
          </FormControl>
          {showFilter && (
            <Popover
              id={"LOG_FILTER_POPOVER"}
              open
              anchorEl={showFilter}
              onClose={() => setShowFilter(undefined)}
              classes={{ paper: classes.paper }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
                <Grid
                  container
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  className={classes.filterField}
                >
                  <TextField
                    variant="outlined"
                    id="AUDIT_LOG_FILTER_USER_ID"
                    aria-label={t("User Name Filter")}
                    label={t("User Name")}
                    value={userId}
                    onChange={({ target: { value } }) => setUserId(value)}
                    className={classes.field}
                  /> 
                  <Tooltip title={t("Reset User Name")}>
                    <IconButton
                      id="LOG_FILTER_RESET_USER_NAME"
                      aria-label={t("Reset User Name")}
                      onClick={() => setUserId("")}
                      className={classes.resetIcon}
                    >
                      < TimesCircleIcon / >
                    </IconButton>
                  </Tooltip>  
                </Grid>
                <Grid
                  container
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  className={classes.filterField}
                >
                  <TextField
                    variant="outlined"
                    id="AUDIT_LOG_FILTER_IP"
                    aria-label={t("Source IP")}
                    label={t("Source IP")}
                    value={IP}
                    onChange={({ target: { value } }) => setIP(value)}
                    className={classes.field}
                  /> 
                  <Tooltip title={t("Reset IP")}>
                    <IconButton
                      id="LOG_FILTER_RESET_IP"
                      aria-label={t("Reset IP")}
                      onClick={() => setIP("")}
                      className={classes.resetIcon}
                    >
                      < TimesCircleIcon / >
                    </IconButton>
                  </Tooltip>  
                </Grid>
                <Grid
                  container
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  className={classes.filterField}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                      variant="inline"
                      format="yyyy/MM/dd HH:mm"
                      id="AUDIT_LOG_FILTER_START_DATE"
                      label={t("Start date")}
                      value={startDate}
                      onChange={onChangeStartDate}
                      className={classes.field}
                    />
                  </MuiPickersUtilsProvider>
                  <Tooltip title={t("Reset Start Date")}>
                    <IconButton
                      id="LOG_FILTER_RESET_START_DATE"
                      aria-label={t("Reset Start Date")}
                      onClick={() => {
                        setStartDate(null);
                        setStartDateTimestamp("");
                      }}
                      className={classes.resetIcon}
                    >
                      <TimesCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid
                  container
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  className={classes.filterField}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                      variant="inline"
                      format="yyyy/MM/dd HH:mm"
                      id="AUDIT_LOG_FILTER_END_DATE"
                      label={t("End date")}
                      value={endDate}
                      onChange={onChangeEndDate}
                      className={classes.field}
                    />
                  </MuiPickersUtilsProvider>
                  <Tooltip title={t("Reset End Date")}>
                    <IconButton
                      id="LOG_FILTER_RESET_END_DATE"
                      aria-label={t("Reset End Date")}
                      onClick={() => {
                        setEndDate(null);
                        setEndDateTimestamp("");
                      }}
                      className={classes.resetIcon}
                    >
                      <TimesCircleIcon/>
                    </IconButton>
                  </Tooltip>
                </Grid>
            </Popover>
          )}
        </Grid>

        <Grid
          item
          xs={6}
          md="auto"
          className={classnames(classes.menuItem, classes.pagination)}
        >
          <TablePagination
            rowsPerPage={rowsPerPage}
            count={count}
            page={page}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </>
  );
};

LogFilterMenu.propTypes = {
  handleSearchByChange: PropTypes.func,
  searchValue: PropTypes.string,
  userId: PropTypes.string,
  setUserId: PropTypes.func,
  count: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
};

export default LogFilterMenu;
