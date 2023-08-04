import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../context";

const AppMonitor = ({ children, time }) => {

  const { setCandidates, loggedIn, setLoggedIn } = useContext(
    MainContext
  ) as any;

  const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
  ];

  let timer;

  // this function sets the timer that logs out the user after 10 secs
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logoutAction();
    }, time); // 10000ms = 10secs. You can change the time.
  };

  // this resets the timer if it exists.
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  const logoutAction = () => {
    sessionStorage.clear()
    setLoggedIn(false)
    // window.location.pathname = "/"
    window.location.reload();
  };

  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  return children;
};

export default AppMonitor;
