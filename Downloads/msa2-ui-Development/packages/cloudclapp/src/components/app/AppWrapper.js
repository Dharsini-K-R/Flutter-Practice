import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  makeStyles,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import useToggle from "react-use/lib/useToggle";
import MainMenuItems from "cloudclapp/src/components/menu/MainMenuItems";
import CloudclappMenuLogo from "cloudclapp/src/assets/CloudclappMenuLogo.png";
import classnames from "classnames";

const useStyles = makeStyles((theme) => {
  const { palette, transitions } = theme;
  return {
    content: {
      background: palette.background.default,
      padding: "18px 24px",
      height: "calc(100% - 36px)",
      overflowY: "auto",
      overflowX: "clip",
    },
    fullHeight: {
      display: "flex",
      height: `calc(100% - 20px)`,
    },
    main: {
      backgroundColor: palette.background.default,
      position: "relative",
      flexGrow: 1,
      marginTop: "10px",
      height: "100%",
      width: "86%",
    },
    primaryMenu: {
      height: "100%",
      overflowY: "auto",
      paddingTop: "10px",
      boxSizing: "border-box",
      borderRight: "1px solid rgba(178, 188, 206, 0.5)",
      background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(${CloudclappMenuLogo})`,
      backgroundPosition: "center 550px",
      backgroundRepeat: "no-repeat",
    },
    menuAnimation: {
      width: 78,   
      transition: transitions.create(["width", "margin"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
      "&:hover": {
        width: 250,
        transition: transitions.create(["width", "margin"], {
          easing: transitions.easing.sharp,
          duration: transitions.duration.enteringScreen,
        }),
      },
    },
    menuPinned:{
      width: 250,
    },
    loader: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
    },
  };
});

const AppWrapper = ({ children }) => {
  const classes = useStyles();
  const ref = useRef(null);
  const location = useLocation();
  const [appLoading, setAppLoading] = useState(false);
  const [menuIsPinned, toggleMenuPinned] = useToggle(false);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <>
      <div className={classes.fullHeight}>
        {appLoading ? (
          <Grid
            container
            className={classes.loader}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <div
              className={classnames(classes.primaryMenu,
                 {[classes.menuAnimation] : !menuIsPinned},
                 {[classes.menuPinned] : menuIsPinned})}
            >
              <MainMenuItems setAppLoading={setAppLoading} menuIsPinned={menuIsPinned} toggleMenuPinned={toggleMenuPinned} />
            </div>
            <main className={classes.main}>
              <div className={classes.content} ref={ref}>
                {children}
              </div>
            </main>
          </>
        )}
      </div>
    </>
  );
};

export default AppWrapper;
