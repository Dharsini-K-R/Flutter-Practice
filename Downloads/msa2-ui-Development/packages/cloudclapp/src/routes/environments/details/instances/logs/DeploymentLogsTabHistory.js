import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";

// MODULES
import { withTranslation } from "react-i18next";
import flow from "lodash/flow";

// MATERIAL UI
import { withStyles } from "@material-ui/core";
import {
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

import {
  displayYearMonthTimeDateAsES,
  formatDateOrString,
} from "msa2-ui/src/utils/date";
import { getWorkflowInstanceHistory } from "msa2-ui/src/api/workflow";
import Process from "msa2-ui/src/services/Process";
import WorkflowLiveConsole from "cloudclapp/src/components/workflow-live-console";
import Dialog from "cloudclapp/src/components/dialog/Dialog";

// STYLES

import commonStyles from "cloudclapp/src/styles/commonStyles";

// COMPONENTS
import AlertBar from "cloudclapp/src/components/alert-bar";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon";
import { ICONS } from "cloudclapp/src/components/status-badge-icon";
import UserButton from "cloudclapp/src/components/user-button";

import TablePagination from "cloudclapp/src/components/TablePagination";
import {
  getTableRowsSetting,
  changeTableRowsSetting,
} from "cloudclapp/src/store/settings";

const localStyles = (theme) => ({
  processName: {
    fontSize: 16,
  },
  paper: {
    marginTop: theme.spacing(2),
    padding: "20px",
  },
  processNonClickWrapper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  processWrapper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    cursor: "pointer",
  },
  commonSpacer: {
    margin: "0px 10px",
  },
  processLineWrapper: {
    paddingBottom: 5,
  },
  loaderWrapper: {
    padding: 10,
    textAlign: "center",
  },
});
const styles = (e) =>
  Object.assign(commonStyles.call(this, e), localStyles.call(this, e));

class DeploymentLogsTabHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertBar: false,
      isLoading: true,
      rowsPerPage: this.props.rowsPerPage,
      page: 0,
      count: 0,
    };
  }

  // life cycle methods
  componentDidMount() {
    // don't call API when CREATE process is executed as no instanceId
    this.props.instanceId && this.getValFromApi();
  }

  getAutomationStatus = () => {
    if (this.state.isLoading) return "loading";
    if (this.state.alertBar) return "error";
    if (this.state.apiResponse === 0) return "noResults";
    return "ready";
  };
  // functions for API
  getValFromApi = async () => {
    const { token, instanceId } = this.props;

    const [
      apiError,
      apiResponse,
      apiMeta = {},
    ] = await getWorkflowInstanceHistory({
      instanceId,
      token,
      page: this.state.page,
      rowsPerPage: this.state.rowsPerPage,
    });

    const { totalcount = 0 } = apiMeta;

    if (apiError) {
      return this.setState({
        apiError,
        alertBar: true,
        isLoading: false,
        notification: false,
      });
    }
    this.setState({ apiResponse, count: Number(totalcount), isLoading: false });
  };

  reload = (addState) => {
    this.handleCloseAlertBar();
    this.setState(
      // merge objects
      Object.assign(
        {
          apiError: undefined,
          isLoading: true,
          apiResponse: undefined,
        },
        addState,
      ),
      () => {
        this.getValFromApi();
      },
    );
  };

  handleCloseAlertBar = () => {
    this.setState({ alertBar: false });
  };

  // functions for dialogs
  handleDialogOpen = (key) => {
    this.setState({ dialog: key });
  };

  handleDialogClose = () => {
    this.setState({ dialog: "" });
  };

  onChangePage = (e, value) => {
    this.setState({ page: value }, () => this.reload());
  };

  onChangeRowsPerPage = (e) => {
    this.setState(
      {
        rowsPerPage: e.target.value,
        page: Math.floor(
          (this.state.page * this.state.rowsPerPage) / e.target.value,
        ),
      },
      () => this.reload(),
    );
    this.props.changeTableRowsSetting({
      table: "deploymentLogs",
      numberOfRows: e.target.value,
    });
  };

  render() {
    const { classes, t, processes } = this.props;
    const { apiResponse } = this.state;
    return (
      <Fragment>
        <Paper className={classes.paper}>
          <TablePagination
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            count={this.state.count}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
          />
          {this.getAutomationStatus() === "loading" && (
            <div className={classes.loaderWrapper}>
              <CircularProgress />
            </div>
          )}
          {this.getAutomationStatus() === "error" && (
            // after loading - error case
            <AlertBar
              id="DEPLOYMENT_LOG_ALERT_BAR_FAILED_TO_LOAD"
              message={t("Unable to load x", { x: t("Workflows") })}
              refreshFnc={this.reload}
              closeFnc={this.handleCloseAlertBar}
            />
          )}
          {this.getAutomationStatus() === "ready" &&
            // after loading
            apiResponse.map((prc, i) => {
              const processId = prc.processId.id;
              const startingDate = prc?.status?.startingDate;
              const endingDate = prc?.status?.endingDate;
              const deployStatusIcon = prc.status?.status;
              const processCheck = Process.getDefinition(
                processes,
                prc.processId.name,
              );
              const displayName = Process.getNameFromPath(
                processes,
                prc.processId.name,
              );

              return (
                <Fragment key={processId}>
                  {/* dialog, this is available after clicking on the item */}
                  {this.state.dialog === processId && (
                    <Dialog
                      maxWidth="md"
                      onClose={this.handleDialogClose}
                      title={displayName}
                    >
                      <WorkflowLiveConsole processInstance={prc} />
                    </Dialog>
                  )}
                  <Grid
                    id={`DEPLOYMENT_LOG_SELECT_ROW_${processId}`}
                    container
                    onClick={() =>
                      this.handleDialogOpen(
                        processCheck !== undefined ? processId : "",
                      )
                    }
                    className={
                      processCheck !== undefined
                        ? [
                            classes.processWrapper,
                            classes.commonFlexStart,
                          ].join(" ")
                        : [
                            classes.processNonClickWrapper,
                            classes.commonFlexStart,
                          ].join(" ")
                    }
                    xs={12}
                  >
                    <Grid item xs={1}>
                      <StatusBadgeIcon
                        size="medium"
                        type="deployment"
                        icon={ICONS.deployment}
                        status={deployStatusIcon}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h4" className={classes.processName}>
                        {displayName}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <UserButton
                        id={`DEPLOYMENT_LOG_${i}_${prc.executorUsername}`}
                        name={prc.executorUsername}
                      />
                    </Grid>
                    <Grid item xs={5} className={classes.commonFlexStart}>
                      <Typography variant="body1">
                        {startingDate
                          ? formatDateOrString(
                              displayYearMonthTimeDateAsES(startingDate) +
                                "+0000",
                              "MMM dd, yyyy h:mm:ssaa",
                            )
                          : ""}
                      </Typography>
                      <span className={classes.commonSpacer}>{"-"}</span>
                      <Typography variant="body1">
                        {endingDate
                          ? formatDateOrString(
                              displayYearMonthTimeDateAsES(endingDate) +
                                "+0000",
                              "MMM dd, yyyy h:mm:ssaa",
                            )
                          : t("Running")}
                      </Typography>
                    </Grid>
                  </Grid>
                  {apiResponse.length - 1 !== i && <Divider />}
                </Fragment>
              );
            })}
        </Paper>
      </Fragment>
    );
  }
}
DeploymentLogsTabHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  instanceId: PropTypes.string,
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
  rowsPerPage: getTableRowsSetting("deploymentLogs")(state),
});

const mapDispatchToProps = {
  changeTableRowsSetting,
};

export default flow(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withTranslation(),
)(DeploymentLogsTabHistory);
