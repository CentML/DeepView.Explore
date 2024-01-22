import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { VerticalBarGraph } from "./BarGraph";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Subheader from "./Subheader";

const LINEAR_PARAM_LOOKUP = {
  pcie: {
    2: [0.18758736, 3.56189019],
    4: [0.2444404, 4.44230527],
  },
  nvlink: {
    2: [0.01931869, 0.03306339, 0.1377],
    4: [0.02802226, -0.00409064, 0.26453107],
  },
};

const pcieCommPredictor = (size, ngpu) => {
  const [a, b] = LINEAR_PARAM_LOOKUP["pcie"][ngpu];
  return b + Math.max(0, a * (size - 10));
};

const nvlinkCommPredictor = (size, ngpu) => {
  const [a, b, c] = LINEAR_PARAM_LOOKUP["nvlink"][ngpu];
  return Math.max(c, a * size + b);
};

const calculateBackwardTime = (linkType, bucketSizes, expectedMax, ngpus) => {
  let prev_comp_end = 0;
  let prev_comm_end = 0;
  let pred_comp = 0;
  let pred_comm = 0;
  let comp_end = 0;
  let comm_start = 0;
  let comm_end = 0;

  for (let i = 0; i < expectedMax.length; i++) {
    if (linkType === "pcie")
      pred_comm = pcieCommPredictor(bucketSizes[i], ngpus);
    else if (linkType === "nvlink")
      pred_comm = nvlinkCommPredictor(bucketSizes[i], ngpus);
    
    pred_comp = expectedMax[i];

    comp_end = prev_comp_end + pred_comp;
    comm_start = Math.max(comp_end, prev_comm_end);
    comm_end = comm_start + pred_comm;

    prev_comp_end = comp_end;
    prev_comm_end = comm_end;
  }
  
  return prev_comm_end;
};

const generateDdpGraphData = (ddp, breakdown) => {
  const batch_size = breakdown["batch_size"];
  const currRunTime = breakdown["iteration_run_time_ms"];

  const fwTimeMsec = ddp["fw_time"];
  const pcie2gpus = calculateBackwardTime(
    "pcie",
    ddp["bucket_sizes"],
    ddp["expected_max_2gpus"],
    2
  );
  const pcie4gpus = calculateBackwardTime(
    "pcie",
    ddp["bucket_sizes"],
    ddp["expected_max_4gpus"],
    4
  );
  const nvlink2gpus = calculateBackwardTime(
    "nvlink",
    ddp["bucket_sizes"],
    ddp["expected_max_2gpus"],
    2
  );
  const nvlink4gpus = calculateBackwardTime(
    "nvlink",
    ddp["bucket_sizes"],
    ddp["expected_max_4gpus"],
    4
  );

  return {
    instances: [
      {
        type: "gcp-pcie",
        ngpus: [
          { name: "n1", value: parseFloat((batch_size * 1000) / currRunTime).toFixed(2) },
          {
            name: "n2",
            value: parseFloat((2 * batch_size * 1000) / (fwTimeMsec + pcie2gpus)).toFixed(2),
          },
          {
            name: "n4",
            value: parseFloat((4 * batch_size * 1000) / (fwTimeMsec + pcie4gpus)).toFixed(2),
          },
        ],
      },
      {
        type: "gcp-nvlink",
        ngpus: [
          { name: "n1", value: parseFloat((batch_size * 1000) / currRunTime).toFixed(2) },
          {
            name: "n2",
            value: parseFloat((2 * batch_size * 1000) / (fwTimeMsec + nvlink2gpus)).toFixed(2),
          },
          {
            name: "n4",
            value: parseFloat((4 * batch_size * 1000) / (fwTimeMsec + nvlink4gpus)).toFixed(2),
          },
        ],
      },
    ],
  };
};

const DDP = () => {
  const { analysisState } = useSelector(
    (state) => state.analysisStateSliceReducer
  );
  const { ddpPass } = useSelector((state) => state.passesStateReducer);
  const [graphData, setGraphData] = useState({
    filter: null,
    data: null,
  });

  const ddp = analysisState["ddp"];
  const breakdown = analysisState["breakdown"];

  const findGraphData = (data, category) => {
    const itemInfo = data?.instances.filter(
      (item) => item.type.toLocaleLowerCase() === category
    );
    return itemInfo[0]["ngpus"];
  };

  const handleFilterChange = (category) => {
    const ddpProfilingData = generateDdpGraphData(ddp, breakdown);
    const itemInfo = ddpProfilingData.instances.filter(
      (item) => item.type.toLocaleLowerCase() === category
    );
    setGraphData((prevState) => ({
      ...prevState,
      data: itemInfo[0]["ngpus"],
    }));
  };

  useEffect(() => {
    if (
      ddp["fw_time"] &&
      ddp["bucket_sizes"] &&
      ddp["expected_max_2gpus"] &&
      ddp["expected_max_4gpus"] &&
      breakdown
    ) {
      const ddpProfilingData = generateDdpGraphData(ddp, breakdown);

      let instanceTypes = new Set();

      ddpProfilingData?.instances.forEach((element) => {
        instanceTypes.add(element.type.toLocaleLowerCase());
      });

      const instanceArray = Array.from(instanceTypes);
      setGraphData((prevState) => ({
        ...prevState,
        filter: instanceArray,
        data: findGraphData(ddpProfilingData, instanceArray[0]),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ddp]);

  if (!ddpPass) {
    return (
      <>
        <Container fluid>
          <Row className="justify-content-md-center">
            <h2>DDP Analysis was not included</h2>
          </Row>
        </Container>
      </>
    );
  }

  if (ddpPass && Object.keys(ddp).length === 0) {
    return (
      <>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Card>
              <Card.Body>
                <Spinner animation="border" size="sm" /> Loading DDP analysis
                data
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </>
    );
  }

  if (ddpPass && ddp.error) {
    return (
      <>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">DeepView.DDP</Subheader>
          <div className="innpv-subpanel-content">
            <Container fluid className="mt-2">
              <Row className="justify-content-md-center">
                <h6>There was an error generating DDP analysis</h6>
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {graphData["filter"] && graphData["data"] && (
        <Wrapper>
          <div className="innpv-memory innpv-subpanel">
            <Subheader icon="database">DDP</Subheader>
            <Container fluid>
              <Row className="mt-4 mb-4">
                <Col md={12} className="ddp-css">
                  <VerticalBarGraph
                    data={graphData["data"]}
                    height={500}
                    xlabel={{
                      value: "number of GPUS",
                      position: "insideBottom",
                      offset: -15,
                    }}
                    ylabel={{
                      value: "throughput (samples/s)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    color={"#82ca9d"}
                  />

                  <div>
                    <h6>Filter by link type</h6>
                    <Form.Select
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      {graphData["filter"]?.map((instance, index) => {
                        return (
                          <option key={`${index}`} value={instance}>
                            {instance}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.main`
  .ddp-css {
    display: flex;
  }
`;

export default DDP;
