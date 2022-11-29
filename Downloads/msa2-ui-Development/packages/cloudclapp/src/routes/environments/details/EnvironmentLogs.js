import React from "react";
import {
  Box,
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";
import LogsSearchAndFilter from "./LogsSearchAndFilter";
import { getLogs } from "msa2-ui/src/api/logs";
import useApi from "cloudclapp/src/hooks/useApi";
import LogsTableBody from "msa2-ui/src/components/logs-table";
import ManagedEntity from "msa2-ui/src/services/ManagedEntity";
import { getOrganisation } from "cloudclapp/src/store/designations";
import { useDispatch, useSelector } from "react-redux";
import SeverityBadge from "./SeverityBadge";
import {
  getTableRowsSetting,
  changeTableRowsSetting,
} from "cloudclapp/src/store/settings";

const useStyles = makeStyles(({ palette }) => ({
  boxWrapper: {
    borderRadius: "8px",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
  spacing: {
    paddingTop: "1.5%",
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: 500,
  },
  messageText: {
    color: "#3D475A",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
  },
  dateText: {
    color: "#616B83",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
  },
  detailsRow: {
    backgroundColor: "#e7eaee",
  },
}));

const TABLE_HEADER_COLUMNS = [
  {
    id: "date",
    name: "Timestamp",
    align: "left",
    width: "25%",
  },
  {
    id: "message",
    name: "Message",
    align: "left",
    width: "55%",
  },
  {
    id: "severity",
    name: "Severity",
    align: "left",
    width: "18%",
  },
  {
    id: "details",
    name: "",
    align: "left",
    width: "2%",
  },
];

const EnvironmentLogs = ({ environment }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = React.useState("");
  const [severities, setSeverities] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    useSelector(getTableRowsSetting("environmentLogs")),
  );
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(0);
  const getElasticSearchOffset = (page, rowsPerPage) => page * rowsPerPage;

  const handleSearchStringChange = (event) => {
    setPage(0);
    setSearchString(event.target.value);
  };
  const handleSeverityTypeFilterChange = (event) => {
    setSeverities(event.value < 0 ? [] : [event.value]);
  };
  const onChangePage = (event, pageNumber) => {
    setPage(pageNumber < 0 ? 0 : pageNumber);
  };
  const onRowsPerPageChange = (_, { props }) => {
    const numberOfRows = props?.value ?? 10;
    dispatch(
      changeTableRowsSetting({
        table: "environmentLogs",
        numberOfRows,
      }),
    );
    setPage(Math.floor((page * rowsPerPage) / numberOfRows));
    setRowsPerPage(numberOfRows);
  };

  const { prefix } = useSelector(getOrganisation);
  const ubiId = ManagedEntity.buildUbiId(prefix, environment.envEntityId);

  const [loading, error, logsResponse = {}] = useApi(
    getLogs,
    {
      queryString: "*" + searchString + "*",
      severities,
      managedEntityIds: [ubiId],
      startDate: "",
      endDate: "",
      from: getElasticSearchOffset(page, rowsPerPage),
      pageSize: rowsPerPage,
    },
    !ubiId,
  );

  return (
    <Box className={classes.spacing} data-testid="environment-log-component">
      <Box className={classes.boxWrapper}>
        <LogsSearchAndFilter
          onSearchChangeCallBack={handleSearchStringChange}
          onFilterChangeCallBack={handleSeverityTypeFilterChange}
          severity={severities[0]}
          totalLogsCount={logsResponse ? logsResponse.count : 0}
          rowsPerPage={rowsPerPage}
          currentPage={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onRowsPerPageChange}
        />

        <Box className={classes.spacing}>
          <Table>
            <colgroup>
              {TABLE_HEADER_COLUMNS.map(({ id, width }) => (
                <col key={id} style={{ width }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                {TABLE_HEADER_COLUMNS.map(({ id, name }) => (
                  <TableCell key={id}>
                    <Typography
                      id={`ENVIRONMENT_LOGS_TABLE_HEADER_${id}`}
                      variant="subtitle2"
                      className={classes.tableHeader}
                    >
                      {name}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <LogsTableBody
              loading={loading}
              error={error}
              logs={logsResponse.logs}
              columns={TABLE_HEADER_COLUMNS}
              dynamicStyling={{
                dateText: classes.dateText,
                messageText: classes.messageText,
                detailsRow: classes.detailsRow,
              }}
              components={{
                TableRow: TableRow,
                SeverityBadge: SeverityBadge,
              }}
            />
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default EnvironmentLogs;
