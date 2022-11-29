import { useSelector } from "react-redux";
import useApiCall from "msa2-ui/src/utils/useApi";
import { getToken } from "cloudclapp/src/store/auth";

const useApi = (
  apiCall,
  params = {},
  wait = false,
  autoRefreshInterval = 0,
) => {
  const token = useSelector(getToken);
  return useApiCall({ apiCall, params, wait, autoRefreshInterval, token });
};

export default useApi;
