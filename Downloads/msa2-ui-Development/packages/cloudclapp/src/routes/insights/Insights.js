import React from "react";
import { Route, Switch } from "react-router-dom";
import InsightDetail from "cloudclapp/src/routes/insights/InsightDetail";

const ROOT_PATH = "/insights";
const Insights = () => {
  return (
    <Switch>
      <Route path={`${ROOT_PATH}`}>
        <InsightDetail />
      </Route>
    </Switch>
  );
};

export default Insights;
