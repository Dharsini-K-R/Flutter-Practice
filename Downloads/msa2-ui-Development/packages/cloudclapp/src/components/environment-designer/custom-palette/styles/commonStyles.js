import { makeStyles } from "@material-ui/core";

const commonStyles = ({ palette }) => ({
  node: {
    padding: 3,
  },
  upperCase: {
    textTransform: "uppercase",
  },
  resourceButton: {
    width: "100%",
    padding: 10,
    "& .MuiButton-label": {
      display: "flex",
      justifyContent: "flex-start",
    },
  },
  resourceIcon: {
    fontSize: 24,
    color: "#384052",
  },
  resourceTitle: {
    margin: "0px 15px",
  },
});

export const useCommonStyles = makeStyles(commonStyles);
