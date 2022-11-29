import React from "react";
import {
  Grid,
  Box,
  CircularProgress,
  makeStyles,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import ApplicationSearchAndFilter from "./ApplicationSearchAndFilter";
import PrivateDockerImages from "./PrivateDockerImages";
import {
  getImagesFromPrivateDockerHub,
  getOrganizationList,
} from "cloudclapp/src/api/applications";
import useApi from "cloudclapp/src/hooks/useApi";
import { DEPLOYMENT_VARIABLES_NAME } from "cloudclapp/src/Constants";
import {
  getTableRowsSetting,
  changeTableRowsSetting,
} from "cloudclapp/src/store/settings";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "cloudclapp/src/styles/commonStyles";
import InputField from "cloudclapp/src/components/controls/InputField";
import classnames from "classnames";
import useTogglePassword from "msa2-ui/src/hooks/useTogglePassword";
import { EyeIcon, EyeSlashIcon } from "react-line-awesome";
import { getToken } from "cloudclapp/src/store/auth";
import StatusBadgeIcon from "cloudclapp/src/components/status-badge-icon/StatusBadgeIcon";

const useStyles = makeStyles(({ palette, typography }) => ({
  boxWidthPadding: {
    width: "100%",
    paddingTop: "2%",
    paddingLeft: "2%",
    paddingBottom: "1%",
  },
  tabPanel: {
    width: "100%",
    height: "100%",
    backgroundColor: palette.background.paper,
    boxSizing: "border-box",
  },
  privateCredentialsBox: {
    width: "75%",
  },
  envRadio: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
}));

const PrivateDockerHub = ({
  setApplicationsTabsCallBack,
  setApplicationsCallBack,
}) => {
  const [
    imagesArrayForDeployment,
    setImagesArrayForDeployment,
  ] = React.useState([]);

  const commonClasses = useCommonStyles();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const token = useSelector(getToken);

  const [searchString, setSearchString] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    useSelector(getTableRowsSetting("applicationsDockerhub")),
  );
  const [loadingPrivateOrgs, setLoadingPrivateOrgs] = React.useState(false);
  const [organizationList, setOrganizationList] = React.useState({});
  const [privateOrgValue, setPrivateOrgValue] = React.useState("");
  const [formErrors, setFormErrors] = React.useState({});
  const [formData, setFormData] = React.useState({
    userName: undefined,
    userPassword: undefined,
  });

  const [loading, , dockerImagesList, ,] = useApi(
    getImagesFromPrivateDockerHub,
    {
      username: formData.userName,
      password: formData.userPassword,
      orgName: privateOrgValue,
      name: searchString,
      page: page + 1,
      pageSize: rowsPerPage,
      token,
    },
    isEmpty(privateOrgValue),
  );

  const handleSearchStringChange = (event) => {
    setPage(0);
    setSearchString(event.target.value);
  };
  const onChangePage = (pageNumber) => {
    setPage(pageNumber < 0 ? 0 : pageNumber);
  };
  const onRowsPerPageChange = (_, { props }) => {
    const numberOfRows = props?.value ?? 10;
    dispatch(
      changeTableRowsSetting({
        table: "applicationsDockerhub",
        numberOfRows,
      }),
    );
    setPage(Math.floor((page * rowsPerPage) / numberOfRows));
    setRowsPerPage(numberOfRows);
  };

  const addItemsCallBack = (name, slug, desc, logo) => {
    const item = {
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_NAME]: name.replace("/", "_"),
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]: slug,
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_DESCRIPTION]: desc,
      [DEPLOYMENT_VARIABLES_NAME.APPLICATION_LOGO]: logo,
    };
    imagesArrayForDeployment.push(item);
    setImagesArrayForDeployment(imagesArrayForDeployment);
    setApplicationsTabsCallBack &&
      setApplicationsTabsCallBack(imagesArrayForDeployment);
    setApplicationsCallBack &&
      setApplicationsCallBack(imagesArrayForDeployment);
  };

  const removeItemsCallBack = (removeSlug) => {
    imagesArrayForDeployment.splice(
      imagesArrayForDeployment.findIndex(
        (dockerImage) =>
          dockerImage[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG] ===
          removeSlug,
      ),
      1,
    );
    setImagesArrayForDeployment(imagesArrayForDeployment);
    setApplicationsTabsCallBack &&
      setApplicationsTabsCallBack(imagesArrayForDeployment);
    setApplicationsCallBack &&
      setApplicationsCallBack(imagesArrayForDeployment);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      return handleSubmit();
    }
  };

  const [showPassword, PasswordInputAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  const validationErrors = () => {
    const errors = {
      userName: isEmpty(formData.userName)
        ? t("Username is required")
        : undefined,
      userPassword: isEmpty(formData.userPassword)
        ? t("Password is required")
        : undefined,
    };

    setFormErrors(errors);

    return Object.values(errors).some((value) => Boolean(value));
  };

  const handleSubmit = async () => {
    if (!validationErrors()) {
      setLoadingPrivateOrgs(true);
      const [error, response] = await getOrganizationList({
        username: formData.userName,
        password: formData.userPassword,
        token,
      });
      setLoadingPrivateOrgs(false);
      if (error) {
        setFormErrors({
          ...formErrors,
          signIn: error.getMessage(t("Unable to get Organisation")),
        });
      } else {
        setFormErrors({
          ...formErrors,
          signIn: "",
        });
        setOrganizationList(response);
      }
    }
  };

  return (
    <Box
      className={classes.tabPanel}
      data-testid={"private-dockerhub-component"}
    >
      <Box className={classes.boxWidthPadding}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className={classes.privateCredentialsBox}
        >
          <Typography id="PRIVATE_DOCKER_HUB_USERNAME" variant="subtitle1">
            {t("Username")}
          </Typography>
          <InputField
            required
            id="PRIVATE_DOCKERHUB_USERNAME_INPUT"
            disabled={loadingPrivateOrgs}
            error={formErrors.userName}
            value={formData.userName || ""}
            onChange={({ target: { value: userName } }) => {
              setFormData({ ...formData, userName });
              setFormErrors({
                ...formErrors,
                userName: isEmpty(userName)
                  ? t("Username is required")
                  : undefined,
              });
            }}
            onKeyDown={handleKeyDown}
            FormHelperTextProps={{
              error: true,
              className: classnames(
                classes.formError,
                commonClasses.commonTextItalic,
              ),
            }}
          />
          <Typography id="PRIVATE_DOCKER_HUB_PASSWORD" variant="subtitle1">
            {t("Password")}
          </Typography>
          <InputField
            required
            id="PRIVATE_DOCKERHUB_PASSWORD_INPUT"
            disabled={loadingPrivateOrgs}
            autoComplete="on"
            error={formErrors.userPassword}
            value={formData.userPassword || ""}
            onChange={({ target: { value: userPassword } }) => {
              setFormData({
                ...formData,
                userPassword,
              });
              setFormErrors({
                ...formErrors,
                userPassword: isEmpty(userPassword)
                  ? t("Password is required")
                  : undefined,
              });
            }}
            onKeyDown={handleKeyDown}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: <PasswordInputAdornment />,
            }}
            FormHelperTextProps={{
              error: true,
              className: classnames(
                classes.formError,
                commonClasses.commonTextItalic,
              ),
            }}
          />
          <Button
            id="PRIVATE_DOCKERHUB_SEARCH_BUTTON"
            variant="contained"
            color="primary"
            disabled={
              isEmpty(formData.userName) || isEmpty(formData.userPassword)
            }
            className={classes.button}
            onClick={handleSubmit}
          >
            {t("Search")}
          </Button>
        </Box>
      </Box>
      {formErrors.signIn && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          className={classes.privateCredentialsBox}
        >
          <Typography
            align="left"
            color="error"
            variant="caption"
            className={classnames(
              classes.formError,
              commonClasses.commonTextItalic,
            )}
          >
            {formErrors.signIn}
          </Typography>
        </Box>
      )}

      <Box className={classes.boxWidthPadding}>
        {loadingPrivateOrgs ? (
          <Grid container alignItems="center" justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          organizationList?.count > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              className={classes.privateCredentialsBox}
            >
              <Typography
                id="PRIVATE_DOCKER_HUB_ORGANIZATION"
                variant="subtitle2"
              >
                {t("Select Organization")}
              </Typography>
              <RadioGroup value={privateOrgValue}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className={classes.privateCredentialsBox}
                >
                  {organizationList?.results?.map((item, index) => {
                    return (
                      <FormControlLabel
                        value={item.orgname}
                        label={item.orgname}
                        control={<Radio color="primary" size="small" />}
                        icon={<StatusBadgeIcon status={`${item.orgname}`} />}
                        onChange={(e) => {
                          setPrivateOrgValue(e.target.value);
                        }}
                        className={classes.envRadio}
                        key={item.id}
                        id={`PRIVATE_DOCKERHUB_ORG_RADIO_${index}`}
                      />
                    );
                  })}
                </Box>
              </RadioGroup>
            </Box>
          )
        )}
      </Box>

      {privateOrgValue && (
        <ApplicationSearchAndFilter
          onSearchChangeCallBack={handleSearchStringChange}
          totalImagesCount={dockerImagesList ? dockerImagesList.count : 0}
          rowsPerPage={rowsPerPage}
          currentPage={page}
          hideFirstAndLast={true}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onRowsPerPageChange}
          searchBarText={t("Search Private Dockerhub...")}
          showFilter={false}
        />
      )}
      <Box className={classes.boxWidthPadding}>
        {loading ? (
          <Grid container alignItems="center" justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          dockerImagesList?.results?.map((data, index) => {
            return (
              <PrivateDockerImages
                key={index}
                input={data}
                index={index}
                addItemsCallBack={addItemsCallBack}
                removeItemsCallBack={removeItemsCallBack}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default PrivateDockerHub;
