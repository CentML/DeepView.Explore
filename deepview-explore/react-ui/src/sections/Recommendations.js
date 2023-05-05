import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { profiling_data } from "../data/mock_data";

const Recommendations = ({ analysisState, SENDMOCK }) => {
  const [recommendations, setRecommendations] = useState({
    numRecommendations: 0,
    batchSizeRecommendation: null,
  });
  const batchRecommendation = (analysisData) => {
    const currBatchSize = analysisData["breakdown"]["batch_size"];
    const memoryModel = analysisData["throughput"]["peak_usage_bytes"];
    const throughputModel = analysisData["throughput"]["run_time_ms"];

    const maxBatch = Math.floor(
      (0.65*analysisData["breakdown"]["memory_capacity_bytes"] - memoryModel[1]) /
        memoryModel[0]
    );

    if (currBatchSize < maxBatch) {
      const maxMemory = Math.floor(
        (maxBatch * memoryModel[0] + memoryModel[1]) / 1e6
      );
      const maxThroughput = Math.floor(
        (maxBatch * 1000.0) /
          (maxBatch * throughputModel[0] + throughputModel[1])
      );
      setRecommendations((prevState) => ({
        ...prevState,
        numRecommendations: prevState.numRecommendations + 1,
        batchSizeRecommendation: { maxBatch, maxMemory, maxThroughput },
      }));
    }
  };

  useEffect(() => {
    if (SENDMOCK) {
      batchRecommendation(profiling_data);
    } else {
      batchRecommendation(analysisState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {recommendations.numRecommendations === 0 ? (
        <Wrapper>
          <div className="innpv-memory innpv-subpanel">
            <div className="innpv-subpanel-content">
              <h5>There are no current recommendations for your model</h5>
            </div>
          </div>
        </Wrapper>
      ) : (
        <Wrapper>
          <div className="innpv-memory innpv-subpanel">
            <div className="innpv-subpanel-content">
              <Container fluid className="mt-2">
                <Row>
                  <Col xl={12}>
                    <h5>Recommendations</h5>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {recommendations.batchSizeRecommendation && (
                      <div>
                        <p>{`The possible max batch size is ${recommendations.batchSizeRecommendation.maxBatch}. 
                    Which will achieved a memory consumption of ${recommendations.batchSizeRecommendation.maxMemory} MB 
                    and throughput of ${recommendations.batchSizeRecommendation.maxThroughput} samples/second`}</p>
                      </div>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.main``;

export default Recommendations;
