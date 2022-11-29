import React from "react";
import PropTypes from "prop-types";

import Select from "react-select";

import { FormControl, FormHelperText } from "@material-ui/core";

import Option from "./SelectOption";
import { useSelectStyles } from "./useSelectStyles";

const SelectField = ({
  isClearable = false,
  isError = false,
  disabled,
  label,
  value = {},
  required,
  width = 300,
  error,
  FormHelperTextProps,
  ...rest
}) => {
  const styles = useSelectStyles(isError, disabled, width);
  return (
    <FormControl>
      <Select
        styles={styles}
        isClearable={isClearable}
        isDisabled={disabled}
        menuPlacement="auto"
        menuPosition="fixed"
        menuPortalTarget={document.body}
        components={{ Option }}
        value={value}
        {...rest}
      />
      {error && (
        <FormHelperText {...FormHelperTextProps}>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

SelectField.propTypes = {
  isClearable: PropTypes.bool,
  isError: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.object,
  required: PropTypes.bool,
  style: PropTypes.object,
  width: PropTypes.number,
  postfix: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  FormHelperTextProps: PropTypes.object,
};
export default SelectField;
