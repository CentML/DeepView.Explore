import React from "react";
import { Container, Row, Col, Spinner, Card, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeAmericas,
  faCar,
  faHome,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Subheader from "../Subheader";
import PieGraph from "../components/PieGraph";
import StackedBarGraph from "../components/StackedBarGraph";
import { energy_data, unitScale } from "../utils";

const EnergyConsumption = ({ energyData, numIterations }) => {
  const cpu_color = "#5499c7";
  const cpu_color_opacity = "rgba(84,153,199,0.55)";
  const gpu_color = "#17a589";
  const gpu_color_opacity = "rgba(23,165,137,0.55)";

  let total = null;
  let curr_cpu_dram = null;
  let curr_gpu = null;
  let piegraph_data = null;
  let bargraph_data = [];
  let conversions = null;
  const { current, past_measurements } = energyData;

  if (current && current.components && current.total_consumption) {
    curr_cpu_dram = current.components.find(
      (item) => item.type === "ENERGY_CPU_DRAM"
    );
    curr_gpu = current.components.find((item) => item.type === "ENERGY_GPU");
    total = unitScale(current.total_consumption * numIterations, "energy");
    const scaling_factor = 10 ** (total.scale_index * 3);
    conversions = energy_data(current.total_consumption * numIterations);
    if (curr_cpu_dram && curr_gpu) {
      const cpu_scale = parseFloat(
        Number(
          (curr_cpu_dram.consumption * numIterations) / scaling_factor
        ).toFixed(2)
      );
      const gpu_scale = parseFloat(
        Number((curr_gpu.consumption * numIterations) / scaling_factor).toFixed(
          2
        )
      );
      piegraph_data = [
        {
          name: `CPU & DRAM Consumption (${total.scale})`,
          value: cpu_scale,
          fill: "#b77032",
        },
        {
          name: `GPU Consumption (${total.scale})`,
          value: gpu_scale,
          fill: "#215d6e",
        },
      ];
      // add current experiment
      bargraph_data = [
        {
          name: "current",
          total: current.total_consumption * numIterations,
          cpu: curr_cpu_dram.consumption * numIterations,
          gpu: curr_gpu.consumption * numIterations,
          cpu_color,
          cpu_color_opacity,
          gpu_color,
          gpu_color_opacity,
        },
      ];
    }
  }

  if (past_measurements && past_measurements.length > 0) {
    let idx = 0;
    const arr_past_mesurements = past_measurements.flatMap((item) => {
      if (item.total_consumption && item.components) {
        const cpu_dram = item.components.find(
          (prev_item) => prev_item.type === "ENERGY_CPU_DRAM"
        );
        const gpu = item.components.find(
          (prev_item) => prev_item.type === "ENERGY_GPU"
        );
        if (cpu_dram && gpu) {
          return {
            name: `exp${(idx += 1)}`,
            total: item.total_consumption * numIterations,
            cpu: cpu_dram.consumption * numIterations,
            gpu: gpu.consumption * numIterations,
            cpu_color,
            cpu_color_opacity,
            gpu_color,
            gpu_color_opacity,
          };
        }
      }
      return [];
    });
    bargraph_data = bargraph_data.concat(arr_past_mesurements);
  }

  if (bargraph_data.length > 0) {
    bargraph_data.sort((a, b) => a.total - b.total);
    const max_element = bargraph_data.slice(-1);
    const max_scaling = unitScale(max_element[0].total, "energy");
    const bargraph_scaling_factor = 10 ** (max_scaling.scale_index * 3);
    bargraph_data = bargraph_data.map((measurement) => {
      return {
        ...measurement,
        total: parseFloat(
          Number(measurement.total / bargraph_scaling_factor).toFixed(2)
        ),
        cpu: parseFloat(
          Number(measurement.cpu / bargraph_scaling_factor).toFixed(2)
        ),
        gpu: parseFloat(
          Number(measurement.gpu / bargraph_scaling_factor).toFixed(2)
        ),
      };
    });
  }

  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">Energy and Environmental Impact</Subheader>
          {(piegraph_data || bargraph_data.length > 0)&&<h6>
            Estimation for <Badge bg="secondary">{numIterations}</Badge> total
            iterations
          </h6>}
          <div className="innpv-subpanel-content">
            {Object.keys(energyData).length === 0 ? (
              <Container fluid>
                <Row className="justify-content-md-center">
                  <Card>
                    <Card.Body>
                      <Spinner animation="border" size="sm" /> Loading Energy
                      and Environmental data
                    </Card.Body>
                  </Card>
                </Row>
              </Container>
            ) : (
              <Container fluid>
                <Row>
                  {piegraph_data ? (
                    <Col xxl={6}>
                      <div>
                        <h5>
                          Total Consumption:
                          <strong> {`${total.val} ${total.scale}`} </strong>
                        </h5>
                      </div>
                      <div>
                        <h6>Breakdown:</h6>
                        <PieGraph data={piegraph_data} height={320} />
                      </div>
                      <div>
                        <h6>Equivalent to: </h6>
                      </div>
                      <Row>
                        <Col sm={3} className="center">
                          <div>
                            <FontAwesomeIcon
                              icon={faGlobeAmericas}
                              size="4x"
                              color="#27ae60"
                            />{" "}
                          </div>
                          <p>
                            <strong>{conversions?.carbon}</strong> of C02
                            emissions released
                          </p>
                        </Col>
                        <Col sm={3} className="center">
                          <div>
                            <FontAwesomeIcon
                              icon={faCar}
                              size="4x"
                              color="#3498db"
                            />{" "}
                          </div>
                          <p>
                            <strong>{conversions?.miles}</strong> miles driven
                          </p>
                        </Col>
                        <Col sm={3} className="center">
                          <div>
                            <FontAwesomeIcon
                              icon={faMobileAlt}
                              size="4x"
                              color="#ec7063"
                            />{" "}
                          </div>
                          <p>
                            <strong>{conversions?.phone}</strong> of smartphones
                            charged
                          </p>
                        </Col>
                        <Col sm={3} className="center">
                          <div>
                            <FontAwesomeIcon
                              icon={faHome}
                              size="4x"
                              color="#34495e"
                            />{" "}
                          </div>
                          <p>
                            <strong>{conversions?.household} x</strong> homes'
                            energy use for one year
                          </p>
                        </Col>
                        <small>
                          ref:
                          https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
                        </small>
                      </Row>
                    </Col>
                  ) : (
                    <Col xxl={6}>
                      <div>
                        <h5>Could not load the data</h5>
                      </div>
                    </Col>
                  )}
                  {bargraph_data.length > 0 ? (
                    <Col xxl={6}>
                      <div>
                        <h5>Relative to your other experiments</h5>
                      </div>
                      <div className="bargraph-container">
                        <StackedBarGraph
                          data={bargraph_data}
                          height={500}
                          xlabel={"Experiments"}
                          ylabel={`Energy Consumption Joules (${total?.scale})`}
                          bar1_color={cpu_color}
                          bar2_color={gpu_color}
                        />
                      </div>
                    </Col>
                  ) : (
                    <Col xxl={6}>
                      <div>
                        <h5>Could not load the data</h5>
                      </div>
                    </Col>
                  )}
                </Row>
              </Container>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  h5 {
    margin-top: 1rem;
    text-align: center;
  }

  h6 {
    text-align: center;
    margin-top: 0.25rem;
  }

  .list-item {
    border: none;
  }

  .center {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0.25rem;
    text-align: center;
    p {
      margin-top: 0.5rem;
    }
  }

  .bargraph-container {
    margin-top: 1rem;
  }
`;

export default EnergyConsumption;
