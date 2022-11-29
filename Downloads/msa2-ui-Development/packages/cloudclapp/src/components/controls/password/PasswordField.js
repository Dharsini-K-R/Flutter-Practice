import React from "react";

import { EyeIcon, EyeSlashIcon } from "react-line-awesome";

import useTogglePassword from "msa2-ui/src/hooks/useTogglePassword";

import InputField from "cloudclapp/src/components/controls/InputField";

const PasswordField = (props) => {
  const [showPassword, PasswordAdornment] = useTogglePassword({
    onIcon: EyeIcon,
    offIcon: EyeSlashIcon,
    iconSize: 20,
  });

  return (
    <InputField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: <PasswordAdornment />,
      }}
    />
  );
};

export default PasswordField;
