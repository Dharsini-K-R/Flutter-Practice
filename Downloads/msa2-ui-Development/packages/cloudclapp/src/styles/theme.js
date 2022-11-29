import "typeface-rubik";
import { createTheme as createMuiTheme } from "@material-ui/core";

const createTheme = (darkMode = false) =>
  createMuiTheme({
    darkMode,
    direction: "ltr",
    toolbar: {
      height: 64,
    },
    colors: {
      black: "#000000",
      white: "#FFFFFF",
      darkAccent: "#327BF6",
      grey: "#BCBCCE",
      blueLight: "#80a2d9",
      blueLight2: "#dee4f2",
    },
    palette: {
      primary: {
        main: "#327BF6",
      },
      secondary: {
        main: "#384052",
      },
      common: {
        green: "#26bd6f",
        black: "#000",
      },
      bpm: {
        path: darkMode ? "#46daff" : "#000",
        background: darkMode ? "#000" : "#f3f5f9",
      },
      error: {
        main: "#F44336",
      },
      background: {
        default: "#F7F7F7",
        paper: "#FFFFFF",
        dialogHeader: "#B2BCCE33",
        icon: "#939EB133",
        appBar: "#46587E",
        selection: "#EBF2FE",
        black: "#000000",
        userGrey: "#bdbdbd",
        subTextGrey: "#6C7987",
        cardGrey: "#e5e8ea",
        checkGreen: "#5DBA84",
        boxShadow: "rgba(0, 0, 0, 0.1)",
        applicationCardGrey: "#ECEFF1",
      },
      border: {
        main: "#B2BCCE",
        error: "#F44336",
        greyLight1: "#bfc9d9",
      },
      text: {
        primary: "#384052",
        secondary: "#616B83",
        error: "#F44336",
        support: "#939EB1",
        paper: "#FFFFFF",
      },
    },
    typography: {
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
      h5: {
        color: "#384052",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: 18,
      },
      subtitle2: {
        color: "#616B83",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
      },
      body1: {
        color: "#445D6E",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: 14,
      },
      body2: {
        color: "#81939F",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
      },
      body3: {
        color: "#27343B",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
      },
    },
    overrides: {
      MuiButton: {
        root: {
          height: "40px",
          lineHeight: 2,
          color: "#327BF6",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        textPrimary: {
          color: "#327BF6",
        },
        label: {
          textTransform: "capitalize",
        },
      },
      MuiOutlinedInput: {
        root: {
          "& fieldset": {
            borderColor: "#B2BCCE",
          },
          "&:hover fieldset": {
            borderColor: "#B2BCCE",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#327BF6",
          },
        },
      },
      MuiInputLabel: {
        root: {
          color: "#616B83",
          "&.Mui-focused": {
            color: "#327BF6",
          },
          "&.Mui-error": {
            color: "#F44336",
          },
        },
      },
      MuiLink: {
        root: {
          color: "#327BF6",
          cursor: "pointer",
        },
      },
      MuiIconButton: {
        root: {
          color: "#384052",
        },
      },
      MuiCheckbox: {
        root: {
          color: "#B2BCCE",
        },
      },
      MuiChip: {
        root: {
          backgroundColor: "#B2BCCE",
          borderRadius: 10,
          color: "#FFF",
        },
      },
      MuiTabs: {
        root: {
          minHeight: 40,
        },
        scroller: {
          borderBottom: "1px solid #B2BCCE",
        },
        indicator: {
          backgroundColor: "#327BF6",
        },
      },
      MuiTab: {
        root: {
          "@media (min-width: 600px)": {
            minWidth: 70,
          },
          textTransform: "none",
        },
        wrapper: {
          flexDirection: "row",
          fontSize: 14,
          height: 34,
        },
        labelIcon: {
          minHeight: 40,
          "& $wrapper > *:first-child": {
            marginBottom: 2,
          },
        },
        textColorInherit: {
          "&$selected": {
            color: "#327BF6",
          },
        },
      },
      MuiTooltip: {
        tooltip: {
          fontWeight: 400,
          fontSize: 13,
        },
      },
    },
  });

export default createTheme;
