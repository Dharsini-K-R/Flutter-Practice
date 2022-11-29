import React from "react";
import {
  Button,
  Grid,
  Typography,
  // FormControlLabel,
  // FormGroup,
  // Checkbox,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import {
  VectorSquareIcon,
  //  TableIcon, ListIcon
} from "react-line-awesome";
// import SearchBar from "cloudclapp/src/components/searchBar/SearchBar";
// import SelectField from "cloudclapp/src/components/controls/select/SelectField";
// import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import EnvironmentDesigner from "cloudclapp/src/components/environment-designer/EnvironmentDesigner";
import BlueprintSummaryTile from "./BlueprintSummaryTile";
import { getBluePrints } from "cloudclapp/src/api/blueprints";
import useApi from "cloudclapp/src/hooks/useApi";
import useDialog from "cloudclapp/src/hooks/useDialog";
import { getOrganisationId } from "cloudclapp/src/store/designations";
import { useSelector } from "react-redux";
import { getToken } from "cloudclapp/src/store/auth";
import classnames from "classnames";

const useStyles = makeStyles(({ palette }) => {
  return {
    boxWrapper: {
      padding: "2% 0",
      backgroundColor: palette.common.white,
      borderRadius: 8,
      boxShadow:
        "0px 4px 24px rgba(49, 64, 90, 0.1), 0px 2px 8px rgba(178, 188, 206, 0.2)",
    },
    boxHeader: {
      width: "100%",
      padding: "0 20px 10px 20px",
    },
    selectInput: {
      marginLeft: 10,
    },
    boxWidthPadding: {
      width: "100%",
      paddingTop: "1%",
      paddingBottom: "1%",
    },
  };
});
// console.log("hi");

// const filterByProviders = [
//   {
//     value: 0,
//     label: "All Providers",
//     status: "All providers",
//   },
// ];

// const filterBySources = [
//   {
//     value: 0,
//     label: "All Sources",
//     status: "All Sources",
//   },
// ];

// const filterByUsage = [
//   {
//     value: 0,
//     label: "Recently Used",
//     status: "Recently Used",
//   },
// ];

