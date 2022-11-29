import React, { useState } from "react";
import useApi from "cloudclapp/src/hooks/useApi";

import classNames from "classnames";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import {
    changeTableRowsSetting,
    getTableRowsSetting,
  } from "cloudclapp/src/store/settings";
import { getAuditLogs } from "msa2-ui/src/api/logs";

import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import AuditLogTableBody from "cloudclapp/src/routes/governance/AuditLogTableBody";
import AuditLogsFilterMenu from "cloudclapp/src/routes/governance/AuditLogsFilterMenu";

const TABLE_ID = "profileAuditLogs";

export const TABLE_HEADER_COLUMNS = [
  {
    id: "timestamp",
    name: "Timestamp",
    align: "left",
    active: false,
  },
  {
    id: "user_id",
    name: "User ID",
    align: "left",
    active: false,
  },
  {
    id: "user_login",
    name: "User Name",
    align: "left",
    active: false,
  },
  {
    id: "user_role",
    name: "User Role",
    align: "left",
    active: false,
  },
  {
    id: "source_ip",
    name: "Source IP",
    align: "left",
    active: false,
  },
  {
    id: "summary",
    name: "Summary",
    align: "left",
    active: false,
  },
];

const getElasticSearchOffset = (page, rowsPerPage) => page * rowsPerPage;
const AuditLogs = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const commonClasses = useCommonStyles();
  
    const [searchValue, handleSearchByChange] = useState("");
    const [userId, setUserId] = useState("");
    const [IP, setIP] = useState("");
    const [endDate, setEndDate] = useState(null);
    const [endDateTimestamp, setEndDateTimestamp] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [startDateTimestamp, setStartDateTimestamp] = useState("");
    const rowsPerPage = useSelector(getTableRowsSetting(TABLE_ID)) ?? 10;
    const [page, setPage] = useState(0);
  
    const [isLoading, error, auditLogsResponse = [], , reloadAuditLogs] = useApi(
      getAuditLogs,
      {
        body: {
          actorRole: 0,
          sortField: "timestamp",
          sortOrder: "desc",
          pageSize: rowsPerPage,
          from: getElasticSearchOffset(page, rowsPerPage),
          ...(userId && { actorLogin: userId }),
          ...(searchValue && { action: "*" + searchValue + "*" }),
          ...(startDateTimestamp && { startDate: startDateTimestamp }),
          ...(endDateTimestamp && { endDate: endDateTimestamp }),
          ...(IP && {sourceIp: IP}),
        },
      },
    );

    const onChangeRowsPerPage = (e) => {
        dispatch(
          changeTableRowsSetting({
            table: TABLE_ID,
            numberOfRows: e.target.value,
          }),
        );
    
        setPage(Math.floor((page * rowsPerPage) / e.target.value));
      };
  
    const { logs = [], count = 0 } = auditLogsResponse;

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                <Paper
                    className={classNames([
                    commonClasses.commonPaper,
                    commonClasses.commonPaperNoPadding,
                    ])}
                >
                    <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell
                            colSpan={TABLE_HEADER_COLUMNS.length}
                            className={commonClasses.commonTableCell}
                        >
                            <AuditLogsFilterMenu
                            searchValue={searchValue}
                            handleSearchByChange={handleSearchByChange}
                            userId={userId}
                            setUserId={setUserId}
                            IP={IP}
                            setIP={setIP}
                            startDate={startDate}
                            startDateTimestamp={startDateTimestamp}
                            setStartDate={setStartDate}
                            setStartDateTimestamp={setStartDateTimestamp}
                            endDate={endDate}
                            endDateTimestamp={endDateTimestamp}
                            setEndDate={setEndDate}
                            setEndDateTimestamp={setEndDateTimestamp}
                            count={count}
                            page={page}
                            onChangePage={(e, pageNumber) => setPage(pageNumber)}
                            onChangeRowsPerPage={onChangeRowsPerPage}
                            rowsPerPage={rowsPerPage}
                            />
                        </TableCell>
                        </TableRow>
                        <TableRow className={commonClasses.commonTableHeadRow}>
                        {TABLE_HEADER_COLUMNS.map((tableHeaderColumn) => (
                            <TableCell
                            key={tableHeaderColumn.id}
                            align={tableHeaderColumn.align}
                            className={commonClasses.commonTableCellDefault}
                            >
                            {tableHeaderColumn.active ? (
                                <TableSortLabel
                                id={`AUDIT_LOGS_TABLE_SORT_${tableHeaderColumn.id}`}
                                >
                                {t(tableHeaderColumn.name)}
                                </TableSortLabel>
                            ) : (
                                tableHeaderColumn.name
                            )}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <AuditLogTableBody
                        loading={isLoading}
                        error={error}
                        reload={reloadAuditLogs}
                        logs={logs}
                    />
                    </Table>
                </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default AuditLogs;