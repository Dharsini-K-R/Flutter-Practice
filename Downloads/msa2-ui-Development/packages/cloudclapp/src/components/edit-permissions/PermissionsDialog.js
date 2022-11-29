import React, { useState } from "react";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useCommonStyles } from "msa2-ui/src/styles/commonStyles";
import { isObject, snakeCase, startCase } from "lodash";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import Sidebar from "msa2-ui/src/components/modal/Sidebar";

const getCategoryId = (category) => {
  return `PERMISSIONS_TREE_CATEGORY_LABEL_${snakeCase(category)}`.toUpperCase();
};

const getCategoryTitle = (category) => {
  const CATEGORY_TITLES = {
    ai: "Intent-Based",
    bpm: "BPM",
  };

  return CATEGORY_TITLES[category] || startCase(category);
};

const getSubcategoryCheckboxId = ({ category, subCategory }) => {
  return `PERMISSIONS_TREE_SUBCATEGORY_CHECKBOX_${snakeCase(
    category,
  )}_${snakeCase(subCategory)}`.toUpperCase();
};

const getSubCategoryTitle = (subCategory) => {
  const SUB_CATEGORY_TITLES = {
    obmf: "Configure",
  };

  return SUB_CATEGORY_TITLES[subCategory] || startCase(subCategory);
};

const getActionId = ({ category, subCategory, action }) => {
  return `PERMISSIONS_TREE_ACTION_CHECKBOX_${snakeCase(category)}_${snakeCase(
    subCategory,
  )}_${snakeCase(action)}`.toUpperCase();
};

const getActionTitle = (action) => {
  const ACTION_TITLES = {
    modify: "Edit",
    provisioning: "Activate",
  };

  return ACTION_TITLES[action] || startCase(action);
};

const useStyles = makeStyles(() => ({
  categoriesSidebar: {
    position: "absolute",
    width: 250,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginRight: 30,
    paddingRight: 20,
  },
  scrollContainer: {
    marginLeft: 300,
  },
  subCategoryLabel: {
    textTransform: "uppercase",
    fontWeight: 600,
  },
  subCategoryDescription: {
    textAlign: "left",
    margin: "-5px 0px 5px 30px",
  },

  subCategoryDivider: {
    marginTop: 10,
    marginBottom: 10,
  },
  action: {
    marginLeft: 20,
  },
  actionLabel: {
    textTransform: "capitalize",
  },
  labelsInput: {
    alignItems: "center",
    paddingLeft: "35px",
    marginTop: "9px",
  },
}));

const PermissionsDialog = ({ actions, setActions }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const categories = Object.keys(actions);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const onChangeSubCategory = ({ event, category, subCategory }) => {
    const { checked } = event.target;
    const subCategoryActions = actions[category][subCategory];

    for (const action in subCategoryActions) {
      if (
        Object.prototype.hasOwnProperty.call(subCategoryActions, action) &&
        isObject(subCategoryActions[action])
      ) {
        subCategoryActions[action].value = checked;
      }
    }

    setActions({
      ...actions,
      [category]: {
        ...actions[category],
        [subCategory]: {
          ...subCategoryActions,
          value: checked,
        },
      },
    });
  };

  const onChangeAction = ({ event, category, subCategory, action }) => {
    const { checked } = event.target;

    const allActionsAreChecked = (subCategory) => {
      const allActions = Object.values(subCategory).filter((item) =>
        Object.prototype.hasOwnProperty.call(item, "value"),
      );
      const checkedActions = Object.values(allActions).filter(
        (item) => item.value,
      );
      return checkedActions.length === Object.values(allActions).length;
    };

    const newActions = {
      ...actions,
      [category]: {
        ...actions[category],
        [subCategory]: {
          ...actions[category][subCategory],
          [action]: {
            ...actions[category][subCategory][action],
            value: checked,
          },
        },
      },
    };

    setActions({
      ...newActions,
      [category]: {
        ...newActions[category],
        [subCategory]: {
          ...newActions[category][subCategory],
          value: allActionsAreChecked(newActions[category][subCategory]),
        },
      },
    });
  };

  const renderCategory = (category, data) => {
    const subCategories = Object.keys(data);

    return subCategories
      .filter(
        (subCategory) =>
          subCategory !== "labels",
      )
      .map((subCategory, index, filtered) =>
        renderSubCategory({
          category,
          subCategory,
          data: data[subCategory],
          lastChild: index === filtered.length - 1,
          index,
        }),
      );
  };

  const renderSubCategory = ({
    category,
    subCategory,
    data,
    lastChild,
    index,
  }) => {
    const { value } = data;
    const actionsList = Object.keys(data);

    const someActionsAreChecked = ({
      category,
      subCategory,
      subCategoryChecked,
    }) => {
      const subCategoryActions = actions[category][subCategory];
      const checkedActions = Object.values(subCategoryActions).filter(
        (item) => item.value,
      );
      return checkedActions.length > 0 && !subCategoryChecked;
    };

    return isObject(data) ? (
      <Grid key={index} container direction="column">
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              name={subCategory}
              indeterminate={someActionsAreChecked({
                category,
                subCategory,
                subCategoryChecked: value,
              })}
              onChange={(event) =>
                onChangeSubCategory({ event, category, subCategory })
              }
              id={getSubcategoryCheckboxId({ category, subCategory })}
            />
          }
          label={
            <Typography className={classes.subCategoryLabel}>
              {t(getSubCategoryTitle(subCategory))}
            </Typography>
          }
        />
        <Typography
          variant="body1"
          className={classnames(
            commonClasses.commonDescription,
            classes.subCategoryDescription,
          )}
        >
          {actions[category][subCategory].comment ?? ""}
        </Typography>
        {
          actionsList
            .map((action) =>
              renderAction({
                category,
                subCategory,
                action,
                data: data[action],
              }),
            )
        }
        {!lastChild && <Divider className={classes.subCategoryDivider} />}
      </Grid>
    ) : null;
  };

  const renderAction = ({ category, subCategory, action, data }) => {
    const { value, comment } = data;
    return isObject(data) ? (
      <Tooltip title={comment || ""} enterDelay={500}>
        <FormControlLabel
          className={classes.action}
          key={action}
          control={
            <Checkbox
              id={getActionId({ category, subCategory, action })}
              checked={value}
              name={action}
              onChange={(event) =>
                onChangeAction({ event, category, subCategory, action })
              }
            />
          }
          label={
            <Typography className={classes.actionLabel}>
              {t(getActionTitle(action))}
            </Typography>
          }
        />
      </Tooltip>
    ) : null;
  };

  return (
    <>
      {categories.length > 0 ? (
        <Grid container direction="row">
          <Grid item xs={4} className={classes.categoriesSidebar}>
            <Sidebar>
              {categories
                .map((category, index) => (
                  <Sidebar.ListItem
                    key={index}
                    id={getCategoryId(category)}
                    selected={activeCategory === category}
                    title={t(getCategoryTitle(category))}
                    onClick={() => setActiveCategory(category)}
                    tooltipText={actions[category].comment}
                    tooltipPlacement="top"
                  />
                ))}
            </Sidebar>
          </Grid>
          <Grid item xs={8} className={classes.scrollContainer}>
            {categories.map(
              (category) =>
                activeCategory === category &&
                renderCategory(category, actions[category]),
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid>{t("No actions available")}</Grid>
      )}
    </>
  );
};

export default PermissionsDialog;
