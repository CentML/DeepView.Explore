import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import { Table } from "antd";
import { Progress } from "antd";
import styled from "styled-components";
import Subheader from "../components/Subheader";
import { useSelector } from "react-redux";

const columns = [
  {
    title: "Layer Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Device Utilization (forward)",
    dataIndex: "forward",
    key: "forward",
    width: "20%",
  },
  {
    title: "Device Utilization (backward)",
    dataIndex: "backward",
    key: "backward",
    width: "20%",
  },
];

const deviceUtilizationColorThreshold = (utilization) => {
  if (utilization <= 30) {
    return "red";
  } else if (utilization > 30 && utilization < 80) {
    return "#F1C40F";
  }
  return "green";
};

const formatUtilizationData = (node, parent, total, threshold) => {
  let forward_gpu_utilization = Math.round(
    (node.gpuForward / Math.max(node.cpuForwardSpan, node.gpuForwardSpan)) *
      100,
    2
  );
  let backward_gpu_utilization = Math.round(
    (node.gpuBackward / Math.max(node.cpuBackwardSpan, node.gpuBackwardSpan)) *
      100,
    2
  );
  let nodeSumForwardBackwardSpans =
    node.cpuForwardSpan +
    node.gpuForwardSpan +
    node.cpuBackwardSpan +
    node.gpuBackwardSpan;
  let parentProportion = Math.round(
    (nodeSumForwardBackwardSpans / parent) * 100,
    2
  );
  let totalProportion = Math.round(
    (nodeSumForwardBackwardSpans / total) * 100,
    2
  );

  // division by 0 generate NaN we need to check for those
  forward_gpu_utilization = isNaN(forward_gpu_utilization)
    ? 0
    : forward_gpu_utilization;
  backward_gpu_utilization = isNaN(backward_gpu_utilization)
    ? 0
    : backward_gpu_utilization;
  parentProportion = isNaN(parentProportion) ? 0 : parentProportion;
  totalProportion = isNaN(totalProportion) ? 0 : totalProportion;

  const node_formatted = {
    key: node.sliceId,
    name: (
      <>
        <b style={{ fontSize: "1.1rem" }}>{node.name}</b>{" "}
        <span
          style={{ color: "#404040" }}
        >{`${parentProportion}% of parent, ${totalProportion}% of total`}</span>
      </>
    ),
    forward: (
      <>
        <Progress
          percent={forward_gpu_utilization}
          size="small"
          strokeColor={deviceUtilizationColorThreshold(forward_gpu_utilization)}
        />
      </>
    ),
    backward: (
      <>
        <Progress
          percent={backward_gpu_utilization}
          size="small"
          strokeColor={deviceUtilizationColorThreshold(
            backward_gpu_utilization
          )}
        />
      </>
    ),
  };
  if (node.children.length > 0) {
    const arrChildren = node.children
      .map((ch) =>
        formatUtilizationData(
          ch,
          nodeSumForwardBackwardSpans,
          total,
          threshold
        )
      )
      .filter((ch) => ch !== null);

    if (arrChildren.length > 0) node_formatted["children"] = arrChildren;
  }
  return totalProportion > threshold ? node_formatted : null;
};

const getUtilizationData = (rootNode, filterPerc) => {
  if (rootNode) {
    const sumForwardBackwardSpans =
      rootNode.cpuForwardSpan +
      rootNode.gpuForwardSpan +
      rootNode.cpuBackwardSpan +
      rootNode.gpuBackwardSpan;

    const data = [
      formatUtilizationData(
        rootNode,
        sumForwardBackwardSpans,
        sumForwardBackwardSpans,
        filterPerc
      ),
    ];
    return data;
  }
  return null;
};

const ModelStructure = () => {
  const [filterButton, setFilterButton] = useState(false);
  const [layerData, setLayerData] = useState(null);
  const { analysisState } = useSelector(
    (state) => state.analysisStateSliceReducer
  );
  const utilization = analysisState["utilization"];
  const rootNode = utilization["rootNode"];
  const tensor_core_usage = utilization["tensor_core_usage"];

  useEffect(() => {
    setLayerData(getUtilizationData(rootNode, -1));
  }, [rootNode]);

  if (utilization["error"]) {
    return <>There was an error obtaining the model structure</>;
  }

  const filterLayers = () => {
    const threshold = !filterButton ? 1 : -1;
    setLayerData(getUtilizationData(rootNode, threshold));
    setFilterButton(!filterButton);
  };

  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">Model Structure</Subheader>
          <div className="innpv-subpanel-content">
            {Object.keys(utilization).length === 0 ? (
              <Container fluid>
                <Row className="justify-content-md-center">
                  <Card>
                    <Card.Body>
                      <Spinner animation="border" size="sm" /> Loading Model
                      Structure
                    </Card.Body>
                  </Card>
                </Row>
              </Container>
            ) : (
              <Container fluid>
                <div className="tensor-core-utilization">
                  <h6 className="tensor-core-title">{tensor_core_usage < 5 ? `We recommend using tensor cores`:`Tensor Core Utilization: ${parseFloat(
                    tensor_core_usage
                  ).toFixed(2)}%`}</h6>
                  <Button onClick={filterLayers} variant="outline-primary">{`${
                    filterButton
                      ? "Show all operations"
                      : "Hide insignificant operations"
                  }`}</Button>
                </div>

                <Table
                  dataSource={layerData}
                  columns={columns}
                  pagination={false}
                />
              </Container>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  .tensor-core-title {
    margin-top: auto;
    margin-bottom: auto;
  }
  .tensor-core-utilization {
    margin-top: 0.9rem;
    margin-bottom: 0.9rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export default ModelStructure;
