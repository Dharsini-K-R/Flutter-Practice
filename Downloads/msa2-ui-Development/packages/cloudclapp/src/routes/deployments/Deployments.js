import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { StreamIcon } from "react-line-awesome";
import { useState, useEffect } from "react";
import SearchBar from "cloudclapp/src/components/searchBar/SearchBar";
import DeploymentList from "./DeploymentList";
import { getEnvironments } from "cloudclapp/src/store/designations";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

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
  };
});

const Deployments = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const [inputValue, setInputValue] = useState("");
  const [environmentsList, setEnvironments] = useState([]);
  const data = useSelector(getEnvironments());
  useEffect(() => {
    if (data && data.length > 0) {
      setEnvironments(data);
    }
  }, [data]);

  return (
    <div
      className={commonClasses.commonPageHeaderContainer}
      data-testid="deployments-container"
    >
      <Grid
        container
        className={commonClasses.commonPageHeaderGrid}
        spacing={2}
      >
        <Grid item>
          <StreamIcon className={commonClasses.commonPageHeaderIcon} />
        </Grid>
        <Grid item>
          <Typography
            id="DEPLOYMENTS_TITLE"
            variant="h4"
            className={commonClasses.commonPageHeaderText}
          >
            {t("Deployments")}
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.boxWrapper}>
        <Grid container className={classes.boxHeader}>
          <Grid item xs={6}>
            <SearchBar
              id="DEPLOYMENTS"
              showendAdornment={false}
              showClearIcon={false}
              onChangeCallback={(event) => setInputValue(event.target.value)}
              placeholderText={"Search..."}
              width="35%"
              border="1px solid #B2BCCE"
              aria-label={t("Search")}
            />
          </Grid>
        </Grid>
        <DeploymentList
          environments={environmentsList}
          searchText={inputValue}
        />
      </div>
    </div>
  );
};

export default Deployments;
