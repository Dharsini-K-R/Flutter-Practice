import React from "react";
import {
  Grid,
  Typography,
  makeStyles,
  FormControlLabel,
  Box,
  Radio,
} from "@material-ui/core";
import {
  ImageIcon,
  //  CheckCircleOIcon
} from "react-line-awesome";
import { useTranslation } from "react-i18next";
import { formatDateOrString } from "msa2-ui/src/utils/date";

const useStyles = makeStyles(({ palette, typography }) => ({
  text: {
    boxSizing: "border-box",
    textAlign: "left",
  },
  virtualImageName: {
    fontWeight: "500",
    color: typography.body1.color,
    textAlign: "left",
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  virtualMachineMeta: {
    color: palette.text.support,
    lineHeight: "normal",
    paddingBottom: "1%",
  },
  //   vmImageType: {
  //     boxSizing: "border-box",
  //     borderRadius: "40px",
  //     color: palette.common.white,
  //     textAlign: "left",
  //     lineHeight: "normal",
  //     fontSize: "x-small",
  //     paddingTop: "4px",
  //     paddingBottom: "4px",
  //     paddingLeft: "4px",
  //     paddingRight: "4px",
  //   },
  //   imageTypeOfficial: {
  //     backgroundColor: "#2e8964",
  //   },
  //   imageTypeVerified: {
  //     backgroundColor: "#023E8A",
  //   },
  icon: {
    fontSize: "50px",
    boxSizing: "border-box",
    color: palette.background.appBar,
    paddingLeft: "3%",
    paddingBottom: "1%",
  },
  virtualMachineDescriptionText: {
    paddingTop: "1%",
    color: typography.body1.color,
    lineHeight: "16px",
    paddingBottom: "1%",
  },
  boxBorder: {
    border: "1px solid #B2BCCE",
    width: "95%",
    boxSizing: "border-box",
    borderRadius: "4px",
    backgroundColor: "rgba(68,93,110,0.1)",
  },
  //   spanImageText: {
  //     marginLeft: "3px",
  //     marginRight: "3px",
  //   },
  boxPadding: {
    paddingTop: "1%",
    paddingBottom: "1%",
    paddingLeft: "1%",
  },
  vmImageLogoPadding: {
    paddingLeft: "10%",
  },
  virtualImageSpacing: {
    paddingTop: "1%",
  },
}));

const VirtualMachineImage = ({ input, index }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box>
      <Box
        className={classes.virtualImageSpacing}
        data-testid="applications-vmImage-component"
      />

      <Box className={`${classes.boxBorder} ${classes.boxPadding}`}>
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
          direction="row"
        >
          <Grid item xs={1}>
            <Box className={classes.vmImageLogoPadding}>
              {input.logo_url ? (
                <img
                  alt="VM Logo"
                  width="50px"
                  height="50px"
                  src={input.logo_url?.small || input.logo_url?.large}
                />
              ) : (
                <ImageIcon className={classes.icon} />
              )}
            </Box>
          </Grid>

          <Grid item xs={10}>
            <Grid container direction="column">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Box>
                  <Typography
                    id={`virtualMachineImage_name_${index}`}
                    className={`${classes.text} ${classes.virtualImageName}`}
                  >
                    {" "}
                    {input.name}{" "}
                  </Typography>
                </Box>
                {/* <Box p={1}>
                  {input.filter_type === "official" && (
                    <CheckCircleOIcon
                      className={`${classes.vmImageType} ${classes.imageTypeOfficial}`}
                    >
                      <span className={classes.spanImageText}>
                        {t("Official Image")}
                      </span>
                    </CheckCircleOIcon>
                  )}
                  {input.filter_type === "verified_publisher" && (
                    <CheckCircleOIcon
                      className={`${classes.vmImageType} ${classes.imageTypeVerified}`}
                    >
                      <span className={classes.spanImageText}>
                        {t("Verified Publisher")}
                      </span>
                    </CheckCircleOIcon>
                  )}
                </Box> */}
              </Box>
              <Typography
                id={`virtualMachineImage_last_updated_${index}`}
                className={`${classes.text} ${classes.virtualMachineMeta}`}
              >
                {" "}
                {t("By")}
                {": "}
                {input.imageOwnerAlias} | {t("Last Updated")}
                {": "}
                {formatDateOrString(
                  input.creationDate,
                  "dd MMM yyyy HH:mm:ss",
                )}{" "}
              </Typography>
              <Typography
                id={`virtualMachineImage_description_${index}`}
                className={`${classes.text} ${classes.virtualMachineDescriptionText}`}
              >
                {" "}
                {input.description}{" "}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={1}>
            <FormControlLabel value={input.imageId} control={<Radio />} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default VirtualMachineImage;
