import React from "react";
import ApplicationDetails from "cloudclapp/src/routes/environments/details/instances/ApplicationDetails";
import { Grid, CircularProgress } from "@material-ui/core";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import { useTranslation } from "react-i18next";
import useWorkflowInstance from "cloudclapp/src/hooks/useWorkflowInstance";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";

const DeploymentsExpandedView = ({ instanceId, appWFUri }) => {
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();
  const { isLoading, workflowInstance } = useWorkflowInstance({
    workflowPath: appWFUri,
    instanceId,
  });
  return (
    <Grid container data-testid="deployments-expanded-view-container">
      {isLoading ? (
        <div className={commonClasses.commonNoContentWrapper}>
          <CircularProgress aria-label={t("Loading")} />
        </div>
      ) : (
        <ApplicationDetails
          applications={
            workflowInstance?.[DEPLOYMENT_VARIABLES_NAME.APPLICATION]
          }
        />
      )}
    </Grid>
  );
};

export default DeploymentsExpandedView;
