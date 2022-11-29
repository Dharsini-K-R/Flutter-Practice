import React from "react";
import Select from "react-select";

import {
  InputAdornment,
  ListItemIcon,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Search from "@material-ui/icons/Search";

const useStyles = makeStyles(({ palette, spacing }) => {
  return {
    root: {
      flexGrow: 1,
    },
    inputText: {
      color: palette.text.primary,
    },
    input: {
      display: "flex",
      height: "2rem",
      background: palette.background.paper,
    },
    valueContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: 1,
      alignItems: "center",
      overflow: "hidden",
    },
    noOptionsMessage: {
      padding: `${spacing(1)}px ${spacing(2)}px`,
    },
    singleValue: {
      fontSize: "1rem",
      maxWidth: 180,
    },
    placeholder: {
      position: "absolute",
      left: 38,
      fontSize: "0.875rem",
      fontStyle: "italic",
    },
    paper: {
      fontSize: "1rem",
      zIndex: 1,
      left: 0,
      right: 0,
    },
    listItemIcon: {
      marginRight: 10,
    },
    menuList: {
      boxShadow:
        "0 14px 16px 4px rgba(81, 97, 133, 0.13), 0 5px 8px 0 rgba(0, 0, 0, 0.15)",
      borderTop: "1px solid #E6EAEE",
      borderRadius: "0 0 5px 5px",
      padding: "8px 0",
      margin: 0,
      maxHeight: 300,
      overflowY: "scroll",
    },
  };
});

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        disableUnderline: true,
        inputComponent,
        startAdornment: (
          <InputAdornment
            position="start"
            style={{
              margin: "0 6px",
            }}
          >
            <Search color="primary" />
          </InputAdornment>
        ),
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <Tooltip title={props.children} enterDelay={1000}>
      <MenuItem
        ref={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
          fontSize: "0.9375rem",
          padding: "12px 15px",
        }}
        {...props.innerProps}
        id={`SELECT_SEARCH_${props.data.id || props.innerProps.id}`}
      >
        {props.data.icon && (
          <ListItemIcon className={props.selectProps.classes.listItemIcon}>
            <props.data.icon />
          </ListItemIcon>
        )}
        {props.children}
      </MenuItem>
    </Tooltip>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      noWrap
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

function MenuList(props) {
  return (
    <div
      id="SELECT_SEARCH_MENU_LIST"
      className={props.selectProps.classes.menuList}
      {...props.innerProps}
    >
      {props.children}
    </div>
  );
}

const SelectSearch = ({
  id,
  onSelect,
  options,
  noOptionText,
  selectedOption,
  isOrgSelection = false,
  isClearable = true,
}) => {
  const classes = useStyles();
  const handleChange = (value) => {
    onSelect(id, value);
  };

  const components = {
    Control,
    Menu,
    MenuList,
    inputComponent,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
  };

  const selectStyles = makeStyles(({ palette }) => {
    return {
      clearIndicator: (base) => ({
        ...base,
        cursor: "pointer",
      }),
      input: (base) => ({
        ...base,
        fontSize: "1rem",
        color: classes.inputText,
        padding: "0",
        "& input": {
          fontSize: "1rem",
        },
        "&:before": {
          borderColor: palette.border.greyLight1,
        },
      }),
      control: (base) => ({
        ...base,
        "&:hover": {
          cursor: "pointer",
        },
      }),
    };
  });

  return (
    <div id={`SELECT_DIV_${id}`} className={classes.root}>
      <Select
        classes={classes}
        classNamePrefix={id}
        styles={selectStyles}
        options={options}
        getOptionLabel={(option) =>
          isOrgSelection ? option.name : option.label
        }
        getOptionValue={(option) =>
          isOrgSelection ? option.prefix : option.value
        }
        components={components}
        noOptionsMessage={(e) => (
          <Typography color="primary">
            {noOptionText ? noOptionText : "No option found."}
          </Typography>
        )}
        value={selectedOption ? selectedOption : {}}
        onChange={handleChange}
        menuIsOpen={true}
        closeMenuOnSelect={false}
        blurInputOnSelect={true}
        closeMenuOnScroll={true}
        isClearable={isClearable}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </div>
  );
};

export default SelectSearch;
