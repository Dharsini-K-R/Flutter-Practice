import React from "react";

import useApi from "cloudclapp/src/hooks/useApi";
import { getAuditLogs } from "msa2-ui/src/api/logs";

import UserLogsDialog from "./UserLogsDialog";

const UserAudiLogs = ({ onClose, userId }) => {
  const [isLoading, , logsResponse = []] = useApi(getAuditLogs, {
    body: {
      actorRole: userId,
      sortField: "timestamp",
      sortOrder: "desc",
    },
  });
  const { logs = [] } = logsResponse;

  return (
    <>
      <UserLogsDialog
        logs={logs}
        onClose={onClose}
        userId={userId}
        isLoading={isLoading}
      />
    </>
  );
};

export default UserAudiLogs;
