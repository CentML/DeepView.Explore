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

import { useSelector, useDispatch } from "react-redux";
import { updateDeepviewState } from "./redux/slices/analysisStateSlice";

let sendMock = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

function App() {
  const { vscodeApi } = useSelector((state) => state.vsCodeSliceReducer);
  const { analysisState } = useSelector(
    (state) => state.analysisStateSliceReducer
  );
  const dispatch = useDispatch();
  const [textChanged, setTextChanged] = useState(false);
  const [timeBreakDown, setTimeBreakdown] = useState([]);
  // eslint-disable-next-line
  const [errorText, setErrorText] = useState();
  const [connectionStatus, setConnectionStatus] = useState(false);

  function restartProfiling() {
    console.log("restartProfiling");
    setTextChanged(false);
    setErrorText("");
    vscodeApi.postMessage({
      command: "restart_profiling_clicked",
    });
  }

  const resetApp = function () {
    setErrorText("");
    dispatch(updateDeepviewState(null));
  };

  const connect = function () {
    resetApp();
    if (vscodeApi) {
      vscodeApi.postMessage({
        command: "connect",
      });
    }
  };

  const processAnalysisState = function (state) {
    dispatch(updateDeepviewState(state));
    if (state.breakdown && state.breakdown.operation_tree) {
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

    // Connection request when UI renders for the 1rst time
    if (vscodeApi) {
      vscodeApi.postMessage({
        command: "connect",
      });
    }

    return () => {
      window.removeEventListener("message", () => {}); //remove event listener before re-render to avoid memory leaks
    };
    // eslint-disable-next-line
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
              <ProjectInfo />
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
                  <MemThroughputContainer SENDMOCK={sendMock} />
                  <Habitat />
                  <EnergyConsumption />
                </div>
              </div>
            </Tab>
            <Tab eventKey="deploy" title="Deployment">
              <DeploymentTab />
            </Tab>
          </Tabs>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <WelcomeScreen />
      </>
    );
  }
}

export default App;
