import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { CircularProgress, Grid, Divider } from "@material-ui/core";
import { displayMonthDayYearTimeDate } from "msa2-ui/src/utils/date";
import { getUserById } from "cloudclapp/src/store/designations";

const UserLogsDialog = ({ logs, onClose, userId, isLoading }) => {
  const { t } = useTranslation();
  const user = useSelector(getUserById(userId, "id")) ?? {};

  return (
    <Dialog maxWidth="md" onClose={onClose} title={t("User Logs")}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        logs.length > 0 ? (
          logs.map(({ timestamp, description }, i) => {
            return (
              <Grid key={i}>
                <Grid
                  container
                  alignItems="flex-start"
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={4} container>
                    {displayMonthDayYearTimeDate(timestamp)}
                  </Grid>
                  <Grid item xs={8} container>
                    {description}
                  </Grid>
                </Grid>
                <Divider />
              </Grid>
            );
          })
        ) : (
          t(`Logs not available for ${user.name}`)
        )
      )}
    </Dialog>
  );
};

export default UserLogsDialog;
