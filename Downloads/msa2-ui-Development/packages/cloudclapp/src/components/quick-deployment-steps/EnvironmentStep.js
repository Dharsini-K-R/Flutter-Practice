import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
} from "@material-ui/core";

import { PlusCircleIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";

import CreateDialog from "../../routes/environments/dialogs/Create";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon/StatusBadgeIcon";
import {
  getEnvironments,
  fetchEnvironments,
  fetchEnvironmentSummary,
  getCloudVendors,
} from "cloudclapp/src/store/designations";

import { useSelector, useDispatch } from "react-redux";
import { ENVIRONMENT_COMMUNITY_ACCOUNT } from "cloudclapp/src/Constants";
import { isEmpty } from "lodash";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette }) => {
  return {
    flexEnd: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    envRadio: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    noContentMessage: {
      color: palette.text.support,
      fontWeight: "600",
    },
  };
});

const EnvironmentStep = ({
  environment,
  selectedEnv,
  isDisabled,
  cloudVendor,
  environments,
  imageType,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(selectedEnv)) {
      isDisabled(true);
    } else {
      isDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cloudVendors = useSelector(getCloudVendors);
  const getEnvironmentList = useSelector(
    getEnvironments(selectedEnv?.cloudVendor || cloudVendor),
  );

  const environmentList = imageType
    ? getEnvironmentList.filter(
        ({ cloudVendor, cloudService }) =>
          cloudVendors[cloudVendor]?.services?.[cloudService]?.imageType ===
          imageType,
      )
    : getEnvironmentList;

  useEffect(() => {
    dispatch(fetchEnvironments);
  }, [dispatch]);

  const [value, setValue] = useState(selectedEnv.envId || 0);

  const handleChange = (data) => {
    setValue(data.envId);
    environment(data);
    isDisabled(false);
  };

  const handleModal = () => setOpen(!open);

  const canCreateEnvironment = useSelector(
    getPermission("environments", "general", "create"),
  );

  return (
    <Grid>
      <Typography gutterBottom variant="h5" className={classes.flexEnd}>
        {t("Pick an Environment")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
        {environmentList.length ? (
          <RadioGroup value={value}>
            {environmentList.map((item, index) => {
              return (
                <FormControlLabel
                  value={item.envId}
                  label={
                    <StatusBadgeIcon
                      size="small"
                      status={`${item.status}`}
                      label={`${item.envName}`}
                    />
                  }
                  control={<Radio color="primary" size="small" />}
                  icon={<StatusBadgeIcon status={`${item.status}`} />}
                  onChange={() => handleChange(item)}
                  className={classes.envRadio}
                  key={index}
                  id={`ENVIRONMENT_RADIO_${index}`}
                />
              );
            })}
          </RadioGroup>
        ) : (
          <Typography variant="body1" className={classes.noContentMessage}>
            {t("There are no available Environments")}
          </Typography>
        )}
      </Box>
      {canCreateEnvironment && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Tooltip
            title={
              environments.length >= ENVIRONMENT_COMMUNITY_ACCOUNT.count
                ? t(
                    "With a Community Account, you cannot add more than 5 environments.",
                  )
                : ""
            }
          >
            <span>
              <Button
                color="primary"
                startIcon={<PlusCircleIcon />}
                disabled={
                  environments.length >= ENVIRONMENT_COMMUNITY_ACCOUNT.count
                }
                onClick={handleModal}
              >
                {t("Create New Environment")}
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}
      {open && (
        <CreateDialog
          setClose={(data) => {
            dispatch(fetchEnvironments);
            dispatch(fetchEnvironmentSummary);
            setOpen(data);
          }}
          cloudVendor={cloudVendor}
        />
      )}
    </Grid>
  );
};

export default EnvironmentStep;
