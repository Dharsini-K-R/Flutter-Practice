import React, { useState, useCallback } from "react";
import Dialog from "cloudclapp/src/components/dialog/Dialog";

const useDialog = (DialogComponent = Dialog) => {
  const [show, setShow] = useState(false);
  const [params, setParams] = useState({});

  const dialog = useCallback(
    ({ onExec, onClose, shouldHideOnExec = true, ...props } = {}) =>
      show ? (
        <DialogComponent
          onClose={() => {
            onClose && onClose();
            setShow(false);
          }}
          onExec={
            onExec &&
            (() => {
              onExec();
              shouldHideOnExec && setShow(false);
            })
          }
          {...params}
          {...props}
        />
      ) : null,
    [show, params],
  );

  return [
    (shouldShow = true, params = {}) => {
      setShow(shouldShow);
      setParams(params);
    },
    dialog,
    params,
  ];
};

export default useDialog;
