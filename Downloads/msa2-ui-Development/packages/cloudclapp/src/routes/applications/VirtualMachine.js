import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  CircularProgress,
  makeStyles,
  Typography,
  RadioGroup,
} from "@material-ui/core";
import ApplicationSearchAndFilter from "./ApplicationSearchAndFilter";
import VirtualMachineImage from "./VirtualMachineImage";
import { getVirtualMachineImagesByKey } from "cloudclapp/src/api/applications";
import useApi from "cloudclapp/src/hooks/useApi";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import {
  getTableRowsSetting,
  changeTableRowsSetting,
} from "cloudclapp/src/store/settings";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { getCloudVendors } from "cloudclapp/src/store/designations";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";

const useStyles = makeStyles(({ palette }) => ({
  boxWidthPadding: {
    width: "100%",
    paddingTop: "2%",
    paddingLeft: "2%",
    paddingBottom: "2%",
  },
  cloudSelectorBox: {
    width: "25%",
    paddingTop: "2%",
    paddingLeft: "2%",
  },
  tabPanel: {
    width: "100%",
    height: "100%",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
  selectInput: {
    marginLeft: 10,
  },
}));

const VirtualMachine = ({
  setApplicationsTabsCallBack,
  setApplicationsCallBack,
  disableMarketPlaceSelect = false,
  setSelectedCloud,
}) => {
  const [value, setValue] = useState("");
  const [searchString, setSearchString] = useState("");
  const [officialImages, setOfficialImages] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(
    useSelector(getTableRowsSetting("applicationsDockerhub")),
  );
  const [page, setPage] = useState(0);

  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const cloudVendors = useSelector(getCloudVendors);

  const CloudVendorList = Object.entries(cloudVendors)
    .filter(([, { services }]) =>
      Object.values(services).some(({ imageType }) => imageType === "vm"),
    )
    .map(([value, { displayName }]) => {
      return {
        label: displayName,
        value,
      };
    });

  const [selectedCloudProvider = {}, setSelectedCloudProvider] = useState(
    CloudVendorList[0],
  );

  useEffect(() => {
    setSelectedCloud(selectedCloudProvider.value);

    return () => {
      setSelectedCloud();
    };
  }, [selectedCloudProvider, setSelectedCloud]);

  const [loading, , marketPlaceImages, meta] = useApi(
    getVirtualMachineImagesByKey,
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

  const setImageData = ({ name, imageId, description }) => ({
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]: name.replace("/", "_"),
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]: imageId,
    [DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]: description,
  });

  const addItemToDeployment = (imageId) => {
    const image = marketPlaceImages.find((data) => data.imageId === imageId);
    const images = [setImageData(image)];
    setApplicationsTabsCallBack && setApplicationsTabsCallBack(images);
    setApplicationsCallBack && setApplicationsCallBack(images);
  };

  return (
    <Box className={classes.tabPanel} data-testid={"virtualmachine-component"}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        className={classes.cloudSelectorBox}
      >
        <Typography id="VM_CLOUD_VENDOR_MARKETPLACE" variant="subtitle1">
          {t("Marketplace")}
        </Typography>
        <SelectField
          id="VM_CLOUD_VENDOR_SELECTOR"
          className={classes.selectInput}
          width={250}
          options={CloudVendorList}
          value={selectedCloudProvider}
          disabled={disableMarketPlaceSelect}
          onChange={(event) => {
            setSelectedCloudProvider({
              label: event.label,
              value: event.value,
            });
          }}
        />
      </Box>
      <ApplicationSearchAndFilter
        onSearchChangeCallBack={debounce(handleSearchStringChange, 300)}
        onFilterChangeCallBack={handleImageTypeFilterChange}
        totalImagesCount={meta?.total ?? 0}
        rowsPerPage={rowsPerPage}
        currentPage={page}
        hideFirstAndLast={true}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onRowsPerPageChange}
        searchBarText={t("Search Image...")}
        filterLabel={t("Marketplace Images Only")}
        searchBarProps={{ disabled: !selectedCloudProvider }}
      />
      <Box className={classes.boxWidthPadding}>
        {loading ? (
          <Grid container alignItems="center" justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <RadioGroup
            aria-label="virtual-machine"
            name="vm"
            value={value}
            onChange={(e) => {
              const imageId = e.target.value;
              setValue(imageId);
              addItemToDeployment(imageId);
            }}
          >
            {marketPlaceImages?.map((data, index) => (
              <VirtualMachineImage key={index} input={data} index={index} />
            ))}
          </RadioGroup>
        )}
      </Box>
    </Box>
  );
};

export default VirtualMachine;
