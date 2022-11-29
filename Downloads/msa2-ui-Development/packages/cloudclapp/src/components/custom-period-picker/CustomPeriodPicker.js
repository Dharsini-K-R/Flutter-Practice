import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  DialogActions,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "msa2-ui/src/styles/commonStyles";
import classNames from "classnames";
import DateFnsUtils from "@date-io/date-fns";
import {
     KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import format from "date-fns/format";
import subHours from "date-fns/subHours";

const CustomPeriodPicker = ({ values, onClose, onSelect, minDate, maxDate }) => {
  const { t } = useTranslation();
  const commonClasses = useCommonStyles();

  const [startDate, setStartDate] = useState(
    values[0] || subHours(new Date(), 1),
  );
  const [endDate, setEndDate] = useState(values[1] || new Date());
  const [isInvalidPeriod, setIsInvalidPeriod] = useState(false);

  const handleSelect = () => {
    if (format(startDate, "t") >= format(endDate, "t")) {
      return setIsInvalidPeriod(true);
    }

    setIsInvalidPeriod(false);
    onSelect([startDate, endDate]);
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      classes={{
        paper: commonClasses.commonDialogPaper,
      }}
    >
      <DialogTitle
        className={commonClasses.commonDialogHeader}
        disableTypography
      >
        <Typography
          variant="h4"
          className={commonClasses.commonDialogHeaderTitle}
          aling="center"
        >
          {t("Select custom period")}
        </Typography>
        <IconButton
          onClick={onClose}
          className={commonClasses.commonDialogHeaderCloseButton}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className={commonClasses.commonDialogContent}>
        <Grid container alignItems="center" justifyContent="center" spacing={4}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="yyyy/MM/dd"
                label={t("Start date")}
                value={startDate}
                minDate={minDate}
                maxDate={maxDate}
                required
                onChange={(date) => setStartDate(date)}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="yyyy/MM/dd"
                label={t("End date")}
                value={endDate}
                minDate={minDate}
                maxDate={maxDate}
                required
                onChange={(date) => setEndDate(date)}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          {isInvalidPeriod && (
            <Grid item xs={12}>
              <Typography align="center" color="error">
                {t("Invalid period")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions className={commonClasses.commonFlexCenter}>
        <Button
          id="MONITORING_GRAPHS_CLOSE_CUSTOM_PERIOD_BTN"
          variant="text"
          size="small"
          color="default"
          className={classNames(
            commonClasses.commonBtn,
            commonClasses.commonBtnSecondary,
          )}
          onClick={onClose}
        >
          {t("Cancel")}
        </Button>
        <Button
          id="MONITORING_GRAPHS_SELECT_CUSTOM_PERIOD_BTN"
          variant="contained"
          size="small"
          color="primary"
          className={classNames(
            commonClasses.commonBtn,
            commonClasses.commonBtnPrimary,
          )}
          onClick={handleSelect}
          disabled={!startDate || !endDate}
        >
          {t("Select")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CustomPeriodPicker.propTypes = {
  values: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CustomPeriodPicker;