const Blueprints = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  // const [providerFilter, setProviderFilter] = useState(filterByProviders[0]);
  // const [sourceFilter, setSourceFilter] = useState(filterBySources[0]);
  // const [usageFilter, setUsageFilter] = useState(filterByUsage[0]);
  // const [alignment, setAlignment] = React.useState("grid");
  const token = useSelector(getToken);
  const orgId = useSelector(getOrganisationId);
  const [showAddBlueprintDialog, AddBlueprintDialog] = useDialog();

  // const handleChangeOfAlignment = (event, newAlignment) => {
  //   setAlignment(newAlignment);
  // };

  // const controlsForAlignment = {
  //   value: alignment,
  //   onChange: handleChangeOfAlignment,
  //   exclusive: true,
  // };

  const [
    loading,
    bluePrintsLoadError,
    blueprintsFromApi,
    ,
  ] = useApi(getBluePrints, { orgId, token });

  if (blueprintsFromApi !== undefined) {
    let i;
    const length = blueprintsFromApi.length;
    for (i = 0; i < length; i++) {
      blueprintsFromApi.sort(function(date1, date2) {
        return date2.DATE_MODIFICATION - date1.DATE_MODIFICATION;
      });
    }
  }
  return (
    <>
      <AddBlueprintDialog
        id="BLUEPRINTS_ADD_NEW_BLUEPRINT_DIALOG"
        title={t("Add New Blueprint")}
        maxWidth={"xl"}
        onExec={(e) => {
          console.log(e);
        }}
      >
        <EnvironmentDesigner
          // todo
          environment={{}}
          envWFLogoMapping={{}}
        />
      </AddBlueprintDialog>
      <div
        className={commonClasses.commonPageHeaderContainer}
        data-testid="blueprints-container"
      >
        <Grid
          container
          className={commonClasses.commonPageHeaderGrid}
          spacing={2}
        >
          <Grid item>
            <VectorSquareIcon className={commonClasses.commonPageHeaderIcon} />
          </Grid>
          <Grid item>
            <Typography
              id="BLUEPRINTS_TITLE"
              variant="h4"
              className={commonClasses.commonPageHeaderText}
            >
              {t("Blueprints")}
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid container className={classes.boxHeader}>
        <Grid item xs={9}>
          <Grid container>
            <Grid item xs={3}>
              <SearchBar
                id="BLUEPRINTS"
                //   onChangeCallback={(event) => setInputValue(event.target.value)}
                placeholderText={"Search..."}
                width="85%"
                height="31px"
                border="1px solid #B2BCCE"
                aria-label={t("Search")}
              />
            </Grid>
            <Grid item xs={3}>
              <SelectField
                id="BLUEPRINTS_PROVIDER_FILTER"
                className={classes.selectInput}
                width={200}
                options={filterByProviders}
                value={providerFilter}
                onChange={(event) => setProviderFilter(event)}
              />
            </Grid>
            <Grid item xs={3}>
              <SelectField
                id="BLUEPRINTS_SOURCES_FILTER"
                className={classes.selectInput}
                width={200}
                options={filterBySources}
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event)}
              />
            </Grid>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      // onChange={onFilterChangeCallBack}
                      id="blueprints-with-apps-checkbox"
                    />
                  }
                  label={t("Blueprints with Apps")}
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Grid container className={classes.boxHeader}>
              <Grid item xs={8}>
                <SelectField
                  id="BLUEPRINTS_USAGE_FILTER"
                  className={classes.selectInput}
                  width={170}
                  options={filterByUsage}
                  value={usageFilter}
                  onChange={(event) => setUsageFilter(event)}
                />
              </Grid>
              <Grid item xs={4}>
                <ToggleButtonGroup size="medium" {...controlsForAlignment}>
                  <ToggleButton
                    value="grid"
                    key="grid"
                    disabled={alignment === "grid"}
                  >
                    <TableIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="list"
                    key="list"
                    disabled={alignment === "list"}
                  >
                    <ListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
      </Grid> */}

        {process.env.NODE_ENV === "development" && (
          <Grid
            item
            xs={12}
            container
            justifyContent="flex-end"
            alignContent="center"
          >
            <Button
              id="BLUEPRINTS_ADD_NEW_BLUEPRINT"
              variant="contained"
              size="small"
              color="primary"
              onClick={showAddBlueprintDialog}
            >
              {t("Add New Blueprint")}
            </Button>
          </Grid>
        )}

        <Grid container className={classes.boxHeader}>
          <Box
            className={classes.boxWidthPadding}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              {bluePrintsLoadError && !loading && (
                <Grid container alignItems="center" justifyContent="center">
                  <Typography
                    id="BLUEPRINTS_LOAD_ERROR"
                    color="error"
                    variant="caption"
                    className={classnames(
                      classes.formError,
                      commonClasses.commonTextItalic,
                    )}
                  >
                    {bluePrintsLoadError.message}
                  </Typography>
                </Grid>
              )}
              {blueprintsFromApi?.length === 0 && (
                <Grid container alignItems="center" justifyContent="center">
                  <Typography
                    id="BLUEPRINTS_NOT_FOUND"
                    variant="caption"
                    className={commonClasses.commonTextItalic}
                  >
                    {t("No Blueprints saved for this organisation")}
                  </Typography>
                </Grid>
              )}
              {loading ? (
                <Grid container alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Grid>
              ) : (
                blueprintsFromApi?.length > 0 &&
                blueprintsFromApi.map((blueprintItem) => (
                  <BlueprintSummaryTile
                    // blueprintLogo="" Used an avatar logo by default
                    blueprintOwner={blueprintItem.OWNER}
                    blueprintCreationDate={Number(blueprintItem.DATE_CREATION)}
                    blueprintPreview={blueprintItem.PREVIEW}
                    blueprintName={blueprintItem.DISPLAYNAME}
                    providers={blueprintItem.PROVIDERS}
                    applications={blueprintItem.APPLICATIONS}
                    description={blueprintItem.DESCRIPTION}
                    path={blueprintItem.path}
                  />
                ))
              )}
            </Grid>
          </Box>
        </Grid>
      </div>
    </>
  );
};

export default Blueprints;
