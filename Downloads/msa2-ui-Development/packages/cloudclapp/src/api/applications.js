import { get, post } from "msa2-ui/src/api/request";
import { getMarketPlaceImagesByKeyResponse } from "cloudclapp/src/routes/applications/AWS-AMIs.js";

const API = process.env.REACT_APP_API_PATH;

// https://10.31.1.52/swagger/#/Market%20place%20image%20repository/getImagesByKey
export const getMarketPlaceImagesByKey = ({
  searchKey,
  page,
  pageSize,
  officialImages,
  token,
}) => {
  return get({
    url: `${API}/ccla/marketplace/images`,
    token,
    queryParams: {
      key: searchKey,
      page,
      page_size: pageSize,
      official_images: officialImages,
    },
  });
};

// Dummy API to load data from AMI's.js
export const getVirtualMachineImagesByKey = ({
  searchKey,
  page = 1,
  pageSize = 10,
  officialImages,
  token,
}) => {
  // temporary mock with the actual response
  const filteredResponse = getMarketPlaceImagesByKeyResponse
    .filter(({ name }) =>
      searchKey
        ? name.toLowerCase().search(searchKey.toLowerCase()) !== -1
        : true,
    )
    .filter(({ imageOwnerAlias }) =>
      officialImages ? imageOwnerAlias === "aws-marketplace" : true,
    );
  const paginatedResponse = filteredResponse.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  return () => [null, paginatedResponse, { total: filteredResponse.length }];
};

// https://10.31.1.52/swagger/#/Market%20place%20image%20repository/getImageDetails
export const getMarketPlaceImagesDetails = ({ name, token }) => {
  return get({
    url: `${API}/ccla/marketplace/image`,
    token,
    queryParams: {
      name: name,
    },
  });
};

// https://10.31.1.5/swagger/#/Market%20place%20image%20repository/getOrgList
export const getOrganizationList = ({
  username,
  password,
  token,
}) => {
  return post({
    url: `${API}/ccla/marketplace/private/orgList`,
    body: { username, password },
    token,
  });
};

//https://10.31.1.5/swagger/#/Market%20place%20image%20repository/getPrivateImages
export const getImagesFromPrivateDockerHub = ({
  username,
  password,
  orgName,
  name,
  page,
  pageSize,
  token,
}) => {
  return post({
    url: `${API}/ccla/marketplace/private/images`,
    body: { username, password },
    queryParams: {
      orgName,
      name,
      page,
      pageSize,
    },
    token,
  });
};

