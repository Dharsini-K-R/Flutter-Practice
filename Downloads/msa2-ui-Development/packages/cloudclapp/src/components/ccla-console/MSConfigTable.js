import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import isEmpty from "lodash/isEmpty";

import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

import {
  Grid,
  CircularProgress,
  makeStyles,
  TableContainer,
  Table,
} from "@material-ui/core";
import classNames from "classnames";

import useApi from "cloudclapp/src/hooks/useApi";

import VariableField from "cloudclapp/src/components/variables/VariableField";

import Repository from "msa2-ui/src/services/Repository";
import Variable from "msa2-ui/src/services/Variable";

import {
  getInstanceDataForMicroservicesOfManagedEntity,
  getMicroservice,
} from "msa2-ui/src/api/microservices";

import TableMessage from "msa2-ui/src/components/TableMessage";
import TableLoading from "msa2-ui/src/components/TableLoading";
import VariableViewTableHeader from "msa2-ui/src/components/variables/VariableViewTableHeader";
import MicroserviceConsoleTableBody from "msa2-ui/src/components/msa-console-table/MicroserviceConsoleTableBody";
import { getManagedEntityConfigureTableData } from "msa2-ui/src/routes/integration/managed-entities/detail/ManagedEntityConfigureTable";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
  },
  tableContainer: {
    width: "100%",
    height: "calc(100% - 58px)",
    minHeight: 200,
    overflowX: "scroll",
  },
  errorMessage: {
    paddingTop: 54,
    paddingBottom: 54,
    textAlign: "center",
  },
  tableError: {
    width: "100%",
    position: "absolute",
  },
  commandButton: {
    fontSize: "1em",
    padding: "3px 10px 3px 10px",
    marginRight: 5,
  },
  table: {
    // The table needs to be below the sidebar so it doesn't cover the shadow
    zIndex: 0,
    position: "relative",
  },
  filterMenuWrapper: {
    minHeight: "58px",
    maxHeight: "118px",
    paddingLeft: 10,
    paddingRight: 10,
  },
  listItemIcon: {
    marginRight: 12,
  },
  icon: {
    width: 18,
    height: 18,
  },
  headerCellPrimary: {
    width: 60,
  },
}));

const MSConfigTable = ({
  microserviceUri,
  deviceId,
  orderStack = [],
  isReadonly = true,
}) => {
  const { t } = useTranslation();
  const commonClasses = useCommonStyles();

  const classes = useStyles();

  const [sort, setSort] = useState({
    active: "_order",
    direction: "asc",
    type: "Integer",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const microserviceBaseFilename = Repository.stripFolderPathAndFileExtensionFromUri(
    microserviceUri,
  );

  // Get the variables of the currently selected microservice
  const [isMicroserviceLoading, , microservice] = useApi(
    getMicroservice,
    { microServiceUri: microserviceUri },
    !microserviceUri,
  );

  // Get instance data for the managed entity's microservices
  const [isMicroserviceDataLoading, , microserviceData = {}] = useApi(
    getInstanceDataForMicroservicesOfManagedEntity,
    {
      id: deviceId,
      msUri: microserviceUri,
      pageSize: 1000,
      page: 1,
      sort: sort.active,
      sortOrder: sort.direction.toUpperCase(),
      transforms: [(response) => response[microserviceBaseFilename]],
      format: true,
    },
    !microserviceUri,
  );

  const tableData = useMemo(() => {
    return microservice
      ? getManagedEntityConfigureTableData({
          microserviceBaseFilename,
          microserviceData,
          orderStack,
        })
      : {};
  }, [microservice, microserviceBaseFilename, microserviceData, orderStack]);

  if (!microservice && isMicroserviceLoading) {
    return (
      <Grid
        className={classNames([
          commonClasses.commonLoaderWrapper,
          classes.container,
        ])}
      >
        <CircularProgress />
      </Grid>
    );
  }

  const visibleVariables = microservice
    ? Variable.filterEditOnly(microservice.variables.variable)
    : [];
  const allVariablesHidden = !visibleVariables.length;
  const hasTable = visibleVariables.some(
    (variable) => Variable.getTableValData(variable.name).isTable,
  );

  if (allVariablesHidden) {
    return (
      <Grid className={classNames([classes.container, classes.errorMessage])}>
        {t("There are no visible variables for this microservice")}
      </Grid>
    );
  }

  const handleSortData = ({ active, direction, variable: { type } }) => {
    setSort({ active, direction, type });
  };

  const renderTableHeader = () => {
    return (
      <VariableViewTableHeader
        classes={{ headerCellPrimary: classes.headerCellPrimary }}
        variables={visibleVariables}
        onClickLabel={handleSortData}
        primaryLabel={undefined}
      />
    );
  };

  const renderTableBody = () => {
    if (isMicroserviceDataLoading) {
      return (
        <TableLoading
          numberOfTableColumns={visibleVariables.length + (isReadonly ? 0 : 1)}
        />
      );
    }
    if (isEmpty(tableData)) {
      return (
        <TableMessage
          numberOfTableColumns={visibleVariables.length + (isReadonly ? 0 : 1)}
          message={t("No instance data for this microservice")}
        />
      );
    }
    return (
      <MicroserviceConsoleTableBody
        setSelectedMicroserviceKeys={setSelectedRows}
        selectedMicroserviceKeys={selectedRows}
        microserviceVariables={visibleVariables}
        microserviceInstanceData={tableData}
        sort={sort}
        components={{ MSAVariable: VariableField }}
      />
    );
  };

  return (
    <div className={classes.container}>
      <TableContainer classes={{ root: classes.tableContainer }}>
        <Table
          stickyHeader
          className={classes.table}
          style={{
            width: hasTable && !isEmpty(tableData) ? "auto" : "inherit",
          }}
        >
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </TableContainer>
    </div>
  );
};

MSConfigTable.propTypes = {
  microserviceUri: PropTypes.string.isRequired,
  orderStack: PropTypes.array,
  deviceId: PropTypes.number,
  isReadonly: PropTypes.bool,
};

export default MSConfigTable;
