import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";

import {
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@material-ui/core";

const InputField = (props) => {
  const commonClasses = useCommonStyles();
  const {
    style = {},
    width = 300,
    postfix,
    error,
    hint,
    FormHelperTextProps,
    ...rest
  } = props;
  return (
    <FormControl>
      <TextField
        {...rest}
        error={Boolean(error)}
        style={{
          ...style,
          width,
        }}
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true,
        }}
      />
      {postfix && <Typography>{postfix}</Typography>}
      {(error || hint) && (
        <FormHelperText
          className={classnames(commonClasses.commonFormRowHint, {
            [commonClasses.commonTextColorError]: error,
          })}
          {...FormHelperTextProps}
        >
          <>{error || hint}</>
        </FormHelperText>
      )}
    </FormControl>
  );
};

InputField.propTypes = {
  style: PropTypes.object,
  width: PropTypes.number,
  postfix: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  FormHelperTextProps: PropTypes.object,
};

export default InputField;
