import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getToken } from "cloudclapp/src/store/auth";

import { useSnackbar } from "notistack";
import SnackbarAction from "cloudclapp/src/components/snackbar/SnackbarAction";

const usePostApi = (apiCall, params = {}, onSuccess, onError) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const token = useSelector(getToken);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const callback = async () => {
    setIsLoading(true);
    const ret = await apiCall({ token, ...params });
    setResult(ret);
    const [error] = ret;
    if (error) {
      onError && onError();
      enqueueSnackbar(error.getMessage(), {
        variant: "error",
        action: (key) => (
          <SnackbarAction id={key} handleClose={closeSnackbar} />
        ),
        preventDuplicate: true,
      });
    } else {
      onSuccess && onSuccess();
    }
    setIsLoading(false);
  };
  return [callback, isLoading, ...result];
};

export default usePostApi;
