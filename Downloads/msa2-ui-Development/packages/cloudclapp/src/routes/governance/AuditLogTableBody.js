import React from "react";
import TableLoading from "msa2-ui/src/components/TableLoading";
import TableMessage from "msa2-ui/src/components/TableMessage";
import { TABLE_HEADER_COLUMNS } from "cloudclapp/src/routes/governance/AuditLogs";
import { useTranslation } from "react-i18next";
import { TableBody, TableCell, Typography, makeStyles } from "@material-ui/core";
import TableRow from "msa2-ui/src/components/TableRow";
import { displayMonthDayYearTimeDate } from "msa2-ui/src/utils/date";
import { roles } from "cloudclapp/src/store/auth";

const useStyles = makeStyles(({ breakpoints, palette }) => {
  return {
    tableRowText : {
      fontSize: "15px",
      marginLeft: "6px",
    },
  }
});

const getRoleName = (roleId) => {
  const userRole = roles.find((role) => role.id === roleId);
  return userRole["name"] || roleId;
};

const AuditLogTableBody = ({ loading, logs, reload, error }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  if (loading) {
    return <TableLoading numberOfTableColumns={TABLE_HEADER_COLUMNS.length} />;
  }

  if (!logs || error || logs.length === 0) {
    return (
      <TableMessage
        message={
          error
            ? `${t("Error fetching audit logs")}. ${t(
                "Please reload the page",
              )}.`
            : t("No audit logs found")
        }
        numberOfTableColumns={TABLE_HEADER_COLUMNS.length}
      />
    );
  }

  return (
    <TableBody>
      {logs.map(
        (
          { timestamp, actor_id, actor_login, actor_role, source_ip, description },
          index,
        ) => (
          <TableRow key={index}>
            <TableCell>
              <Typography
                variant="h4"
                className={classes.tableRowText}
                id={`AUDIT_LOG_TIMESTAMP_${index}`}
              >
                {displayMonthDayYearTimeDate(timestamp)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h4"
                className={classes.tableRowText}
                id={`AUDIT_LOG_ACTOR_ID_${index}`}
              >
                {actor_id}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h4"
                className={classes.tableRowText}
                id={`AUDIT_LOG_ACTOR_LOGIN_${index}`}
              >
                {actor_login}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h4"
                className={classes.tableRowText}
                id={`AUDIT_LOG_ACTOR_ROLE_${index}`}
              >
                {getRoleName(actor_role)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h4"
                className={classes.tableRowText}
                id={`AUDIT_LOG_SOURCE_IP_${index}`}
              >
                {source_ip}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h4"
                className={classes.tableRowText}
                id={`AUDIT_LOG_DESCRIPTION_${index}`}
              >
                {description}
              </Typography>
            </TableCell>
          </TableRow>
        ),
      )}
    </TableBody>
  );
};

export default AuditLogTableBody;
