import React from "react";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
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

const EnergyConsumption = ({ energyData }) => {
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
    total = unitScale(current.total_consumption, "energy");
    conversions = energy_data(current.total_consumption);
    if (curr_cpu_dram && curr_gpu) {
      const cpu_scale = unitScale(curr_cpu_dram.consumption, "energy");
      const gpu_scale = unitScale(curr_gpu.consumption, "energy");
      piegraph_data = [
        {
          name: `CPU & DRAM Consumption (${cpu_scale.scale})`,
          value: cpu_scale.val, // parseFloat(Number(cpu_dram.consumption / 1000).toFixed(2))
          fill: "#b77032",
        },
        {
          name: `GPU Consumption (${gpu_scale.scale})`,
          value: gpu_scale.val,
          fill: "#215d6e",
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
            name: `exp_${(idx += 1)}`,
            total: parseFloat(Number(item.total_consumption)).toFixed(2),
            cpu: parseFloat(Number(cpu_dram.consumption).toFixed(2)),
            gpu: parseFloat(Number(gpu.consumption).toFixed(2)),
          };
        }
      }
      return [];
    });
    bargraph_data = arr_past_mesurements;
  }

  // add current experiment
  if (piegraph_data) {
    bargraph_data = [
      ...bargraph_data,
      {
        name: "current",
        total: total.val,
        cpu: piegraph_data[0].value,
        gpu: piegraph_data[1].value,
      },
    ];
  }

  if (bargraph_data.length > 0) bargraph_data.sort((a, b) => a.total - b.total);

  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">Energy and Environmental Impact</Subheader>
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
                          ylabel={`Energy Consumption Joules (${total.scale})`}
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
