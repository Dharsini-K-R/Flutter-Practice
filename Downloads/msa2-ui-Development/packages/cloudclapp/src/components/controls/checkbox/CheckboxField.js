import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

import {
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

const CheckboxField = ({
  className,
  error,
  hint,
  FormHelperTextProps,
  label,
  children,
  ...rest
}) => {
  const commonClasses = useCommonStyles();
  return (
    <FormControl>
      <FormControlLabel
        className={className}
        control={<Checkbox color={"primary"} {...rest} />}
        label={label}
      />
      {(error || hint) && (
        <FormHelperText
          className={classnames(commonClasses.commonFormRowHint, {
            [commonClasses.commonTextColorError]: error,
          })}
          {...FormHelperTextProps}
        >
          {error || hint}
        </FormHelperText>
      )}
    </FormControl>
  );
};

CheckboxField.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  FormHelperTextProps: PropTypes.object,
};

export default CheckboxField;
