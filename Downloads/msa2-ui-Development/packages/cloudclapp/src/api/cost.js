import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";
import { get } from "msa2-ui/src/api/request";
import { getServiceInstanceDetails } from "msa2-ui/src/api/workflow";
import lodashGet from "lodash/get";
import maxBy from "lodash/maxBy";

import {
  DEPLOYMENT_VARIABLES_NAME,
  DEPLOYMENT_ESTIMATE_GRANULARITY,
} from "cloudclapp/src/Constants";
import { priceTable } from "./mocks";

const API = process.env.REACT_APP_API_PATH;

// https://10.31.1.52/swagger/#/CCLAP%20cloud%20vendors%20management/getCloudUsageAndCost
export const getVendorCost = ({
  orgId,
  granularity,
  startDate,
  endDate,
  token,
}) => {
  return get({
    url: `${API}/ccla/cloud/usageAndCost/${orgId}`,
    token,
    queryParams: {
      granularity,
      startDate,
      endDate,
    },
  });
};

// https://10.31.1.52/swagger/#/CCLAP%20cloud%20vendors%20management/getVendorUsageAndCost
export const getCostByID = ({
  orgId,
  granularity,
  startDate,
  endDate,
  token,
  tags,
  connectionName,
}) => {
  return get({
    url: `${API}/ccla/cloud/usageCost/${orgId}/tags`,
    token,
    queryParams: {
      granularity,
      startDate,
      endDate,
      tags,
      connectionName,
    },
  });
};

// temporary function to get tags from front-end
export const getTags = ({ serviceIds, token }) => {
  return Promise.all(
    serviceIds.map((serviceId) =>
      getServiceInstanceDetails({
        token,
        serviceId,
      }),
    ),
  ).then((responses) => {
    const firstResponse = responses[0];
    const ret = responses.reduce((acc, [, response]) => {
      const tags = response?.variables?.tags;
      return tags?.length ? [...acc, ...tags] : acc;
    }, []);
    return [firstResponse[0], uniqWith(ret, isEqual), firstResponse[2]];
  });
};

export const getEstimation = ({
  cloudVendor,
  cloudService,
  environmentContext,
  applications = [],
  granularity,
  amount = 1,
  token,
}) => {
  const tableByService = priceTable?.[cloudVendor]?.[cloudService];
  const selectedGranularity = DEPLOYMENT_ESTIMATE_GRANULARITY[granularity];
  if (!tableByService) {
    return () => [{ message: "Estimation is not available for this service." }];
  }

  const priceTableMatchedEnv = tableByService.filter(({ parameters }) => {
    return Object.entries(parameters.environment).every(
      ([key, value]) =>
        lodashGet(environmentContext, key) === value || value === "*",
    );
  });
  const pricePerEnv = priceTableMatchedEnv.find(
    ({ parameters }) => !parameters.application,
  );

  const calculatePrice = (priceInfo) => {
    if (priceInfo?.price === undefined) {
      return "N/A";
    }
    const basePrice = priceInfo.price * selectedGranularity.hour * amount;
    if (priceInfo.discount) {
      const possibleDiscounts = priceInfo.discount.filter((entry) => {
        const currentGranularity =
          DEPLOYMENT_ESTIMATE_GRANULARITY[entry.granularity];
        if (selectedGranularity === currentGranularity) {
          return currentGranularity.amount <= amount;
        }
        return currentGranularity.hour >= selectedGranularity.hour;
      });

      const discountInfo = maxBy(
        possibleDiscounts,
        ({ granularity, amount }) => {
          const currentGranularity =
            DEPLOYMENT_ESTIMATE_GRANULARITY[granularity];
          return currentGranularity.hour * amount;
        },
      );
      if (discountInfo?.rate) {
        return basePrice * discountInfo.rate;
      }
    }
    return basePrice;
  };

  const pricePerApps = applications.reduce((acc, application) => {
    const pricePerApp = priceTableMatchedEnv
      .filter(({ parameters: { application } }) => Boolean(application))
      .find(({ parameters }) => {
        return Object.entries(parameters.application).every(
          ([key, value]) =>
            lodashGet(application, key) === value || value === "*",
        );
      });

    return {
      ...acc,
      [application[DEPLOYMENT_VARIABLES_NAME.APPLICATION_SLUG]]: calculatePrice(
        pricePerApp,
      ),
    };
  }, {});

  const response = {
    environment: calculatePrice(pricePerEnv),
    applications: pricePerApps,
  };

  return () => [null, response];
};
