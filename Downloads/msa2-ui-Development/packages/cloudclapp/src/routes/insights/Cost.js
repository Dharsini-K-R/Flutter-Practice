import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import EqualizerIcon from "@material-ui/icons/Equalizer";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import { isEmpty } from "lodash";

import CloudProviderCost from "./CloudProviderCost";
import TagCost from "./TagCost";
import { useSelector, useDispatch } from "react-redux";
import { fetchUISettings, getUISettings } from "cloudclapp/src/store/settings";

const Cost = () => {
  const dispatch = useDispatch();
  const [alignment, setAlignment] = React.useState("left");
  const settingsData = useSelector(getUISettings);
  const [data, setData] = useState(settingsData);

  const getSavedData = () => {
    setData(settingsData);
  };

  useEffect(() => {
    if (settingsData?.dashboardView) {
      getSavedData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsData]);

  useEffect(() => {
    dispatch(fetchUISettings);
  }, [dispatch]);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const control = {
    value: alignment,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <div data-testid="insights-cost">
      {isEmpty(data) ? (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          sx={{ padding: "40px" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <ToggleButtonGroup size="small" {...control}>
            <ToggleButton
              value="left"
              key="left"
              disabled={alignment === "left"}
            >
              <ViewCompactIcon />
            </ToggleButton>
            <ToggleButton
              value="right"
              key="right"
              disabled={alignment === "right"}
            >
              <EqualizerIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          {alignment === "left" ? <TagCost /> : <CloudProviderCost />}
        </Box>
      )}
    </div>
  );
};

export default Cost;
