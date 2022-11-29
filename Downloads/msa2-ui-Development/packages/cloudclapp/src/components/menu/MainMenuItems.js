import React, { useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import useDialog from "cloudclapp/src/hooks/useDialog";

import { useRouteMatch, NavLink, useLocation } from "react-router-dom";
import { fetchEnvironments } from "cloudclapp/src/store/designations";
import { Tooltip } from "@material-ui/core";
import { ReactComponent as CloudClappLogoSVG } from "cloudclapp/src/assets/cloudclapp-logo.svg";
import { ReactComponent as CloudClappTextSVG } from "cloudclapp/src/assets/cloudclapp-text.svg";
import { OrgSelection } from "cloudclapp/src/components/app/AppToolbar";
import UserMenu from "cloudclapp/src/components/menu/UserMenu";
import { getUserDetails } from "cloudclapp/src/store/auth";
import { AngleDownIcon, UserCircleIcon, AngleUpIcon, ThumbtackIcon } from "react-line-awesome";
import classNames from "classnames";

import {
  Badge,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  makeStyles,
} from "@material-ui/core";

import MainMenu from "cloudclapp/src/components/menu/MainMenu";

const useStyles = makeStyles((theme) => {
  const { colors, palette } = theme;
  return {
    cloudclapplogo: {
      paddingLeft: 15,
      borderRadius: "10px 0 0 10px",
    },
    cloudclapptext: {
      borderRadius: "10px 0 0 10px",
      paddingLeft: "22px",
      paddingTop: "5px",
    },
    badge: {
      backgroundColor: ({ backgroundColor }) => backgroundColor,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
    listItemWrapper: {
      marginLeft: 10,
    },
    listItemLink: {
      borderRadius: 5,
      display: "block",
      textDecoration: "none",
      margin: "5px",
    },
    listItemLinkActive: {
      background: palette.background.paper,
    },
    listItemLinkActiveDark: {
      background: palette.background.selection,
    },
    listItemIcon: {
      color: palette.text.primary,
      fontSize: "24px",
      minWidth: 30,
    },
    listItemText: {
      color: palette.text.primary,
      fontSize: "14px",
      fontWeight: "bold",
      paddingLeft: "17px",
      width: "125px",
    },
    listItemButton: {
      borderRadius: 5,
    },
    listItemActionButton: {
      "&:hover": {
        backgroundColor: `${colors.darkAccent}33`,
      },
      "& $listItemIcon": {
        color: colors.darkAccent,
      },
      "& $listItemText": {
        color: colors.darkAccent,
      },
    },
    listItemDisabled: {
      pointerEvents: "none",
    },
    userIcon: {
      fontSize: 25,
      paddingRight: 5,
      paddingLeft: 15,
    }, 
    rotated: {
      transform: "rotate(-45deg)",
    },
    userMenuIcon: {
      paddingLeft: 79,
    },
    userMail: {
      lineHeight: "28px",
      marginRight: 8,
      paddingLeft: 19,
    },
    user: {
      cursor: "pointer",
    },
  };
});

const StatusBadge = ({ backgroundColor, children }) => {
  const classes = useStyles({ backgroundColor });
  if (!backgroundColor) return children;

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      variant="dot"
      classes={{ badge: classes.badge }}
    >
      {children}
    </Badge>
  );
};

const MainMenuItem = ({
  id,
  icon: Icon,
  route,
  label: _label,
  getLabel = () => undefined,
  childItems: _childItems = [],
  getChildItems = () => [],
  transformChildItems = (value) => value,
  isAction = false,
  getDisabled = () => false,
  disabledToolTipMessage,
  depth = 0,
  badgeColor,
  getHidden = () => false,
  setAppLoading,
}) => {
  const classes = useStyles();
  const { pathname: currentPath } = useLocation();
  const { isExact } = useRouteMatch(route) ?? {};

  const label = useSelector(getLabel) ?? _label;
  const disabled = useSelector(getDisabled);
  const dynamicChildItems = transformChildItems(useSelector(getChildItems));
  const childItems = [...dynamicChildItems, ..._childItems];

  const hasChildItems = childItems.length > 0;
  const open = currentPath.includes(route);
  const getActiveClassName = () => {
    if (hasChildItems && !isExact) {
      return classes.listItemLink;
    }
    if (depth === 2) {
      return classes.listItemLinkActiveDark;
    }
    return classes.listItemLinkActive;
  };
  const hide = useSelector(getHidden);
  return (
    <Tooltip
      title={disabled && disabledToolTipMessage ? disabledToolTipMessage : ""}
    >
      <div
        className={classnames(classes.listItemWrapper, classes.listItemButton, {
          [classes.listItemLinkActive]: open && depth > 0,
        })}
      >
        <NavLink
          id={id}
          to={route}
          className={classnames(classes.listItemLink, {
            [classes.listItemDisabled]: disabled,
          })}
          activeClassName={getActiveClassName()}
        >
          {!hide && (
            <ListItem
              button
              className={classnames(classes.listItemButton, {
                [classes.listItemActionButton]: isAction,
              })}
              disabled={disabled}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <StatusBadge backgroundColor={badgeColor}>
                  <Icon />
                </StatusBadge>
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary={label}
              />
              {hasChildItems && depth === 0 ? (
                open ? (
                  <AngleUpIcon />
                ) : (
                  <AngleDownIcon />
                )
              ) : null}
              {
                setAppLoading ?
                  <OrgSelection setAppLoading={setAppLoading} /> : null
              }
            </ListItem>
          )}
        </NavLink>
        {hasChildItems &&
          open &&
          childItems.map((item, i) => (
            <Fragment key={i}>
              <MainMenuItem
                {...item}
                icon={item.icon ?? Icon}
                depth={depth + 1}
              />
            </Fragment>
          ))}
      </div>
    </Tooltip>
  );
};

const MainMenuItems = ({ setAppLoading, menuIsPinned, toggleMenuPinned }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showUserDialog, UserDialog] = useDialog();
  const { name } = useSelector(getUserDetails);

  const routeMatch = useRouteMatch("/environments");

  useEffect(() => {
    dispatch(fetchEnvironments);
  }, [dispatch, routeMatch]);

  return (
    <>
      <List className={classes.sidebar}>
        <li>
          <ListItem button className={classes.sidebarBtn}>
            <ListItemIcon className={classes.listItemIcon}>
              <CloudClappLogoSVG className={classes.cloudclapplogo} />
              <CloudClappTextSVG className={classes.cloudclapptext} />
              {menuIsPinned ?
              <ThumbtackIcon onClick={toggleMenuPinned} className={classNames([classes.userIcon, classes.rotated])}/> :
              <ThumbtackIcon onClick={toggleMenuPinned} className={classes.userIcon}/>}
            </ListItemIcon>
          </ListItem>
        </li>
        {MainMenu.map((item, i) => (
          item.route === "/dashboard" ?
            (
              <li key={i}>
                <MainMenuItem {...item} setAppLoading={setAppLoading} />
              </li>
            ) :
            (
              <li key={i}>
                <MainMenuItem {...item} />
              </li>
            )
        ))}
        <li>
          <ListItem button
            id={"APP_TOOLBAR_USER"}
            onClick={() => showUserDialog(true)}
            className={classes.sidebarBtn}>
            <UserCircleIcon className={classNames([classes.userIcon, classes.user])} />
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary={name}
            />
            <AngleDownIcon className={classes.userMenuIcon} />
          </ListItem>
        </li>
      </List>
      <UserDialog
        title={name || "User Settings"}
        content={<UserMenu />}
        noActions
      />
    </>
  );
};

export default MainMenuItems;
