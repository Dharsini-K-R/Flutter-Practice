import React from "react";
import { Box } from "@material-ui/core";

import Logo from "cloudclapp/src/assets/logo";

const AppLogo = ({ styles, ...props }) => {
  return (
    <Box alignItems="center" container {...props}>
      <Logo style={styles?.icon} />
    </Box>
  );
};

export default AppLogo;
