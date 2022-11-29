import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import noop from "lodash/noop";
import isEmpty from "lodash/isEmpty";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { BoltIcon } from "react-line-awesome";
import { useTranslation } from "react-i18next";

import InputField from "cloudclapp/src/components/controls/InputField";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import PasswordField from "cloudclapp/src/components/controls/password/PasswordField";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

const useStyles = makeStyles(({ colors, palette }) => {
  return {
    formRowHint: {
      color: palette.text.support,
      fontStyle: "italic",
      fontSize: "14px",
    },
    formRowCheckboxHint: {
      marginLeft: 35,
    },
    formRowLabel: {
      color: palette.text.secondary,
      fontSize: "14px",
    },
    formRowCheckboxIcon: {
      fontSize: "20px",
    },
    formRowCheckboxLabel: {
      marginLeft: 5,
    },
    formRowLabelOptional: {
      color: palette.text.secondary,
      fontSize: "10px",
      marginLeft: 3,
    },
    secret: {
      marginLeft: 12,
      pointerEvents: "none",
    },
    secretIcon: {
      color: colors.darkAccent,
      fontSize: "20px",
    },
    secretText: {
      color: colors.darkAccent,
      fontSize: "14px",
    },
  };
});

const INPUT_TYPE = {
  text: "text",
  select: "select",
  checkbox: "checkbox",
  password: "password",
};

