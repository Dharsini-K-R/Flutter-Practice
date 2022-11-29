import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useDialog from "cloudclapp/src/hooks/useDialog";
import { getTagDetails, createTag } from "cloudclapp/src/api/tags";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { getOrganisationId } from "cloudclapp/src/store/designations";
import { getToken } from "cloudclapp/src/store/auth";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import InputField from "cloudclapp/src/components/controls/InputField";
import classNames from "classnames";
import {
  Grid,
  Box,
  Paper,
  CircularProgress,
  makeStyles,
  Button,
  Typography,
  IconButton,
  FormControl,
} from "@material-ui/core";
import Dialog from "cloudclapp/src/components/dialog/Dialog";
import { PlusCircleIcon, TrashAltIcon } from "react-line-awesome";
import { ReactComponent as IconEdit } from "msa2-ui/src/assets/icons/edit.svg";
import { getPermission } from "cloudclapp/src/store/designations";

const useStyles = makeStyles(({ palette, spacing }) => {
  return {
    boxStyle: {
      display: "flex",
      flexDirection: "column",
      p: 2,
    },
    tableHeader: {
      padding: "20px",
      borderBottom: "1px solid #B2BCCE",
      borderTop: "1px solid #B2BCCE",
    },
    tableBody: {
      padding: "0px 16px 8px 16px",
      overflowY: "auto",
      height: "400px",
    },
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    formField: {
      margin: `${spacing(1)}px 0`,
      textAlign: "left",
      weight: "100%",
    },
    text: {
      fontColor: palette.text.primary,
      fontWeight: 600,
      fontSize: 13,
    },
    buttonText: {
      fontSize: 16,
      color: palette.primary.main,
      marginLeft: 6,
      fontWeight: 400,
    },
    errorMessage: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 30,
    },
  };
});

