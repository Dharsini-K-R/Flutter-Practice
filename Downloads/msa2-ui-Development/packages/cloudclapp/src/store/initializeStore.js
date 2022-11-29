import { configureStore } from "@reduxjs/toolkit";
import throttle from "lodash/throttle";

import { loadStateFromStorage, saveStateToStorage } from "./storage";
import initialState from "./initialState";
import FrameMessenger from "cloudclapp/src/services/FrameMessanger";

import auth, { logout } from "./auth";
import settings from "./settings";
import designations from "./designations";

import innerBus from "cloudclapp/src/utils/InnerBus";

const reducer = {
  auth,
  settings,
  designations,
};

export default async () => {
  const preloadedState = (await loadStateFromStorage()) ?? initialState;

  const store = configureStore({
    reducer,
    preloadedState,
  });

  FrameMessenger.listen((event) => {
    if (event.type === "logout") {
      store.dispatch(logout({}));
    }
  });

  innerBus.on(innerBus.evt.LOGOUT, () => {
    // We need to logout from other tabs.
    // NB! FrameMessenger doesn't send message to the tab-initiator so we dispatch logout one more time.
    FrameMessenger.send({ type: "logout" });
    store.dispatch(logout({}));
  });

  store.subscribe(
    throttle(() => {
      const theState = store.getState();
      saveStateToStorage(theState);
    }, 1000),
  );

  return store;
};