const FormPassword = ({
  id,
  label,
  optional,
  value,
  error,
  required,
  width,
  onChange,
  type,
  hint,
  postfix,
  isLoading,
  disabled,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <>
      <Grid item container xs={3} alignItems="center">
        <Typography
          className={classnames(classes.formRowLabel, {
            [commonClasses.commonTextColorError]: error,
          })}
        >
          {required ? `${label}*` : label}
        </Typography>
        {optional && (
          <Typography className={classes.formRowLabelOptional}>{`(${t(
            "Optional",
          )})`}</Typography>
        )}
      </Grid>
      <Grid item container alignItems="center" xs={9}>
        <Grid item container alignItems="center">
          <PasswordField
            id={id}
            required={required}
            value={value}
            error={error}
            width={width}
            onChange={onChange}
            disabled={isLoading || disabled}
            FormHelperTextProps={{
              className: classnames(classes.formRowHint, {
                [commonClasses.commonTextColorError]: error,
              }),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

const Details = ({
  isLoading,
  formData: detailsData,
  setFormData,
  formErrors: detailsErrors,
  cloudOptions = [],
  createEnvironmetFromBlueprint = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const setDetailsFormData = (newData) => {
    setFormData({
      ...detailsData,
      ...newData,
    });
  };

  const FORM_ROWS = [
    {
      id: "CREATE_ENVIRONMENT_DETAILS_NAME",
      required: true,
      hint: t("Max 40 characters"),
      label: t("Name"),
      type: INPUT_TYPE.text,
      value: detailsData.name,
      error: detailsErrors.name,
      onChange: (e) => setDetailsFormData({ name: e.target.value }),
    },
    {
      id: "CREATE_ENVIRONMENT_DETAILS_DESCRIPTION",
      required: true,
      hint: t("Max 100 characters"),
      label: t("Description"),
      type: INPUT_TYPE.text,
      value: detailsData.description,
      error: detailsErrors.description,
      width: 600,
      onChange: (e) => setDetailsFormData({ description: e.target.value }),
    },
    {
      id: "CREATE_ENVIRONMENT_DETAILS_CLOUD_TYPE",
      required: true,
      label: t("Cloud Type"),
      type: INPUT_TYPE.select,
      value: detailsData.cloudType,
      error: detailsErrors.cloudType,
      onChange: (cloudType) => {
        const { envWFUri, envImportWFUri } = cloudType.value ?? {};
        const onlyImportAvailable = !envWFUri && envImportWFUri;
        setDetailsFormData({
          cloudType,
          cloudVendor: cloudType.value.cloudVendor,
          cloudService: cloudType.value.cloudService,
          importFlag: onlyImportAvailable,
        });
      },
      options: cloudOptions,
    },
    {
      id: "CREATE_ENVIRONMENT_DETAILS_IMPORT",
      label: t("Import"),
      type: INPUT_TYPE.checkbox,
      value: detailsData.importFlag,
      hint: t("Will import your environment to Cloudclapp"),
      onChange: (e) => setDetailsFormData({ importFlag: e.target.checked }),
      getHidden: (data) => isEmpty(data.cloudType),
      getDisabled: (data) =>
        [
          data.cloudType.value?.envImportWFUri,
          data.cloudType.value?.envWFUri,
        ].some((uri) => !uri),
      getDisabledReason: (data) => {
        const { envWFUri, envImportWFUri } = data.cloudType.value ?? {};
        if (!envWFUri && !envImportWFUri) {
          return t("No Environment creation is supported for this Cloud Type");
        } else if (!envWFUri) {
          return t("Only Import is supported for this Cloud Type");
        } else if (!envImportWFUri) {
          return t("Import is not supported for this Cloud Type");
        }
        return "";
      },
    },

    {
      id: "CREATE_ENVIRONMENT_DETAILS_ACTIVATION",
      label: t("Activation"),
      type: INPUT_TYPE.checkbox,
      value: detailsData.activation,
      hint: t(
        "Will establish the connectivity with the platform on completion of setup",
      ),
      onChange: (e) => setDetailsFormData({ activation: e.target.checked }),
      getHidden: () => true,
    },
    {
      id: "CREATE_ENVIRONMENT_DETAILS_PRODUCTION_ENVIRONMENT",
      label: t("Production Environment"),
      icon: <BoltIcon />,
      type: INPUT_TYPE.checkbox,
      value: detailsData.productionEnvironment,
      onChange: (e) =>
        setDetailsFormData({ productionEnvironment: e.target.checked }),
    },
  ];

  const FORM_ROWS_FOR_ENV_FROM_BLUEPRINT = [
    {
      id: "CREATE_ENVIRONMENT_DETAILS_NAME",
      required: true,
      hint: t("Max 40 characters"),
      label: t("Name"),
      type: INPUT_TYPE.text,
      value: detailsData.name,
      error: detailsErrors.name,
      onChange: (e) => setDetailsFormData({ name: e.target.value }),
    },
    {
      id: "CREATE_ENVIRONMENT_DETAILS_DESCRIPTION",
      required: true,
      hint: t("Max 100 characters"),
      label: t("Description"),
      type: INPUT_TYPE.text,
      value: detailsData.description,
      error: detailsErrors.description,
      width: 600,
      onChange: (e) => setDetailsFormData({ description: e.target.value }),
    },
    {
      id: "CREATE_ENVIRONMENT_DETAILS_PRODUCTION_ENVIRONMENT",
      label: t("Production Environment"),
      icon: <BoltIcon />,
      type: INPUT_TYPE.checkbox,
      value: detailsData.productionEnvironment,
      onChange: (e) =>
        setDetailsFormData({ productionEnvironment: e.target.checked }),
    },
  ];

  const renderControl = (props, detailsData) => {
    const {
      id,
      hint,
      value,
      error,
      required = false,
      label,
      onChange,
      options,
      optional,
      type,
      width = 300,
      postfix,
      icon,
      getDisabled,
      getDisabledReason,
    } = props;
    const disabled = getDisabled ? getDisabled(detailsData) : false;
    const title = disabled ? getDisabledReason(detailsData) : "";

    switch (type) {
      case INPUT_TYPE.select:
        return (
          <>
            <Grid item container xs={3} alignItems="center">
              <Typography
                className={classnames(classes.formRowLabel, {
                  [commonClasses.commonTextColorError]: error,
                })}
              >
                {required ? `${label}*` : label}
              </Typography>
              {optional && (
                <Typography className={classes.formRowLabelOptional}>{`(${t(
                  "Optional",
                )})`}</Typography>
              )}
            </Grid>
            <Grid item container alignItems="center" xs={9}>
              <Tooltip title={title ?? ""}>
                <Grid item container alignItems="center">
                  <SelectField
                    id={id}
                    required={required}
                    options={options}
                    placeholder={t("Select...")}
                    value={value}
                    width={width}
                    onChange={onChange}
                    disabled={isLoading || disabled}
                    error={error || hint}
                    isError={Boolean(error)}
                    FormHelperTextProps={{
                      className: classnames(classes.formRowHint, {
                        [commonClasses.commonTextColorError]: error,
                      }),
                    }}
                  />
                  {postfix && <Grid item>{postfix}</Grid>}
                </Grid>
              </Tooltip>
              {hint && (
                <Typography className={classes.formRowHint}>{hint}</Typography>
              )}
            </Grid>
          </>
        );
      case INPUT_TYPE.password:
        return (
          <FormPassword isLoading={isLoading} {...props} disabled={disabled} />
        );
      case INPUT_TYPE.checkbox:
        return (
          <Grid item container alignItems="flex-start" direction="column">
            <Tooltip title={title ?? ""}>
              <FormControlLabel
                control={
                  <Checkbox
                    id={id}
                    color="primary"
                    checked={value}
                    onChange={onChange}
                    disabled={isLoading || disabled}
                  />
                }
                label={
                  <Grid container alignItems="center">
                    {icon && (
                      <Grid item className={classes.formRowCheckboxIcon}>
                        {icon}
                      </Grid>
                    )}
                    <Grid item>
                      <Typography
                        className={classnames(
                          classes.formRowLabel,
                          classes.formRowCheckboxLabel,
                        )}
                      >
                        {label}
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
            </Tooltip>
            {hint && (
              <Typography
                className={classnames(
                  classes.formRowHint,
                  classes.formRowCheckboxHint,
                )}
              >
                {hint}
              </Typography>
            )}
          </Grid>
        );
      default:
        return (
          <>
            <Grid item container xs={3} alignItems="center">
              <Typography
                className={classnames(classes.formRowLabel, {
                  [commonClasses.commonTextColorError]: error,
                })}
              >
                {required ? `${label}*` : label}
              </Typography>
              {optional && (
                <Typography className={classes.formRowLabelOptional}>{`(${t(
                  "Optional",
                )})`}</Typography>
              )}
            </Grid>
            <Grid item container alignItems="center" xs={9}>
              <Tooltip title={title ?? ""}>
                <Grid item container alignItems="center">
                  <InputField
                    id={id}
                    required={required}
                    value={value}
                    error={error}
                    width={width}
                    onChange={onChange}
                    type={type}
                    disabled={isLoading || disabled}
                    FormHelperTextProps={{
                      className: classnames(classes.formRowHint, {
                        [commonClasses.commonTextColorError]: error,
                      }),
                    }}
                  />
                  {postfix && <Grid item>{postfix}</Grid>}
                </Grid>
              </Tooltip>
            </Grid>
          </>
        );
    }
  };

  const renderFormRow = (props, key) => {
    return (
      <Grid container alignItems="center" spacing={3} key={key}>
        {renderControl(props, detailsData)}
      </Grid>
    );
  };

  return (
    <>
      <Grid>
        {createEnvironmetFromBlueprint
          ? FORM_ROWS_FOR_ENV_FROM_BLUEPRINT.filter(({ getHidden = noop }) => {
              const hidden = getHidden(detailsData);
              return !hidden;
            }).map((row, i) => renderFormRow(row, i))
          : FORM_ROWS.filter(({ getHidden = noop }) => {
              const hidden = getHidden(detailsData);
              return !hidden;
            }).map((row, i) => renderFormRow(row, i))}
      </Grid>
    </>
  );
};

Details.propTypes = {
  isLoading: PropTypes.bool,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  cloudOptions: PropTypes.array,
  createEnvironmetFromBlueprint: PropTypes.bool,
};

export default Details;
