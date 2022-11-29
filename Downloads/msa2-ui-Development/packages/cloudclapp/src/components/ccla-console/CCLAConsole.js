import React from "react";

import MSAConsole from "msa2-ui/src/components/msa-console";

import VariableField from "cloudclapp/src/components/variables/VariableField";

import InputField from "cloudclapp/src/components/controls/InputField";
import SelectField from "cloudclapp/src/components/controls/basic-select";
import PasswordField from "cloudclapp/src/components/controls/password/PasswordField";

const CCLAConsole = (props) => {
  return (
    <MSAConsole
      components={{
        TextField: InputField,
        Select: SelectField,
        Password: PasswordField,
        MSAVariable: VariableField,
      }}
      {...props}
    />
  );
};

export default CCLAConsole;
