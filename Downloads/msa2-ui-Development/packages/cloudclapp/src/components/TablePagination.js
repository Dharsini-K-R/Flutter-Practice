import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { defaultRowsPerPageOptions } from "msa2-ui/src/Constants";
import { applyThousandSeparator } from "react-number-format/lib/utils";

import { makeStyles } from "@material-ui/core";
import { TablePagination as MUITablePagination } from "@material-ui/core";
import TablePaginationActions from "msa2-ui/src/components/TablePaginationActions";

const useStyles = makeStyles(({ palette, darkMode, typography }) => ({
  tablePagination: {
    border: 0,
    color: palette.text.secondary,
    fontSize: "0.8125rem",
    fontWeight: typography.fontWeightLight,
    letterSpacing: 0.3,
    lineHeight: "normal",
    minHeight: 0,
    paddingLeft: 0,
  },
  tablePaginationSelect: {
    fontSize: "0.8125rem",
    fontWeight: typography.fontWeightRegular,
    lineHeight: "normal",
    letterSpacing: 0.3,
    color: darkMode ? palette.text.secondary : "rgba(0, 0, 0, 0.87)",
    paddingRight: 22,
  },
}));

const TablePagination = ({
  count,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  hideFirstAndLast,
  rowsPerPageOptions = defaultRowsPerPageOptions,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <MUITablePagination
      labelRowsPerPage={`${t("Show")}:`}
      labelDisplayedRows={({ from, to, count, page }) =>
        t("displayedRows", {
          from: applyThousandSeparator(String(from), ","),
          to: applyThousandSeparator(String(to), ","),
          count: applyThousandSeparator(String(count), ","),
        })
      }
      component="div"
      classes={{
        root: classes.tablePagination,
        toolbar: classes.tablePagination,
        select: classes.tablePaginationSelect,
        menuItem: classes.tablePaginationSelect,
      }}
      rowsPerPage={rowsPerPage}
      count={isNaN(parseInt(count)) ? 0 : parseInt(count)}
      page={page}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      ActionsComponent={(props) => (
        <TablePaginationActions
          {...props}
          hideFirstAndLast={hideFirstAndLast}
        />
      )}
    />
  );
};

TablePagination.propTypes = {
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  hideFirstAndLast: PropTypes.bool,
  rowsPerPageOptions: PropTypes.array,
};

export default TablePagination;
