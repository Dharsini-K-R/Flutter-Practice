import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Grid, makeStyles } from "@material-ui/core";
import { PlusCircleIcon } from "react-line-awesome";
import { PropTypes } from "prop-types";

const useStyles = makeStyles(({ palette }) => ({
  addIcon: {
    fontSize: 18,
    color: palette.primary.main,
    verticalAlign: "middle",
  },
  buttonText: {
    fontSize: 16,
    color: palette.text.support,
    marginLeft: 6,
    fontWeight: "500",
  },
  emptyBoxBorder: {
    border: "1px dashed #B2BCCE",
    width: "49%",
    cursor: "pointer",
    height: "170px",
    boxSizing: "border-box",
    borderRadius: "4px",
    "&.MuiBox-root": {
      padding: "40px",
    },
  },
}));

const AddApplicationTile = ({ addApplicationCallBack }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box
      component="span"
      p={6}
      className={classes.emptyBoxBorder}
      id="DEPLOYMENTS_ADD_APPLICATION_BUTTON"
      onClick={addApplicationCallBack}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <PlusCircleIcon className={classes.addIcon} />
        </Grid>
        <Grid item>
          <Typography
            id="DEPLOYMENTS_ADD_APPLICATION"
            className={classes.buttonText}
          >
            {" "}
            {t("Add Application Images")}{" "}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

AddApplicationTile.propTypes = {
  addApplicationCallBack: PropTypes.func.isRequired,
};

export default AddApplicationTile;
