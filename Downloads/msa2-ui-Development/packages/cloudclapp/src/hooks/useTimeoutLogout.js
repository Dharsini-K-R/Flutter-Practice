import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "cloudclapp/src/store/auth";

// 30 Minutes
const initialTimeout = 1000 * 60 * 30;

const useTimeoutLogout = (isAuth, timeout = initialTimeout) => {
  const timerId = useRef(null);
  const dispatch = useDispatch();

  const logoutCallback = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    if (isAuth) {
      timerId.current = setTimeout(() => {
        dispatch(logout({}));
      }, timeout);
    }
  }, [isAuth, timeout, dispatch]);

  // Initial call once isAuth value get changed
  useEffect(() => {
    logoutCallback();
  }, [logoutCallback, isAuth]);

  // This listener is to logout after 30 minutes if user has not perform/access anthing on app
  useEffect(() => {
    document.addEventListener("click", logoutCallback);
    return () => {
      clearTimeout(timerId.current);
      document.removeEventListener("click", logoutCallback);
    };
  }, [logoutCallback]);
};

export default useTimeoutLogout;
