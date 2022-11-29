import React from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { SearchIcon } from "react-line-awesome";
import { Paper, InputBase } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: props.width,
    height: props.height,
    border: props.border,
    borderRadius: "7px",
    boxShadow: "none",
  }),
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 6,
    fontSize: 20,
  },
  form: {
    display: "flex",
    width: "100%",
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  selected: {
    color: "#394867",
  },
  unselected: {
    color: "#a1a1a1",
  },
  buttonText: {
    color: "#a1a1a1",
    fontSize: "0.8125rem",
    fontWeight: theme.typography.fontWeightMedium,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  btnRoot: {
    padding: 5,
    "&:hover": {
      borderRadius: 5,
      padding: 5,
    },
  },
}));

const SearchBar = ({
  id,
  onChangeCallback,
  searchString,
  placeholderText,
  width,
  height = "28px",
  border,
  autoFocus = false,
  ...rest
}) => {
  const props = { width, border };
  const classes = useStyles(props);
  const { t } = useTranslation();
  const prefix = id ? id.toUpperCase() + "_" : "";

  return (
    <Paper className={classes.root}>
      <SearchIcon className={classes.iconButton} aria-label={t("Search")} />
      <form className={classes.form}>
        <InputBase
          onChange={onChangeCallback}
          className={classes.input}
          onKeyPress={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          placeholder={t(placeholderText)}
          value={searchString}
          id={`${prefix}SEARCH_BAR_INPUT`}
          {...rest}
        />
      </form>
    </Paper>
  );
};

SearchBar.propTypes = {
  searchString: PropTypes.string,
  onChangeCallback: PropTypes.func.isRequired,
  placeholderText: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  border: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
};

export default SearchBar;
