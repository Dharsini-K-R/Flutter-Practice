import { put } from "msa2-ui/src/api/request";

const API = process.env.REACT_APP_API_PATH;

export const updateManager = ({
  token,
  id: managerId,
  manager,
  name,
  email,
  username: login,
  password: pwd,
  firstname,
  address,
  attachedCustomerIds : customerIds,
  attachedOperatorIds: operatorIds,
}) => {
  return put({
    url: `${API}/user/v1/manager/${managerId}`,
    token,
    body: {
      ...manager,
      name,
      address: {
        ...manager.address,
        email,
      },
      login,
      pwd,
      firstname,
      customerIds,
      operatorIds,
    },
  });
};
