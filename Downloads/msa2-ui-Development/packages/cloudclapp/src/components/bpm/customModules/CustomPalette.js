import React from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Grid } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Infrastructure from "../../environment-designer/custom-palette/Infrastructure";
import Resource from "../../environment-designer/custom-palette/Resource";

const useStyles = makeStyles(({ palette }) => ({
  paletteComponent: {
    display: "inline-block",
    backgroundColor: "white",
    height: "100%",
  },
  sectionComponent: {
    borderBottom: "1px solid #D9D9D9",
  },
  accordion: {
    borderRadius: "0px",
    boxShadow: "none",
  },
  accordionSummary: {
    textTransform: "uppercase",
    fontWeight: 500,
  },
}));

const CustomPalette = ({ environment, modelerActions }) => {
  const { t } = useTranslation();

  const { startDraggingElement, placeElement } = modelerActions;

  const classes = useStyles();

  const onClickHandler = (event, element) => {
    element && placeElement(element);
  };

  const onMouseDownHandler = (event, element) => {
    element && startDraggingElement(event, element);
  };

  const sections = [
    {
      accordionTitle: t("Infrastructure"),
      accordionDetails: () => (
        <Infrastructure
          environment={environment}
          modelerActions={modelerActions}
          onClickHandler={onClickHandler}
          onMouseDownHandler={onMouseDownHandler}
        />
      ),
    },
    {
      accordionTitle: t("Resources"),
      accordionDetails: () => (
        <Resource
          modelerActions={modelerActions}
          onClickHandler={onClickHandler}
          onMouseDownHandler={onMouseDownHandler}
        />
      ),
    },
  ];

  return (
    <Grid container className={classes.paletteComponent}>
      {sections.map((section, index) => {
        const { accordionTitle, accordionDetails } = section;
        const id = `${accordionTitle}-${index}`;
        return (
          <Grid item xs={12} className={classes.sectionComponent} key={id}>
            <Accordion defaultExpanded className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionSummary}>
                  {accordionTitle}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>{accordionDetails()}</AccordionDetails>
            </Accordion>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CustomPalette;
