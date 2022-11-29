import React from "react";
import { Grid, Box, CircularProgress, makeStyles } from "@material-ui/core";
import ApplicationSearchAndFilter from "./ApplicationSearchAndFilter";
import DockerImages from "./DockerImages";
import { getMarketPlaceImagesByKey } from "cloudclapp/src/api/applications";
import useApi from "cloudclapp/src/hooks/useApi";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import {
  getTableRowsSetting,
  changeTableRowsSetting,
} from "cloudclapp/src/store/settings";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(({ palette }) => ({
  boxWidthPadding: {
    width: "100%",
    paddingTop: "2%",
    paddingLeft: "2%",
    paddingBottom: "2%",
  },
  tabPanel: {
    width: "100%",
    height: "100%",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
}));

const DockerHub = ({
  setApplicationsTabsCallBack,
  setApplicationsCallBack,
}) => {
  const [
    imagesArrayForDeployment,
    setImagesArrayForDeployment,
  ] = React.useState([]);

  const [searchString, setSearchString] = React.useState("");
  const [officialImages, setOfficialImages] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    useSelector(getTableRowsSetting("applicationsDockerhub")),
  );
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(0);
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, , dockerImagesList, ,] = useApi(
    getMarketPlaceImagesByKey,
    {
      searchKey: searchString,
      page: page + 1,
      pageSize: rowsPerPage,
      officialImages,
    },
    isEmpty(searchString),
  );

  const handleSearchStringChange = (event, newValue) => {
    setPage(0);
    setSearchString(event.target.value);
  };
  const handleImageTypeFilterChange = (event, newValue) => {
    setPage(0);
    setOfficialImages(newValue);
  };
  const onChangePage = (event, pageNumber) => {
    setPage(pageNumber < 0 ? 0 : pageNumber);
  };
  const onRowsPerPageChange = (_, { props }) => {
    const numberOfRows = props?.value ?? 10;
    dispatch(
      changeTableRowsSetting({
        table: "applicationsDockerhub",
        numberOfRows,
      }),
    );
    setPage(Math.floor((page * rowsPerPage) / numberOfRows));
    setRowsPerPage(numberOfRows);
  };

  const addItemsCallBack = (name, slug, desc, logo) => {
    const item = {
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]: name.replace("/", "_"),
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]: slug,
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]: desc,
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]: logo,
    };
    imagesArrayForDeployment.push(item);
    setImagesArrayForDeployment(imagesArrayForDeployment);
    setApplicationsTabsCallBack &&
      setApplicationsTabsCallBack(imagesArrayForDeployment);
    setApplicationsCallBack &&
      setApplicationsCallBack(imagesArrayForDeployment);
  };

  const removeItemsCallBack = (removeSlug) => {
    imagesArrayForDeployment.splice(
      imagesArrayForDeployment.findIndex(
        (dockerImage) =>
          dockerImage[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG] ===
          removeSlug,
      ),
      1,
    );
    setImagesArrayForDeployment(imagesArrayForDeployment);
    setApplicationsTabsCallBack &&
      setApplicationsTabsCallBack(imagesArrayForDeployment);
    setApplicationsCallBack &&
      setApplicationsCallBack(imagesArrayForDeployment);
  };

  return (
    <Box className={classes.tabPanel} data-testid={"dockerhub-component"}>
      <ApplicationSearchAndFilter
        onSearchChangeCallBack={handleSearchStringChange}
        onFilterChangeCallBack={handleImageTypeFilterChange}
        totalImagesCount={dockerImagesList ? dockerImagesList.count : 0}
        rowsPerPage={rowsPerPage}
        currentPage={page}
        hideFirstAndLast={true}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onRowsPerPageChange}
        searchBarText={t("Search Dockerhub...")}
        filterLabel={t("Official Images Only")}
      />

      <Box className={classes.boxWidthPadding}>
        {loading ? (
          <Grid container alignItems="center" justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          dockerImagesList?.summaries?.map((data, index) => {
            return (
              <DockerImages
                key={index}
                input={data}
                index={index}
                addItemsCallBack={addItemsCallBack}
                removeItemsCallBack={removeItemsCallBack}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default DockerHub;
