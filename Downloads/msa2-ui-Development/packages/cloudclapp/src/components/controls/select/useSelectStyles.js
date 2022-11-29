import { useTheme } from "@material-ui/core";

export const useSelectStyles = (isError, disabled, width) => {
  const { colors, palette } = useTheme();

  return {
    control: (styles) => ({
      ...styles,
      backgroundColor: palette.background.paper,
      borderColor: isError
        ? palette.error.main
        : disabled
          ? "rgba(255, 255, 255, 0.3)"
          : colors.grey,
      ...(isError ? { boxShadow: "none" } : {}),
      width,
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: disabled ? "rgba(255, 255, 255, 0.3)" : palette.secondary.main,
    }),
    group: (styles) => ({
      ...styles,
      backgroundColor: palette.background.paper,
      paddingBottom: 0,
    }),
    groupHeading: () => ({
      color: palette.text.secondary,
      textTransform: "initial",
      paddingLeft: "15px",
      textAlign: "left",
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: disabled ? "rgba(255, 255, 255, 0.3)" : colors.grey,
    }),
    input: (styles) => ({
      ...styles,
      fontSize: "1rem",
      color: palette.text.primary,
      margin: 0,
    }),
    menu: (styles) => ({
      ...styles,
      zIndex: 100,
    }),
    menuList: (styles) => ({
      ...styles,
      boxShadow: "0 6px 16px 4px rgba(81, 97, 133, 0.13), 0 3px 8px 0 rgba(0, 0, 0, 0.15)",
      padding: 0,
    }),
    menuPortal: (styles) => ({
      ...styles,
      zIndex: 1500,
    }),
    noOptionsMessage: (styles) => ({
      ...styles,
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
      fontSize: "1rem",
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused
        ? palette.background.default
        : palette.background.paper,
      fontSize: "1rem",
      textAlign: "left",
      color: palette.text.primary,
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: palette.primary.main,
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: palette.text.primary,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: palette.text.primary,
      ":hover": {
        backgroundColor: palette.secondary.main,
      },
    }),
    placeholder: (styles) => ({
      ...styles,
      fontSize: "1rem",
      color: palette.text.secondary,
    }),
    singleValue: (styles) => ({
      ...styles,
      fontSize: "1rem",
      color: disabled ? palette.text.disabled : palette.text.primary,
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: "6px 8px",
    }),
  };
};
