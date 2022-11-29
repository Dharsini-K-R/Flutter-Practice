import React from "react";
import classnames from "classnames";
import {
  makeStyles,
  Select as MUISelect,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 300,
  },
  select: {
    paddingTop: 10.5,
    paddingBottom: 10.5,
  },
}));

const BasicSelect = ({
  label,
  className,
  name,
  children,
  error,
  required,
  helperText,
  FormHelperTextProps,
  t,
  fullWidth,
  ...props
}) => {
  const classes = useStyles();

  return (
    <FormControl
      variant="outlined"
      required={required}
      className={classnames(classes.formControl, className)}
      error={error}
      fullWidth={fullWidth}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <MUISelect
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: { vertical: "center", horizontal: "left" },
        }}
        name={name}
        inputProps={{
          name,
          id: name,
          "data-testid": name,
        }}
        classes={{ root: classes.select }}
        {...props}
      >
        {children}
      </MUISelect>
      {helperText && (
        <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default BasicSelect;
