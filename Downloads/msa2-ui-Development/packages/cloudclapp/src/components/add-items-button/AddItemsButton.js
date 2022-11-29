import React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { PlusCircleIcon } from "react-line-awesome";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import classnames from "classnames";

const useStyles = makeStyles(({ palette }) => {
  return {
    addIcon: {
      fontSize: 18,
      color: palette.primary.main,
      verticalAlign: "middle",
    },
    buttonText: {
      fontSize: 16,
      color: palette.primary.main,
      marginLeft: 6,
    },
    disabledButton: {
      cursor: "default",
      color: palette.text.secondary,
    },
  };
});
const AddItemsButton = ({
  buttonLabel,
  id,
  onClickCallBack,
  disabled = false,
}) => {
  const classes = useStyles();
  return (
    <Button id={id} onClick={onClickCallBack} disabled={disabled}>
      <Grid item>
        <PlusCircleIcon
          className={classnames(classes.addIcon, {
            [classes.disabledButton]: disabled,
          })}
        />
      </Grid>
      <Grid item>
        <Typography
          id={id}
          className={classnames(classes.buttonText, {
            [classes.disabledButton]: disabled,
          })}
        >
          {buttonLabel}
        </Typography>
      </Grid>
    </Button>
  );
};

AddItemsButton.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  onClickCallBack: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default AddItemsButton;
