import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import "typeface-roboto";
import "./index.css";
import "./localisation/i18n";
import "react-line-awesome/src/resources/line-awesome/css/line-awesome.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StylesProvider, createGenerateClassName } from "@material-ui/core";
import initializeStore from "cloudclapp/src/store/initializeStore";
import AppThemeProvider from "cloudclapp/src/AppThemeProvider";
import SnackbarProvider from "cloudclapp/src/SnackbarProvider";

const generateClassName = createGenerateClassName();
const basePath = process.env.PUBLIC_URL;

const HUBSPOT_ID =
  process.env.NODE_ENV === "production" &&
  window.CCLA.keys.b6da07ad !== "%UBIQUBE_HUBSPOT_TRACKING_ID%"
    ? window.CCLA.keys.b6da07ad
    : null;

const AppWithProviders = ({ store }) => {
  useEffect(() => {
    if (HUBSPOT_ID) {
      // Dynamically add HubSpot tracking script if the id is passed
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "hs-script-loader";
      script.async = true;
      script.defer = true;
      script.src = `//js.hs-scripts.com/${HUBSPOT_ID}.js`;

      document.body.appendChild(script);
    }
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <StylesProvider generateClassName={generateClassName}>
          <AppThemeProvider>
            <SnackbarProvider>
              <Router basename={basePath}>
                <App />
              </Router>
            </SnackbarProvider>
          </AppThemeProvider>
        </StylesProvider>
      </Provider>
    </React.StrictMode>
  );
};

initializeStore()
  .then((store) => {
    ReactDOM.render(
      <AppWithProviders store={store} />,
      document.getElementById("root"),
    );
  })
  .catch((error) => {
    console.log(
      "CCLA: An error has occurred while loading the application",
      error,
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
