import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import store from "./redux/store/store";
import { Provider } from "react-redux";

Bugsnag.start({
  apiKey: "98f9219663e35fb3b4487b709a00290d",
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React);

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