const ManageTags = () => {
  const classes = useStyles();
  const [tags, setTags] = useState([]);
  const [showEditDialog, EditTag] = useDialog();
  const [showCreateDialog, CreateTag] = useDialog();
  const token = useSelector(getToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isTagDelete, setIsTagDelete] = useState();
  const [createTagName, setCreateTagName] = useState("");
  const [createTagValue, setCreateTagValue] = useState("");
  const [editTagName, setEditTagName] = useState("");
  const [editTagValue, setEditTagValue] = useState("");
  const [deleteSelectedTag, setDeleteSelectedTag] = useState(null);
  const commonClasses = useCommonStyles();
  const { t } = useTranslation();

  const orgId = useSelector(getOrganisationId);

  const getTags = async () => {
    setCreateTagName("");
    setCreateTagValue("");
    setIsLoading(true);

    const [getError, _tags] = await getTagDetails({
      orgId,
      token,
    });

    if (!getError) {
      const tagValue = _tags.find(({ name }) => name === "CLOUDCLAPP_TAGS")
        ?.value;

      const tags = tagValue
        .split(",")
        .filter((tag) => Boolean(tag))
        .map((tag) => {
          const [name, value] = tag.split(":");
          return { name, value };
        });
      setTags(tags);
    }
    setIsLoading(false);
  };

  const handleCreateCall = async () => {
    setIsLoading(true);

    const data = tags
      .map(({ name, value }) => name + ":" + value)
      .concat(createTagName + ":" + createTagValue)
      .join();

    const [error] = await createTag({
      data,
      orgId,
      token,
    });

    if (error) {
      setCreateTagName("");
      setCreateTagValue("");
      setIsLoading(false);
      return;
    }

    getTags();
  };

  useEffect(() => {
    getTags();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditCall = async () => {
    setIsLoading(true);
    const data = tags
      .filter((_, i) => i !== deleteSelectedTag)
      .map(({ name, value }) => name + ":" + value)
      .concat(editTagName + ":" + editTagValue)
      .join();

    const [error] = await createTag({
      data,
      orgId,
      token,
    });

    if (error) {
      setEditTagName("");
      setEditTagValue("");
      setIsLoading(false);
      return;
    }

    getTags();
  };

  const handleDeleteCall = async () => {
    setIsLoading(true);

    const data = tags
      .filter((_, i) => i !== deleteSelectedTag)
      .map(({ name, value }) => name + ":" + value)
      .join();

    const [error] = await createTag({
      data,
      orgId,
      token,
    });

    if (error) {
      deleteSelectedTag(null);
      setIsLoading(false);
      return;
    }

    getTags();
    setIsTagDelete(false);
  };

  const canCreateTags = useSelector(
    getPermission("governance", "tags", "create"),
  );
  const canUpdateTags = useSelector(
    getPermission("governance", "tags", "update"),
  );
  const canDeleteTags = useSelector(
    getPermission("governance", "tags", "delete"),
  );

  return (
    <Paper data-testid="manage_tags_component">
      <Box p={1}>
        { canCreateTags && (
          <Box pt={1} pb={1} pl={2} pr={2}>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item>
                <Button
                  id="TAG_COST_GRAPHS_APPLY"
                  className={classes.buttonText}
                  onClick={() => {
                    showCreateDialog();
                  }}
                  startIcon={<PlusCircleIcon />}
                >
                  {t("Create Tags")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box className={classes.tableHeader}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              fontSize: "13px",
            }}
          >
            <Grid
              className={classNames(
                classes.flexSpaceBtw,
                commonClasses.commonTableCellDefault,
              )}
            >
              <Grid item xs={3}>
                {t("Name")}
              </Grid>
              <Grid item xs={7}>
                {t("Value")}
              </Grid>
              <Grid item xs={1}>
                {t("Actions")}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box pb={1} pl={2} pr={2} className={classes.tableBody}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            tags.map((tag, i) => {
              return (
                <Box
                  sx={{
                    padding: "0px 10px",
                    display: "flex",
                    flexDirection: "row",
                    "&:hover": {
                      background: "#efefef",
                    },
                  }}
                  key={i}
                >
                  <Grid className={classes.flexSpaceBtw}>
                    <Grid item xs={3}>
                      <Typography
                        className={classes.text}
                        style={{padding: "12px"}}
                        id={`GOVERNANCE_TAG_NAME_${i}`}
                      >
                        {tag.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        className={classes.text}
                        style={{padding: "12px"}}
                        id={`GOVERNANCE_TAG_VALUE_${i}`}
                      >
                        {tag.value}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      {canUpdateTags && (
                        <IconButton
                          id={`GOVERNANCE_TAG_EDIT_${i}`}
                          onClick={() => {
                            setEditTagName(tag.name);
                            setEditTagValue(tag.value);
                            setDeleteSelectedTag(i);
                            showEditDialog();
                          }}
                        >
                          <IconEdit />
                        </IconButton>
                      )}
                      {canDeleteTags && (
                        <IconButton
                          id={`GOVERNANCE_TAG_DELETE_${i}`}
                          onClick={() => {
                            setDeleteSelectedTag(i);
                            setIsTagDelete(true);
                          }}
                        >
                          <TrashAltIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              );
            })
          )}
          {!isLoading && tags.length === 0 && (
            <Typography className={classes.errorMessage}>
              {t("There are no data to show.")}
            </Typography>
          )}
        </Box>
      </Box>
      <EditTag
        id="EDIT_TAGS"
        title={t("Edit Tag Details")}
        maxWidth={"sm"}
        onExec={handleEditCall}
        disabled={isEmpty(editTagName) || isEmpty(editTagValue)}
      >
        <Box className={classes.boxStyle}>
          <FormControl>
            <Grid className={classes.flexSpaceBtw}>
              <Grid item>
                <Typography variant="body1" id="TAG_EDIT_NAME">
                  {t("Name")}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <InputField
                  id="TAG_NAME_EDIT"
                  value={editTagName}
                  className={classes.formField}
                  onChange={({ target }) => setEditTagName(target.value)}
                />
              </Grid>
            </Grid>

            <Grid className={classes.flexSpaceBtw}>
              <Grid item>
                <Typography variant="body1" id="TAG_EDIT_VALUE">
                  {t("Value")}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <InputField
                  id="TAG_VALUE_EDIT"
                  value={editTagValue}
                  className={classes.formField}
                  onChange={({ target }) => setEditTagValue(target.value)}
                />
              </Grid>
            </Grid>
          </FormControl>
        </Box>
      </EditTag>
      <CreateTag
        id="CREATE_TAGS"
        title={t("Create Tag")}
        maxWidth={"sm"}
        onExec={handleCreateCall}
        disabled={isEmpty(createTagName) || isEmpty(createTagValue)}
      >
        <Box className={classes.boxStyle}>
          <FormControl>
            <Grid className={classes.flexSpaceBtw}>
              <Grid item>
                <Typography variant="body1" id="TAG_CREATE_NAME">
                  {t("Name")}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <InputField
                  id="TAG_NAME_CREATE"
                  value={createTagName}
                  className={classes.formField}
                  onChange={({ target }) => setCreateTagName(target.value)}
                />
              </Grid>
            </Grid>

            <Grid className={classes.flexSpaceBtw}>
              <Grid item>
                <Typography variant="body1" id="TAG_CREATE_VALUE">
                  {t("Value")}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <InputField
                  id="TAG_NAME_CREATE"
                  value={createTagValue}
                  className={classes.formField}
                  onChange={({ target }) => setCreateTagValue(target.value)}
                />
              </Grid>
            </Grid>
          </FormControl>
        </Box>
      </CreateTag>
      {isTagDelete && (
        <Dialog
          onClose={() => {
            setIsTagDelete(false);
          }}
          title={t("Confirmation Request")}
          onExec={handleDeleteCall}
          content={t("Are you sure you want to delete this tag?")}
        />
      )}
    </Paper>
  );
};

export default ManageTags;
