import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { useSelector } from "react-redux";
import createTheme from "./styles/theme";
import { getAppTheme } from "cloudclapp/src/store/settings";

const AppThemeProvider = ({ children }) => {
  const appTheme = useSelector(getAppTheme);
  return (
    <ThemeProvider theme={createTheme(appTheme)}>{children}</ThemeProvider>
  );
};

export default AppThemeProvider;