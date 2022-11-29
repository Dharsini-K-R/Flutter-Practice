import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { getToken } from "cloudclapp/src/store/auth";
import { getImageCache } from "cloudclapp/src/store/storage";
import { getCloudVendors } from "cloudclapp/src/store/designations";
import CloudVendor from "cloudclapp/src/services/CloudVendor";

import { makeStyles, CircularProgress, Grid } from "@material-ui/core";

import EnvironmentDesigner from "cloudclapp/src/components/environment-designer/EnvironmentDesigner";

const useStyles = makeStyles(() => ({
  loader: {
    height: "100%",
  },
}));

const DesignTab = ({ environment, reloadEnvironment }) => {
  const classes = useStyles();

  const token = useSelector(getToken);

  const cloudVendors = useSelector(getCloudVendors);

  const [envWFLogoMapping, setEnvWFLogoMapping] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const services = CloudVendor.getFlattenedServices(cloudVendors);
  const logoUrls = services.map(({ logo }) => logo);

  useEffect(() => {
    if (logoUrls.length && !isLoading && !envWFLogoMapping) {
      setIsLoading(true);
      Promise.all(logoUrls.map((path) => getImageCache({ token, path }))).then(
        (responses) => {
          const envWfLogoMapping = responses.reduce(
            (acc, { url }, i) => ({
              ...acc,
              [services[i].workflow.env]: url,
            }),
            {},
          );

          setEnvWFLogoMapping(envWfLogoMapping);
          setIsLoading(false);
        },
      );
    }
  }, [logoUrls, services, token, isLoading, envWFLogoMapping]);

  return isLoading ? (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      className={classes.loader}
    >
      <CircularProgress />
    </Grid>
  ) : (
    <EnvironmentDesigner
      environment={environment}
      envWFLogoMapping={envWFLogoMapping}
      reloadEnvironment={reloadEnvironment}
      envBlueprintPath={environment.envBlueprintPath}
      envBlueprintContent={environment.envBlueprintContent}
    />
  );
};

export default DesignTab;
