import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

import { useTranslation } from "react-i18next";

const ReturnToLoginButton = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClick = () => {
    history.push("/");
  };

  return (
    <Button
      id="RETURN_TO_LOGIN_BUTTON"
      variant="contained"
      color="primary"
      type="submit"
      onClick={onClick}
      {...props}
    >
      {t("Return to Login")}
    </Button>
  );
};

export default ReturnToLoginButton;
