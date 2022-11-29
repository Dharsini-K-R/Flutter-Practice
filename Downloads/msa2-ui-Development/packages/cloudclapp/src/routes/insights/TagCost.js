import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Button,
  Tooltip,
} from "@material-ui/core";

import { updateRepositoryFile } from "msa2-ui/src/api/repository";
import {
  COST_GRAPH,
  CHART_TYPE,
  MONITORING_PERIODS,
} from "cloudclapp/src/Constants";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";
import { useSnackbar } from "notistack";
import { formatDateOrString } from "msa2-ui/src/utils/date";
import { getCostByID } from "cloudclapp/src/api/cost";
import {
  getOrganisationId,
  getEnvironments,
  get_Tags,
} from "cloudclapp/src/store/designations";
import { setUISettings, getUISettings } from "cloudclapp/src/store/settings";
import { useSelector, useDispatch } from "react-redux";
import { getToken, getUserDetails } from "cloudclapp/src/store/auth";
import { flatten, isEmpty, groupBy } from "lodash";
import SelectField from "cloudclapp/src/components/controls/select/SelectField";
import BarCharts from "./BarCharts";
import LineCharts from "./LineCharts";
import AreaCharts from "./AreaCharts";
import { QuestionCircleIcon } from "react-line-awesome";

const useStyles = makeStyles(() => {
  return {
    flexSpaceBtw: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    Loadspinner: {
      marginLeft: "10px",
      marginTop: "5px",
    },
    yAxisUnit: {
      marginLeft: 64,
    },
    errorMessage: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 30,
    },
    selectLabel: {
      fontWeight: "600",
    },
    tagSection: {
      height: 600,
      overflowY: "scroll",
    },
  };
});

