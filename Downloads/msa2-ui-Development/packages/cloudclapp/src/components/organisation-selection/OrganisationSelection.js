import React, { useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useToggle from "react-use/lib/useToggle";

import { makeStyles, Button, Popover } from "@material-ui/core";
import SelectSearch from "cloudclapp/src/components/select-search/SelectSearch";
import {ExchangeAltIcon} from "react-line-awesome";

const useStyles = makeStyles((theme) => {
  const { palette, breakpoints, typography } = theme;
  return {
    topNav: {
      display: "flex",
      [breakpoints.down("md")]: {
        margin: 10,
        order: 2,
      },
    },
    breadcrumbContainer: {
      display: "flex",
    },
    title: {
      fontSize: "1rem",
      letterSpacing: 0.5,
      lineHeight: "1.8rem",
      maxWidth: 200,
    },
    btnRoot: {
      height: "auto",
      marginRight: "-25px",
      background: "transparent",
      borderRadius: 4,
      fontSize: "0.875rem",
      fontWeight: typography.fontWeightMedium,
      lineHeight: 1,
      letterSpacing: 0.3,
      border: 0,
      "& .MuiButton-label": {
        textTransform: "none",
      },
    },
    paper: {
      overflowY: "inherit",
      overflowX: "inherit",
      backgroundColor: "transparent",
    },
    popoverContainer: {
      position: "relative",
      top: 7,
      width: 300,
      flexGrow: 1,
      boxShadow:
        "0 6px 16px 4px rgba(81, 97, 133, 0.13), 0 3px 8px 0 rgba(0, 0, 0, 0.15)",
      border: "1px solid" + palette.border.greyLight1,
      borderRadius: "5px 5px 0 0",
      backgroundColor: palette.background.paper,
      "&:after, &:before": {
        bottom: "100%",
        left: "50%",
        border: "solid transparent",
        content: '" "',
        height: 0,
        width: 0,
        position: "absolute",
        pointerEvents: "none",
      },
      "&:after": {
        borderColor: "rgba(255, 255, 255, 0)",
        borderBottomColor: "#fff",
        borderWidth: 6,
        marginLeft: -6,
      },
      "&:before": {
        borderColor: "rgba(191, 201, 217, 0)",
        borderBottomColor: palette.border.greyLight1,
        borderWidth: 7,
        marginLeft: -7,
      },
      OrgSelectIcon:{
        background: "#46587E",
      },
    },
  };
});

const OrganisationSelection = ({
  tenants,
  multiOrg,
  onSelectOrganisation,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const organisationButton = useRef(null);
  const [organisationIsOpen, toggleOrganisation] = useToggle(false);

  const dismissPopovers = useCallback(() => {
    toggleOrganisation(false);
  }, [toggleOrganisation]);

  return (
    <nav className={classes.topNav}>
      {/* Organisation Selection */}
      <div className={classes.breadcrumbContainer}>
        {multiOrg ? (
          <Button
            id="cclaOrganisationBtn"
            aria-haspopup="true"
            variant="outlined"
            aria-label="organisation"
            size="small"
            disableRipple
            onClick={toggleOrganisation}
            classes={{
              root: classes.btnRoot,
              label: classes.btnLabel,
            }}
            className={organisationIsOpen ? classes.btnOpen : classes.btnClosed}
            ref={organisationButton}
          >
            <ExchangeAltIcon className={classes.OrgSelectIcon}/>
            <Popover
              id="cclaorganisationselection"
              open={organisationIsOpen}
              anchorEl={organisationButton.current}
              onClose={dismissPopovers}
              BackdropComponent={() => <></>}
              classes={{
                paper: classes.paper,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div
                id="cclaOrganisationSelectSearchDiv"
                className={classes.popoverContainer}
              >
                <SelectSearch
                  id="cclaorganisation"
                  options={tenants}
                  noOptionText={t("Organisation not found.")}
                  isOrgSelection={true}
                  onSelect={onSelectOrganisation}
                  isClearable={false}
                />
              </div>
            </Popover>
          </Button>
        ) : (
          null
        )}
      </div>
    </nav>
  );
};

OrganisationSelection.propTypes = {
  tenants: PropTypes.array.isRequired,
  multiOrg: PropTypes.bool.isRequired,
  onSelectOrganisation: PropTypes.func.isRequired,
};

export default OrganisationSelection;
