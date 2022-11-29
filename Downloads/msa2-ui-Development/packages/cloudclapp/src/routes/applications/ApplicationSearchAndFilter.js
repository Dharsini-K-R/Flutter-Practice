import React from "react";
import {
  Box,
  Grid,
  FormGroup,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import SearchBar from "../../components/searchBar/SearchBar";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import TablePagination from "cloudclapp/src/components/TablePagination";

const useStyles = makeStyles(() => ({
  boxWidthPadding: {
    width: "100%",
    paddingTop: "2%",
    paddingLeft: "2%",
  },
  searchBarWidth: {
    width: "100%",
  },
}));

const ApplicationSearchAndFilter = ({
  onSearchChangeCallBack,
  onFilterChangeCallBack,
  totalImagesCount,
  rowsPerPage,
  currentPage,
  onChangePage,
  hideFirstAndLast,
  onChangeRowsPerPage,
  searchBarText,
  filterLabel,
  searchBarProps,
  showFilter = true,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box className={classes.boxWidthPadding}>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={5}>
          <Box className={classes.searchBarWidth}>
            <SearchBar
              id="DOCKERHUB_IMAGE"
              placeholderText={searchBarText ?? t("Search ...")}
              onChangeCallback={onSearchChangeCallBack}
              width="80%"
              border="1px solid #B2BCCE"
              {...searchBarProps}
            />
          </Box>
        </Grid>
        <Grid item xs={5}>
          <TablePagination
            count={totalImagesCount}
            rowsPerPage={rowsPerPage}
            hideFirstAndLast={hideFirstAndLast}
            page={currentPage}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </Grid>
        <Grid item xs={2}>
          {showFilter && <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={onFilterChangeCallBack}
                  id="dockerhub-official-filter-checkbox"
                />
              }
              label={filterLabel ?? t("Official Images Only")}
            />
          </FormGroup>}
        </Grid>
      </Grid>
    </Box>
  );
};

ApplicationSearchAndFilter.propTypes = {
  onSearchChangeCallBack: PropTypes.func.isRequired,
  onFilterChangeCallBack: PropTypes.func,
  totalImagesCount: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  hideFirstAndLast: PropTypes.bool.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  searchBarText: PropTypes.string.isRequired,
  filterLabel: PropTypes.string,
  searchBarProps: PropTypes.object,
};
export default ApplicationSearchAndFilter;
