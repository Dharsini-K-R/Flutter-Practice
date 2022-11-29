import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Grid, makeStyles } from "@material-ui/core";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { cloudeVendorRegions } from "./mocks";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: 200,
  },
  loading: {
    marginBottom: 30,
  },
  formHeading: {
    marginBottom: 35,
  },
  formField: {
    marginBottom: 35,
    width: "100%",
  },
  formRadio: {
    marginBottom: 10,
    width: "100%",
  },
}));

const Region = ({ modelerState, modelerActions, moddle, readOnly }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { activeElement } = modelerState;

  const {
    getInputParameterFromElement,
    writeToRegionElement,
    updateActiveElement,
  } = modelerActions;

  const parentBusinessObject = getInputParameterFromElement(
    activeElement?.parent,
  );
  const bpmElementValues = getInputParameterFromElement(activeElement);

  const selectedCloudVendor = parentBusinessObject?.data?.value?.cloudVendor;

  const options = (() => {
    const data = {
      label: "",
      options: [],
    };
    if (selectedCloudVendor) {
      data.options = cloudeVendorRegions[selectedCloudVendor]?.map((region) => {
        return {
          label: region,
          value: region,
        };
      });
    }
    return [data];
  })();

  const onChange = useCallback(
    (data) => {
      const payload = {
        displayName: data.label,
        ...bpmElementValues,
        data,
        moddle,
      };
      const updatedBpmElement = writeToRegionElement(payload);
      const businessObject = getBusinessObject(updatedBpmElement);
      updateActiveElement(businessObject);
    },
    [writeToRegionElement, updateActiveElement, bpmElementValues, moddle],
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classes.container}
    >
      {!selectedCloudVendor ? (
        <div>{t("Please select a provider")}</div>
      ) : (
        <Grid
          item
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item>{t("Region")}</Grid>
          <Grid item>
            <SelectField
              id="PROVIDER_PANEL"
              required
              options={options}
              placeholder={t("Select...")}
              value={bpmElementValues?.data}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Region;
