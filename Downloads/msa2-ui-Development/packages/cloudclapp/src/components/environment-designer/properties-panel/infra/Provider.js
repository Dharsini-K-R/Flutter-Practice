import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Grid, makeStyles } from "@material-ui/core";
import { getCloudVendors } from "cloudclapp/src/store/designations";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

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

const Provider = ({ modelerState, modelerActions, moddle, readOnly }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { activeElement } = modelerState;
  const {
    getInputParameterFromElement,
    writeToProviderElement,
    updateActiveElement,
  } = modelerActions;
  const bpmElementValues = getInputParameterFromElement(activeElement);

  const cloudVendors = useSelector(getCloudVendors);
  const options = {
    label: "Public Cloud",
    options: Object.keys(cloudVendors).map((cloudVendor) => {
      return {
        value: { ...cloudVendors[cloudVendor], cloudVendor },
        label: cloudVendors[cloudVendor].displayName,
      };
    }),
  };

  const onChange = useCallback(
    (data) => {
      const payload = {
        displayName: data.label,
        ...bpmElementValues,
        data,
        moddle,
      };
      const updatedBpmElement = writeToProviderElement(payload);
      const businessObject = getBusinessObject(updatedBpmElement);
      updateActiveElement(businessObject);
    },
    [writeToProviderElement, updateActiveElement, bpmElementValues, moddle],
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classes.container}
    >
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Grid item>{t("Provider")}</Grid>
        <Grid item>
          <SelectField
            id="PROVIDER_PANEL"
            required
            options={[options]}
            placeholder={t("Select...")}
            value={bpmElementValues?.data}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Provider;
