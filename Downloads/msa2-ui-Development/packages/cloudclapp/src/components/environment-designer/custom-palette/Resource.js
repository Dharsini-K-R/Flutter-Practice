import React from "react";
import { useTranslation } from "react-i18next";

import { Grid, Button, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { DharmachakraIcon } from "react-line-awesome";
import { useCommonStyles } from "./styles/commonStyles";

const resources = [
  {
    name: "K8 Cluster",
    Icon: DharmachakraIcon,
    iconStyles: {
      border: "1px solid #B2BCCE",
      borderRadius: 4,
      padding: 2,
      color: "#DE915A",
    },
  },
];

const Resource = ({ modelerActions, onClickHandler, onMouseDownHandler }) => {
  const { t } = useTranslation();

  const { generateK8Element } = modelerActions;
  const classes = useCommonStyles();

  return (
    <Grid container>
      {resources.map((resource, index) => {
        const { name, Icon, iconStyles } = resource;
        const id = `${name}-${index}`;
        const element = generateK8Element({
          data: {},
          extraProps: {
            cloudVendor: "",
            cloudService: "",
          },
        });
        return (
          <Grid item xs={12} className={classes.node} key={id}>
            <Tooltip title={name} arrow>
              <Button
                id={`ENVIRONMENT_DESIGNER_PALETTE_RESOURCE_${id}`}
                onClick={(event) => {
                  onClickHandler(event, element);
                }}
                onMouseDown={(event) => {
                  onMouseDownHandler(event, element);
                }}
                className={classes.resourceButton}
              >
                <Icon className={classes.resourceIcon} style={iconStyles} />
                <Typography className={classes.resourceTitle}>
                  {t(name)}
                </Typography>
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Resource;
