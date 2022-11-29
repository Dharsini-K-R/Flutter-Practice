import React from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import UserButton from "cloudclapp/src/components/user-button";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon";
import { ICONS } from "cloudclapp/src/components/status-badge-icon";

const useStyles = makeStyles(({ typography }) => ({
  envName: (props) => ({
    fontSize: 18,
    marginLeft: props.configTab ? 0 : 6,
    fontWeight: 600,
    color: typography.body1.color,
  }),
  environmentTitleWrapper: {
    borderBottom: "1px solid #B2BCCE",
  },
}));

const EnvironmentSectionHeader = ({
  title,
  owner,
  status,
  isLoading = false,
  configTab = true,
}) => {
  const classes = useStyles({ configTab });
  return (
    <Grid
      item
      xs={12}
      container
      justifyContent="space-between"
      alignItems={"center"}
      className={classes.environmentTitleWrapper}
    >
      <Grid item>
        <Box display="flex" flexDirection="row" alignItems={"center"}>
          {!configTab && (
            <Box>
              <StatusBadgeIcon
                size="large"
                icon={ICONS.environment}
                status={status}
              />
            </Box>
          )}
          <Box p={1}>
            <Typography
              id="INSTANCE_DETAILS_ENVIRONMENT_NAME"
              className={classes.envName}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item>
        <Box display="flex" flexDirection="row" alignItems={"center"}>
          {/* <Typography
                id={`instance_details_created_at`}
                className={`${classes.text} ${classes.ratingText}`}
              >
                {t("Updated")}
                {": "}
                {formatDateOrString(
                  "2022-03-08T02:44:50.565Z",
                  "dd MMM yyyy HH:mm:ss",
                )}{" "}
              </Typography> */}
          <Box p={1}>
            <UserButton
              id="INSTANCE_DETAILS_OWNER_BUTTON"
              userId={owner}
              disabled={isLoading}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
EnvironmentSectionHeader.propTypes = {
  title: PropTypes.string,
  owner: PropTypes.number,
  status: PropTypes.string,
  isLoading: PropTypes.bool,
  configTab: PropTypes.bool,
};

export default EnvironmentSectionHeader;
