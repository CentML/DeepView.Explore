import "./App.css";
import "./styles.css";

import React, { useState } from "react";
import { Button, Stack, Tab, Tabs, Container, Row, Col, Spinner } from "react-bootstrap";

import Habitat from "./sections/Habitat";
import DeploymentTab from "./sections/DeploymentTab";
import PerfBarContainer from "./sections/PerfBarContainer";

import ReactTooltip from "react-tooltip";

import { computePercentage, getTraceByLevel } from "./utils/utils";
import { profiling_data as resnet_data } from "./data/resnet_mock_data";
import { profiling_data as transformer_data } from "./data/transformer_mock_data";
import { profiling_data as roberta_data } from "./data/roberta_mock_data";
import { profiling_data as gpt_j_data } from "./data/gpt_j_mock_data";
import EnergyConsumption from "./sections/EnergyConsumption";
import Iterations from "./sections/Iterations";
import MemThroughputContainer from "./sections/MemThroughputContainer";

function App() {
  const [analysisState, setAnalysisState] = useState();
  const [timeBreakDown, setTimeBreakdown] = useState([]);
  const [numIterations, setNumIterations] = useState(100000);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

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
      ReactTooltip.rebuild();
    }
  };

  const waitingTime = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const setData = (model) => {
    switch (model) {
      case "resnet":
        processAnalysisState(resnet_data);
        waitingTime();
        setModel("resnet");
        break;
      case "transformer":
        processAnalysisState(transformer_data);
        waitingTime();
        setModel("transformer");
        break;
      case "roberta":
        processAnalysisState(roberta_data);
        waitingTime();
        setModel("roberta");
        break;
      case "gpt-j":
        processAnalysisState(gpt_j_data);
        waitingTime();
        setModel("gpt-j");
        break;
      default:
        processAnalysisState(null);
        setModel(null);
    }
  };

  return (
    <>
      <Container fluid>
        {!model && (
          <div className="col-md-2 mx-auto text-center mt-4">
            <h4>Please select a model</h4>
          </div>
        )}
        <Row className="m-2">
          <Col className="m-1">
            <Stack gap={3} className="col-md-5 mx-auto">
              <Button
                variant={model === "resnet" ? "primary" : "secondary"}
                onClick={() => setData("resnet")}
              >
                Resnet
              </Button>
              <Button
                variant={model === "transformer" ? "primary" : "secondary"}
                onClick={() => setData("transformer")}
              >
                Transformer
              </Button>
            </Stack>
          </Col>
          <Col className="m-1">
            <Stack gap={3} className="col-md-5 mx-auto">
              <Button
                variant={model === "roberta" ? "primary" : "secondary"}
                onClick={() => setData("roberta")}
              >
                Roberta
              </Button>
              <Button
                variant={model === "gpt-j" ? "primary" : "secondary"}
                onClick={() => setData("gpt-j")}
              >
                GPT-J
              </Button>
            </Stack>
          </Col>
        </Row>
        {loading && (
          <Row className="mt-5">
            <div style={{ display: "flex", flexDirection:'column', justifyContent: "center", alignItems:'center' }}>
            <h6>Loading</h6>
            <Spinner animation="border" variant="primary" style={{width:'5rem', height:'5rem', marginTop:'1.5rem'}}/>
            </div>
          </Row>
        )}
        {model && !loading && (
          <div>
            <Iterations setNumIterations={setNumIterations} />
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
                    <ReactTooltip type="info" effect="float" html={true} />
                  </div>
                  <div className="innpv-contents-subrows">
                    <MemThroughputContainer analysisState={analysisState} />
                    <Habitat habitatData={analysisState["habitat"]} />
                    <EnergyConsumption
                      energyData={analysisState["energy"]}
                      numIterations={numIterations}
                    />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="deploy" title="Deployment">
                <DeploymentTab
                  numIterations={numIterations}
                  habitatData={analysisState["habitat"]}
                />
              </Tab>
            </Tabs>
          </div>
        )}
      </Container>
    </>
  );
}

export default App;
