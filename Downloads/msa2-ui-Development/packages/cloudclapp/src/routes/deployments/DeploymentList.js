import React from "react";
import { makeStyles } from "@material-ui/core";
import DeploymentTitle from "./DeploymentTitle";
import DeploymentDetails from "./DeploymentDetails";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";
import { buildRoute } from "msa2-ui/src/utils/urls";
import { isEmpty } from "lodash";

const useStyles = makeStyles(() => {
  return {
    deploymentCard: {
      padding: "20px 0",
      width: "100%",
    },
    noContentWrapper: {
      padding: "10px",
      width: "100%",
      borderBottom: "1px solid #e0e2e7",
      display: "flex",
      justifyContent: "center",
      fontSize: "15px",
    },
  };
});
const DeploymentList = ({ environments, searchText }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const searchResults = environments.filter((environment) => {
    if (searchText === "") {
      return environment;
    }
    const deploymentResults = environment.deployments?.filter((deployment) => {
      return deployment.deploymentName.toLowerCase().includes(searchText);
    });
    return (
      environment.envName.toLowerCase().includes(searchText) ||
      (deploymentResults && deploymentResults.length > 0)
    );
  });
  const { url } = useRouteMatch();
  const history = useHistory();
  const handleChange = (index) => {
    history.push(buildRoute(url, index));
  };
  return (
    <>
      {searchResults.map((environment) => (
        <Grid
          container
          className={classes.deploymentCard}
          key={environment.envId}
        >
          <DeploymentTitle
            key={environment.envId}
            id={environment.envId}
            title={environment.envName}
            status={environment.status}
            environment={environment}
          />
          {isEmpty(environment.deployments) ? (
            <Typography
              id="DEPLOYMENTS_NO_DEPLOYMENT"
              className={`${classes.noContentWrapper}`}
            >
              {t("No deployments found")}
            </Typography>
          ) : (
            environment.deployments?.map((deployment) => (
              <DeploymentDetails
                key={deployment.deploymentId}
                deploymentDetails={deployment}
                environment={environment}
                isExpandable={true}
                onClickCallBack={handleChange}
              />
            ))
          )}
        </Grid>
      ))}
    </>
  );
};

export default DeploymentList;