const TagCost = () => {
  const settingsData = useSelector(getUISettings);
  const environments = useSelector(getEnvironments());
  const _tags = useSelector(get_Tags);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const token = useSelector(getToken);
  const { id } = useSelector(getUserDetails);
  const [dateInput, setDateInput] = useState(
    settingsData?.granularity || MONITORING_PERIODS.MONTHLY,
  );
  const [chartType, setChartType] = useState(
    settingsData?.chartType || CHART_TYPE.BAR,
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [childCheckedTags, setChildCheckedTags] = useState([]);
  const [envCheckedTags, setEnvCheckedTags] = useState(
    settingsData?.envs || [],
  );
  const [chartData, setChartData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState(_tags);
  const [monitoringPeriod] = useState(COST_GRAPH.INITIAL);

  let selectedTags = "";
  let selectedEnv = "";
  const savedTags = [];

  const orgId = useSelector(getOrganisationId);

  const getSavedData = () => {
    if (settingsData.envs) {
      setEnvCheckedTags(settingsData.envs);
    }
    if (settingsData.tags) {
      settingsData.tags.forEach((data) => {
        if (data.isChecked === true) {
          savedTags.push(data.id);
        }
      });
      if (savedTags.length > 0) {
        setChildCheckedTags(savedTags);
      }
    }

    (savedTags || settingsData?.envs) && callCostByID();
  };

  useEffect(() => {
    setTags(_tags);
  }, [_tags]);

  useEffect(() => {
    if (settingsData?.tags || settingsData?.envs) {
      getSavedData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSaveData = async (tags, envs) => {
    const content = {
      ...settingsData,
      envs: envs,
      tags: tags,
      granularity: dateInput,
      chartType: chartType,
    };

    await dispatch(setUISettings(content));

    const [error, response] = await updateRepositoryFile({
      uri: `Datafiles/ccla_dashboard/${orgId}_${id}`,
      content,
      token,
    });

    if (error || response?.errorCode) {
      const message = error ? error.getMessage(t("Error ")) : response.message;

      enqueueSnackbar(message, {
        variant: error ? "error" : "success",
        action: (key) => (
          <SnackbarAction id={key} handleClose={closeSnackbar} />
        ),
      });
    }
  };

  const callCostByID = async () => {
    setIsLoading(true);
    let finalData = "";
    let saveTagData = [];
    let availableVendors = [];

    const processedTags =
      childCheckedTags.length > 0 ? childCheckedTags : savedTags;

    const chart_Data = [];

    if (tags.length > 0) {
      saveTagData = tags.map((v) => ({
        ...v,
        isChecked: processedTags.includes(v.id),
      }));

      availableVendors = processedTags.map((item) => {
        const Cluster = tags.find((x) => x.id === item).key;
        const MyTag = tags.find((x) => x.id === item).value;
        return [
          null,
          {
            displayName: [Cluster, MyTag].join(":").toLowerCase(),
          },
        ];
      });

      processedTags.forEach((item) => {
        const Cluster = tags.find((x) => x.id === item).key;
        const MyTag = tags.find((x) => x.id === item).value;

        selectedTags += `CLOUDCLAPP_${Cluster}:${MyTag},`;
      });
    }

    if (envCheckedTags.length > 0) {
      environments.forEach((item) => {
        if (envCheckedTags.includes(item.envUbiqubeId)) {
          availableVendors.push([
            null,
            {
              displayName: item.envName.toLowerCase(),
            },
          ]);
        }
      });

      envCheckedTags.forEach((item) => {
        selectedEnv += `CLOUDCLAPP_ENVID:${item},`;
      });
    }

    setVendorData(availableVendors);
    finalData = selectedTags.concat(selectedEnv);

    const [error, costByID] = await getCostByID({
      orgId,
      granularity: dateInput.value,
      startDate: formatDateOrString(monitoringPeriod[0], "yyyy-MM-dd"),
      endDate: formatDateOrString(monitoringPeriod[1], "yyyy-MM-dd"),
      tags: finalData,
      connectionName: "aws-connection",
      token,
    });

    if (!error) {
      updateSaveData(saveTagData, envCheckedTags);
      const flattenedCost = flatten(
        costByID.reduce((acc, cur) => {
          const costPerCloud = Object.values(cur);

          return [...acc, ...costPerCloud];
        }, []),
      );

      flattenedCost.forEach(({ cost, tag }) => {
        let tagKeyValue = [];

        if (tag.key.toLowerCase() === "cloudclapp_envid") {
          const cluster = environments
            .find(
              (x) => x.envUbiqubeId.toLowerCase() === tag.value.toLowerCase(),
            )
            .envName.toLowerCase();

          tagKeyValue = [cluster];
        } else {
          tagKeyValue = [
            tag.key
              .toLowerCase()
              .split("cloudclapp_")
              .pop(),
            tag.value.toLowerCase(),
          ].join(":");
        }

        cost.forEach(({ startDate, cost }) => {
          const date = formatDateOrString(startDate, dateInput.format);
          const targetDateIndex = chart_Data.findIndex(
            (entry) => entry.date === date,
          );

          const costData = { [tagKeyValue]: cost.toString() };

          if (targetDateIndex >= 0) {
            const addedCost =
              parseFloat(chart_Data[targetDateIndex][tagKeyValue]) +
              parseFloat(costData[tagKeyValue]);

            if (chart_Data[targetDateIndex][tagKeyValue] !== undefined) {
              costData[tagKeyValue] = addedCost;
            }

            chart_Data[targetDateIndex] = {
              ...chart_Data[targetDateIndex],
              ...costData,
            };
          } else {
            chart_Data.push({ date, ...costData });
          }
        });
      });
    }

    setChartData(chart_Data);

    setIsLoading(false);
  };

  const groupedTags = groupBy(tags, "key");

  const renderChart = () => {
    if (chartType.value === "Line") {
      return <LineCharts data={chartData} vendor={vendorData} />;
    } else if (chartType.value === "Bar") {
      return <BarCharts data={chartData} vendor={vendorData} />;
    } else if (chartType.value === "Area") {
      return <AreaCharts data={chartData} vendor={vendorData} />;
    } else {
      return null;
    }
  };

  const handleAllEnvChange = (isChecked) => {
    let selected = [];
    if (isChecked) {
      selected = environments.map((item) => item.envUbiqubeId);
    }

    setEnvCheckedTags(selected);
  };

  const handleEnvChange = (isChecked, id) => {
    if (isChecked) {
      const newVal = envCheckedTags.concat([id]);
      return setEnvCheckedTags(newVal);
    }

    if (!isChecked) {
      const newVal = envCheckedTags.filter((val) => ![id].includes(val));
      setEnvCheckedTags(newVal);
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={7}>
          <Box p={1} display="flex" flexDirection="row" alignItems="center">
            <Box p={1}>
              <Typography noWrap variant="h5">
                {t("Costs / Tags")}
              </Typography>
            </Box>
            <Tooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">{t("Env / Tags")}</Typography>
                  {t(
                    "The Cost is based on selected Environments / Tags. There can be overlaps if you select multiple Tags.",
                  )}
                </React.Fragment>
              }
              arrow
            >
              <QuestionCircleIcon style={{ fontSize: 20, color: "#384052" }} />
            </Tooltip>
            {isLoading && (
              <Box>
                <div className={classes.Loadspinner}>
                  <CircularProgress size={20} />
                </div>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={5}
          container
          justifyContent="flex-end"
          alignItems="center"
        >
          <Box pr={1}>
            <SelectField
              id="TAG_COST_GRAPHS_DATE_FILTER"
              className={classes.selectInput}
              width={170}
              options={Object.values(CHART_TYPE)}
              value={chartType}
              onChange={(type) => {
                setChartType(type);
              }}
              disabled={isLoading || isEmpty(chartData)}
            />
          </Box>
          <Box pr={1}>
            <SelectField
              id="TAG_COST_GRAPHS_DATE_FILTER"
              className={classes.selectInput}
              width={170}
              options={Object.values(MONITORING_PERIODS)}
              value={dateInput}
              onChange={(event) => {
                setDateInput(event);
              }}
              disabled={isLoading || isEmpty(chartData)}
            />
          </Box>
          <Box pr={1}>
            <Button
              id="TAG_COST_GRAPHS_APPLY"
              variant="contained"
              color="primary"
              className={classes.conectBtn}
              disabled={
                childCheckedTags.length === 0 && envCheckedTags.length === 0
              }
              onClick={callCostByID}
            >
              {t("Apply")}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="Flex-start"
      >
        <Grid item xs={3} className={classes.tagSection}>
          <Box
            p={1}
            display="flex"
            flexDirection="column"
            alignItems="Flex-start"
          >
            <Box pb={1}>
              <Typography className={classes.selectLabel}>
                {t("Environments")}
              </Typography>
            </Box>
            {!isEmpty(environments) ? (
              <>
                <Grid item>
                  <FormControlLabel
                    label={"Select All"}
                    control={
                      <Checkbox
                        checked={envCheckedTags.length === environments.length}
                        onChange={({ target }) =>
                          handleAllEnvChange(target.checked)
                        }
                        color={"primary"}
                      />
                    }
                  />
                </Grid>
                {environments.map((env) => (
                  <>
                    <Grid item style={{ marginLeft: 20 }}>
                      <FormControlLabel
                        label={env.envName}
                        control={
                          <Checkbox
                            key={env.envUbiqubeId}
                            checked={envCheckedTags.includes(env.envUbiqubeId)}
                            onChange={({ target }) => {
                              handleEnvChange(target.checked, env.envUbiqubeId);
                            }}
                            color={"primary"}
                          />
                        }
                      />
                    </Grid>
                  </>
                ))}
              </>
            ) : (
              <Typography className={classes.errorMessage}>
                {t("No Environments Found.")}
              </Typography>
            )}
          </Box>
          <Box
            p={1}
            display="flex"
            flexDirection="column"
            alignItems="Flex-start"
          >
            <Box pb={1}>
              <Typography className={classes.selectLabel}>
                {t("Tags")}
              </Typography>
            </Box>
            {!isEmpty(groupedTags) ? (
              Object.entries(groupedTags).map(([key, values], index) => {
                const handleChange1 = (isChecked) => {
                  const temp = values.map((tag) => tag.id);
                  if (isChecked) {
                    const newVal = temp.concat(childCheckedTags);
                    return setChildCheckedTags(newVal);
                  } else {
                    const newVal = childCheckedTags.filter(
                      (val) => !temp.includes(val),
                    );
                    setChildCheckedTags(newVal);
                  }
                };

                const handleChange2 = (isChecked, id) => {
                  const index = childCheckedTags.indexOf(id);

                  if (isChecked) {
                    const newVal = childCheckedTags.concat([id]);
                    return setChildCheckedTags(newVal);
                  }

                  if (!isChecked && index > -1) {
                    const newVal = childCheckedTags.filter(
                      (val) => ![id].includes(val),
                    );

                    setChildCheckedTags(newVal);
                  }
                };

                return (
                  <>
                    <Grid item>
                      <FormControlLabel
                        label={key}
                        control={
                          <Checkbox
                            checked={
                              childCheckedTags.length > 0 &&
                              !values
                                .map((value) =>
                                  childCheckedTags.includes(value.id),
                                )
                                .includes(false)
                            }
                            indeterminate={
                              childCheckedTags.length > 0 &&
                              values
                                .map((value) =>
                                  childCheckedTags.includes(value.id),
                                )
                                .filter(Boolean).length > 0 &&
                              values
                                .map((value) =>
                                  childCheckedTags.includes(value.id),
                                )
                                .includes(false)
                            }
                            onChange={(event) =>
                              handleChange1(event.target.checked)
                            }
                            color={"primary"}
                          />
                        }
                      />
                    </Grid>

                    {values.map((value) => (
                      <>
                        <Grid item style={{ marginLeft: 20 }}>
                          <FormControlLabel
                            label={value.value}
                            control={
                              <Checkbox
                                key={value.id}
                                checked={childCheckedTags.includes(value.id)}
                                onChange={(event) =>
                                  handleChange2(event.target.checked, value.id)
                                }
                                color={"primary"}
                              />
                            }
                          />
                        </Grid>
                      </>
                    ))}
                  </>
                );
              })
            ) : (
              <Typography className={classes.errorMessage}>
                {t("No Tags Found.")}
              </Typography>
            )}
          </Box>
        </Grid>
        {chartData.length ? (
          <Grid item xs={9}>
            {renderChart()}
          </Grid>
        ) : (
          <Grid item xs={9}>
            <Typography className={classes.errorMessage}>
              {t("There are no data to show.")}
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default TagCost;
