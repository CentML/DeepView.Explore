import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styled from "styled-components";
import BarSlider from "../components/BarSlider";
import Subheader from "../components/Subheader";
import NumericDisplay from "../components/NumericDisplay";
import { profiling_data } from "../data/mock_data";
/**
 * Returns information required to draw memory and throughput information
 * @param {*} analysisState
 * @param {*} bs
 * @returns an object containing {memory, maxMemory, thoughput, maxThroughput}
 */
function updateSliders(
  analysisState,
  memoryPerc,
  throughputPerc,
  setSliderMemory,
  setSliderThroughput,
  bs
) {
  let memoryModel = analysisState["throughput"]["peak_usage_bytes"];
  let throughputModel = analysisState["throughput"]["run_time_ms"];

  let maxBatch = Math.floor(
    (0.65 * analysisState["breakdown"]["memory_capacity_bytes"] -
      memoryModel[1]) /
      memoryModel[0]
  );
  console.log("MAX BATCH SIZE", maxBatch);

  let maxMemory = analysisState["breakdown"]["memory_capacity_bytes"];
  let maxThroughput =
    (maxBatch * 1000.0) / (maxBatch * throughputModel[0] + throughputModel[1]);

  if (!bs) {
    if (memoryPerc && throughputPerc) {
      console.log("memory and throughput perc cannot both be not null");
      return;
    } else if (memoryPerc) {
      bs = Math.floor((memoryPerc * maxBatch) / 100.0);
    } else if (throughputPerc) {
      let tp = (throughputPerc * maxThroughput) / 100.0;
      bs =
        Math.floor(tp * throughputModel[1]) /
        (1000.0 - tp * throughputModel[0]);
    } else {
      console.log("memory and throughput perc cannot both be null");
      return;
    }

    bs = Math.max(1, Math.min(bs, maxBatch));
  }
  let memory = bs * memoryModel[0] + memoryModel[1];
  let throughput =
    (bs * 1000.0) / (bs * throughputModel[0] + throughputModel[1]);

  setSliderMemory([
    (100.0 * memory) / maxMemory,
    memory / 1e6,
    maxMemory / 1e6,
  ]);
  setSliderThroughput([
    (100.0 * throughput) / maxThroughput,
    throughput,
    Math.max(maxThroughput, throughput),
  ]);

  return bs;
}

const MemThroughputContainer = ({ analysisState, SENDMOCK }) => {
  const [sliderMemory, setSliderMemory] = useState([50, 69, 420]);
  const [sliderThroughput, setSliderThroughput] = useState([50, 69, 420]);
  const [curBatchSize, setCurBatchSize] = useState(0);

  const setInitialLoad = () => {
    if (SENDMOCK) {
      updateSliders(
        profiling_data,
        0.5,
        null,
        setSliderMemory,
        setSliderThroughput
      );
    } else {
      updateSliders(
        analysisState,
        null,
        null,
        setSliderMemory,
        setSliderThroughput,
        analysisState["breakdown"]["batch_size"]
      );
    }
  };

  const onMemoryResize = function (change) {
    let newHeight = sliderMemory[0] * (1 + change / 100);
    newHeight = Math.min(100, Math.max(0, newHeight));

    let bs = updateSliders(
      analysisState,
      newHeight,
      null,
      setSliderMemory,
      setSliderThroughput,
      null
    );
    setCurBatchSize(bs);
  };

  const onThroughputResize = function (change) {
    var newHeight = sliderThroughput[0] * (1 + change / 100);
    newHeight = Math.min(100, Math.max(0, newHeight));

    let bs = updateSliders(
      analysisState,
      null,
      newHeight,
      setSliderMemory,
      setSliderThroughput,
      null
    );
    setCurBatchSize(bs);
  };

  useEffect(() => {
    setInitialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper>
        <Container fluid>
          <Row>
            <Col sm={4}>
              {curBatchSize !== 0 && (
                <>
                  <Alert variant="secondary" style={{ marginBottom: 0 }}>
                    Using predicted batch size <b>{Math.round(curBatchSize)}</b>
                  </Alert>
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="innpv-memory innpv-subpanel">
                <Subheader icon="database">
                  <div className="gpu-details">
                    <span className="memory-title">Peak Memory Usage</span>
                    <div>
                      <Badge bg="success">Local</Badge>
                      <Badge bg="secondary">
                        {analysisState["hardware_info"]["gpus"][0]}
                      </Badge>
                    </div>
                  </div>
                </Subheader>

                <div className="innpv-subpanel-content">
                  <BarSlider
                    percentage={sliderMemory[0]}
                    limitPercentage="100"
                    handleResize={onMemoryResize}
                    style={{ height: "100%" }}
                  />

                  <div className="innpv-subpanel-sidecontent">
                    <NumericDisplay
                      top="Peak Usage"
                      number={sliderMemory[1]}
                      bottom="Megabytes"
                    />
                    <div className="innpv-separator" />
                    <NumericDisplay
                      top="Maximum Capacity"
                      number={sliderMemory[2]}
                      bottom="Megabytes"
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="innpv-memory innpv-subpanel">
                <Subheader icon="database">Throughput</Subheader>
                <div className="innpv-subpanel-content">
                  <BarSlider
                    percentage={sliderThroughput[0]}
                    limitPercentage="100"
                    handleResize={onThroughputResize}
                    style={{ height: "100%" }}
                  />

                  <div className="innpv-subpanel-sidecontent">
                    <NumericDisplay
                      top="Throughput"
                      number={sliderThroughput[1]}
                      bottom="samples/second"
                    />
                    <div className="innpv-separator" />
                    <NumericDisplay
                      top="Predicted Maximum"
                      number={sliderThroughput[2]}
                      bottom="samples/second"
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  .gpu-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1000px) {
      line-height: 0.5;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .memory-title {
    @media (max-width: 1000px) {
      margin-top: 0.25rem;
      margin-bottom: 0.4rem;
    }
  }
`;

export default MemThroughputContainer;
