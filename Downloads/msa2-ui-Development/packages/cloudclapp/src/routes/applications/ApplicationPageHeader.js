import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { CubeIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

const ApplicationPageHeader = () => {
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();
  return (
    <div
      className={commonClasses.commonPageHeaderContainer}
      data-testid="applications-container"
    >
      <Grid
        container
        className={commonClasses.commonPageHeaderGrid}
        spacing={2}
      >
        <Grid item>
          <CubeIcon className={commonClasses.commonPageHeaderIcon} />
        </Grid>
        <Grid item>
          <Typography
            id="applications_title"
            variant="h4"
            className={commonClasses.commonPageHeaderText}
          >
            {" "}
            {t("Application Images")}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default ApplicationPageHeader;
