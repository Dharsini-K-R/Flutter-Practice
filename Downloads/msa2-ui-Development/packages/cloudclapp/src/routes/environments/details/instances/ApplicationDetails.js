import { Grid } from "@material-ui/core";
import React from "react";
import {
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import ApplicationDetailsCard from "../../../applications/ApplicationDetailsCard";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

const useStyles = makeStyles(({ palette }) => ({
  container: (props) => ({
    backgroundColor: palette.background.paper,
    borderRadius: 8,
    padding: props.noData ? "1%" : "1% 1% 0 0",
    display: "flex",
    marginTop: "1%",
  }),
}));

const ApplicationDetails = ({ applications }) => {
  const { t } = useTranslation();
  const classes = useStyles({ noData: isEmpty(applications) });
  const commonClasses = useCommonStyles();

  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up("xl"), { noSsr: true });
  const lg = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const md = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const sm = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const WIDTHS = ["19%", "24%", "32%", "96%", "96%"];
  const cardWidth = WIDTHS[[xl, lg, md, sm, true].findIndex((bp) => bp)];

  return (
    <Grid
      container
      className={classes.container}
      direction="row"
      data-testid="applications-tab-container"
    >
      {isEmpty(applications) ? (
        <Typography
          id="DEPLOYMENTS_NO_DEPLOYMENT"
          className={`${commonClasses.commonNoContentWrapper}`}
        >
          {t("No applications found")}
        </Typography>
      ) : (
        applications?.map((application, index) => (
          <ApplicationDetailsCard
            key={index}
            index={index}
            input={application}
            showViewDetails
            showDeleteIcon={false}
            width={cardWidth}
          />
        ))
      )}
    </Grid>
  );
};

export default ApplicationDetails;
