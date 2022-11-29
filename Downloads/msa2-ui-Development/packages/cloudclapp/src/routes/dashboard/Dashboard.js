import React, { useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Button,
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  Card,
  CircularProgress,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import {
  CloudIcon,
  PlugIcon,
  UserFriendsIcon,
  CityIcon,
  CogIcon,
  MoneyBillAltIcon,
} from "react-line-awesome";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";
import { useSnackbar } from "notistack";
import { ReactComponent as IconEdit } from "msa2-ui/src/assets/icons/edit.svg";

import {
  getOrganisationName,
  getEnvironmentSummary,
  fetchEnvironmentSummary,
  getPermission,
  getOrganisationId,
} from "cloudclapp/src/store/designations";
import { useSelector, useDispatch } from "react-redux";
import EnvironmentSection from "./EnvironmentSection";
import ManageConnections from "./ManageConnections";
import SummaryCard from "cloudclapp/src/components/summary-card/SummaryCard";
import InviteUsers from "./InviteUsers";
import { DASHBOARD_SUMMARY_CARDS } from "cloudclapp/src/Constants";
import Settings from "./Settings";
import DashboardEdit from "./DashboardEdit";
import { updateRepositoryFile } from "msa2-ui/src/api/repository";
import {
  userRoles,
  getUserRole,
  getToken,
  getUserDetails,
} from "cloudclapp/src/store/auth";
import QuickDeployment from "./QuickDeployment";
import { useHistory } from "react-router-dom";
import Cost from "../insights/Cost";
import { fetchUISettings, getUISettings } from "cloudclapp/src/store/settings";

const useStyles = makeStyles((theme) => {
  const { palette } = theme;

  return {
    cardsWrapper: {
      marginTop: "1%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orgIcon: {
      fontSize: "40px",
      color: palette.background.appBar,
    },
    orgName: {
      color: palette.background.appBar,
      paddingLeft: "10px",
      fontWeight: "bold",
      marginBottom: "3px",
    },
    settingBtn: {
      color: palette.background.black,
    },
    editBtn: {
      marginLeft: "8px",
    },
    envSection: {
      color: palette.text.support,
      fontWeight: "500",
    },
    sort: {
      width: "150px",
      marginLeft: "10px",
    },
    paddingTop: {
      paddingTop: "20px",
    },
  };
});

const Dashboard = () => {
  const classes = useStyles();
  const settingsData = useSelector(getUISettings);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const token = useSelector(getToken);
  const orgId = useSelector(getOrganisationId);
  const [sort, setSort] = React.useState("envName");
  const [dashboardView, setDashboardView] = useState(
    settingsData?.dashboardView,
  );

  const orgName = useSelector(getOrganisationName);
  const dashboardSummary = useSelector(getEnvironmentSummary);

  const [manageConnection, setManageConnection] = useState(false);
  const { id } = useSelector(getUserDetails);
  const [inviteUsers, setInviteUsers] = useState(false);
  const [settings, setSettings] = useState(false);
  const [dashEdit, setDashEdit] = useState(false);
  const userRole = useSelector(getUserRole);
  const isLoginUserManager = userRole <= userRoles.ADMINISTRATOR;
  const canViewCost = useSelector(getPermission("insights", "cost", "view"));

  const getSavedData = () => {
    setDashboardView(settingsData.dashboardView);
  };

  useEffect(() => {
    if (settingsData?.dashboardView) {
      getSavedData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsData]);

  const cloudConnectionsCard = {
    title: DASHBOARD_SUMMARY_CARDS.CLOUDCONNECTIONS,
    icon: PlugIcon,
    count: dashboardSummary?.cloudConnectionCount ?? 0,
    noDataText: t(
      "No Cloud Connected, add a Cloud Connection to to get started.",
    ),
    buttonText: isLoginUserManager ? t("Manage Connections") : "",
    onClickCallback: setManageConnection,
    idPrefix: "DASHBOARD_CLOUD_CONNECTIONS",
  };

  const environmentsCard = {
    title: DASHBOARD_SUMMARY_CARDS.ENVIRONMENTS,
    icon: CloudIcon,
    count: dashboardSummary?.environmentCount,
    noDataText: t(
      "You have not created any environments yet. To get started, first add a cloud connection.",
    ),
    idPrefix: "DASHBOARD_ENVIRONMENTS",
    // updatedAt: "2022-03-16 14:39:00",
  };

  const usersCard = {
    title: DASHBOARD_SUMMARY_CARDS.USERS,
    icon: UserFriendsIcon,
    count: dashboardSummary?.usersCount,
    noDataText: t(`Invite users to ${orgName}`),
    buttonText: t("List Users"),
    idPrefix: "DASHBOARD_USERS",
    onClickCallback: setInviteUsers,
  };

  const costsCard = {
    title: DASHBOARD_SUMMARY_CARDS.COSTS,
    icon: MoneyBillAltIcon,
    count: parseFloat(dashboardSummary?.totalCost).toFixed(2),
    prefix: "$",
    noDataText: t(`${orgName} does not have usage cost`),
    buttonText: canViewCost && t("See Graphs"),
    idPrefix: "DASHBOARD_COSTS",
    onClickCallback: () => {
      history.push("/insights/cost");
    },
  };

  const setRepoData = async (view) => {
    const content = {
      ...settingsData,
      dashboardView: view,
    };

    const [error, response] = await updateRepositoryFile({
      uri: `Datafiles/ccla_dashboard/${orgId}_${id}`,
      content,
      token,
    });

    if (error || response?.errorCode) {
      const message = error ? error.getMessage(t("Error ")) : response.message;

      enqueueSnackbar(message, {
        variant: error ? "error" : "success",
        action: (key) => (
          <SnackbarAction id={key} handleClose={closeSnackbar} />
        ),
      });
    }
  };

  useEffect(() => {
    dispatch(fetchEnvironmentSummary);
    dispatch(fetchUISettings);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <div data-testid="dashboard-component">
      <div>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <div className={classes.flexSpaceBtw}>
              <Typography gutterBottom variant="h5">
                <CityIcon className={classes.orgIcon} />
              </Typography>
              <Typography
                variant="h4"
                className={classes.orgName}
                id="DASHBOARD_ORGANIZATION_NAME"
              >
                {orgName}
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              {isLoginUserManager && (
                <Grid item>
                  <Button
                    variant="text"
                    startIcon={<CogIcon />}
                    className={classes.settingBtn}
                    id="DASHBOARD_SETTINGS_BUTTON"
                    onClick={setSettings}
                  >
                    {t("Settings")}
                  </Button>
                  {settings && <Settings onClose={() => setSettings(false)} />}
                </Grid>
              )}
              <Grid item>
                <Button
                  startIcon={<IconEdit className={classes.editBtn} />}
                  id="DASHBOARD_EDIT_BUTTON"
                  onClick={setDashEdit}
                />
                {dashEdit && (
                  <DashboardEdit
                    currentView={dashboardView}
                    onClose={() => setDashEdit(false)}
                    DashView={(data) => {
                      setDashboardView(data);
                      setRepoData(data);
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {!dashboardView ? (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        ) : dashboardView.value === "AppDev" ? (
          <>
            <Grid container spacing={3} className={classes.cardsWrapper}>
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <SummaryCard {...cloudConnectionsCard} />
              </Grid>
              {manageConnection && (
                <ManageConnections
                  onClose={() => {
                    setManageConnection(false);
                  }}
                />
              )}
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <SummaryCard {...environmentsCard} />
              </Grid>
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <SummaryCard {...usersCard} />
              </Grid>
              {inviteUsers && (
                <InviteUsers onClose={() => setInviteUsers(false)} />
              )}
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <SummaryCard {...costsCard} />
              </Grid>
            </Grid>
            <QuickDeployment
              cloudConnectionCount={dashboardSummary?.cloudConnectionCount}
            />

            <div
              className={classNames(classes.flexSpaceBtw, classes.paddingTop)}
            >
              <Typography
                gutterBottom
                variant="subtitle1"
                className={classes.envSection}
              >
                {t("ENVIRONMENTS")}
              </Typography>
              <div className={classes.flexSpaceBtw}>
                <Typography gutterBottom variant="subtitle2" noWrap>
                  {t("Sort by")}
                </Typography>
                <FormControl size="small">
                  <Select
                    id="DASHBOARD_ENV_SORT_BTN"
                    value={sort}
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.sort}
                  >
                    <MenuItem
                      id="DASHBOARD_ENV_SORT_NAME_BTN"
                      value={"envName"}
                    >
                      {t("Name")}
                    </MenuItem>
                    <MenuItem
                      id="DASHBOARD_ENV_SORT_DEP_COUNT_BTN"
                      value={"deployments"}
                    >
                      {t("Deployment #")}
                    </MenuItem>
                    <MenuItem
                      id="DASHBOARD_ENV_SORT_STATUS_BTN"
                      value={"status"}
                    >
                      {t("Status")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <EnvironmentSection sort={sort} />
          </>
        ) : (
          <Card>
            <Cost />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
