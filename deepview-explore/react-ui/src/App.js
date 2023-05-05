import "./App.css";
import "./styles.css";

import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";

import ProjectInfo from "./components/ProjectInfo";
import Habitat from "./sections/Habitat";
import DeploymentTab from "./sections/DeploymentTab";
import WelcomeScreen from "./sections/WelcomeScreen";
import PerfBarContainer from "./sections/PerfBarContainer";

import { computePercentage, getTraceByLevel } from "./utils/utils";
import { profiling_data } from "./data/mock_data";
import EnergyConsumption from "./sections/EnergyConsumption";
import Iterations from "./sections/Iterations";
import MemThroughputContainer from "./sections/MemThroughputContainer";
import Recommendations from "./sections/Recommendations";

// https://stackoverflow.com/questions/54135313/webview-extension-in-typescript
/**
 * Returns the vscode API handle. the acquireVsCodeApi function would not be available when compiling
 * the react project, so we need to dynamically look it up. This function also caches the handle and
 * returns it if previously acquired.
 * @returns The VSCode API handle
 */
function acquireApi() {
  // if (typeof this.acquireApi.api == 'undefined') {
  if (typeof acquireApi.api === "undefined") {
    if (typeof acquireVsCodeApi === "function") {
      let f = window["acquireVsCodeApi"];
      let a = f();
      acquireApi.api = a;
    } else {
      acquireApi.api = null;
    }
  }

  return acquireApi.api;
}

function restartProfiling() {
  console.log("restartProfiling");
  let vscode = App.vscodeApi;
  vscode.postMessage({
    command: "restart_profiling_clicked",
  });
}

let sendMock = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

function App() {
  const [analysisState, setAnalysisState] = useState();
  const [textChanged, setTextChanged] = useState(false);
  const [timeBreakDown, setTimeBreakdown] = useState([]);
  // eslint-disable-next-line
  const [vscodeApi, setVscodeApi] = useState(acquireApi());
  const [errorText, setErrorText] = useState();
  const [connectionStatus, setConnectionStatus] = useState(false);

  App.vscodeApi = vscodeApi;

  const resetApp = function () {
    setErrorText("");
    setAnalysisState(undefined);
  };

  const connect = function () {
    resetApp();
    let vscode = App.vscodeApi;
    if (vscode) {
      vscode.postMessage({
        command: "connect",
      });
    }
  };

  const processAnalysisState = function (state) {
    setAnalysisState(state);
    if (state.breakdown) {
      let operation_tree = state.breakdown.operation_tree;
      let { coarse, fine } = getTraceByLevel(operation_tree);
      setTimeBreakdown({
        coarse: computePercentage(
          coarse,
          state.breakdown.iteration_run_time_ms
        ),
        fine: computePercentage(fine, state.breakdown.iteration_run_time_ms),
      });
    }
  };

  useEffect(function () {
    window.addEventListener("message", (event) => {
      if (event.data["message_type"] === "connection") {
        setConnectionStatus(event.data["status"]);
      } else if (event.data["message_type"] === "analysis") {
        if (
          event.data.habitat.predictions &&
          (event.data.habitat.predictions.length === 0 ||
            (event.data.habitat.predictions[0][0] === "unavailable" &&
              event.data.habitat.predictions[0][1] === -1.0))
        ) {
          event.data.habitat.predictions =
            profiling_data.habitat["predictions"];
          event.data.habitat.predictions.push(["demo", 1]);
        }
        console.log(event.data);
        processAnalysisState(event.data);
      } else if (event.data["message_type"] === "text_change") {
        setTextChanged(true);
      } else if (event.data["message_type"] === "error") {
        setErrorText(event.data["error_text"]);
      }
    });

    if (sendMock) {
      setTimeout(() => {
        const mockResponse = profiling_data;
        processAnalysisState(mockResponse);
      }, 1000);
    }

    return () => {
      window.removeEventListener("message", () => {}); //remove event listener before re-render to avoid memory leaks
    };
  }, []);

  if (!connectionStatus && !sendMock) {
    return (
      <>
        <Alert variant="danger">
          <Alert.Heading>Connection Error</Alert.Heading>
          <p>
            Connection has been lost to the profiler. Please reconnect the
            profiler and double check your ports then click connect
          </p>
          <Button onClick={connect}>Reconnect</Button>
        </Alert>
      </>
    );
  }
  if (errorText) {
    return (
      <>
        <Alert variant="danger">
          <Alert.Heading>Analysis Error</Alert.Heading>
          <p>
            An error has occurred during analysis. This could be a problem with
            Deepview profiler or possibly your code. For more information, refer
            to the detailed message below:
          </p>
          <hr />
          <p className="mb-0">
            <code>{errorText}</code>
          </p>
          <hr />
          <Button onClick={restartProfiling}>Restart Profiling</Button>
        </Alert>
      </>
    );
  } else if (
    analysisState &&
    analysisState["throughput"] &&
    Object.keys(analysisState["throughput"]).length > 0
  ) {
    return (
      <>
        <Container fluid>
          <Card>
            <Card.Header>Project Information</Card.Header>
            <Card.Body>
              <ProjectInfo
                projectRoot={analysisState["project_root"]}
                entryPoint={analysisState["project_entry_point"]}
              />
              {textChanged && (
                <Alert key="info" variant="info">
                  Change is detected in the project.{" "}
                  <Button size="sm" onClick={restartProfiling}>
                    Restart Profiling
                  </Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
          <Iterations />
          {/* <Recommendations analysisState={analysisState} SENDMOCK={sendMock} /> */}
          <br></br>
          <Tabs defaultActiveKey="profiling" className="mb-3">
            <Tab eventKey="profiling" title="Profiling">
              <div className="innpv-contents-columns">
                <div className="innpv-perfbar-contents">
                  <PerfBarContainer
                    labels={
                      timeBreakDown.coarse
                        ? timeBreakDown.coarse.map((elem) => {
                            return {
                              label:
                                elem["percentage"] > 10 ? elem["name"] : "",
                              percentage: elem["percentage"],
                              clickable: false,
                            };
                          })
                        : []
                    }
                    renderPerfBars={timeBreakDown.fine}
                  />
                </div>
                <div className="innpv-contents-subrows">
                  <MemThroughputContainer
                    analysisState={analysisState}
                    SENDMOCK={sendMock}
                  />
                  <Habitat habitatData={analysisState["habitat"]} />
                  <EnergyConsumption energyData={analysisState["energy"]} />
                </div>
              </div>
            </Tab>
            <Tab eventKey="deploy" title="Deployment">
              <DeploymentTab
                habitatData={analysisState["habitat"]}
                cloudProviderURLs={analysisState["additionalProviders"]}
              />
            </Tab>
          </Tabs>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <WelcomeScreen
          analysisState={analysisState}
          vscodeApi={vscodeApi}
        ></WelcomeScreen>
      </>
    );
  }
}

export default App;
