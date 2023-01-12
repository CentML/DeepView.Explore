import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";

import Subheader from "../Subheader";
import { environmental_data } from "../data/mock_data";
import PieChart from "../components/PieChart";

const EnergyConsumption = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { cpu_energy, gpu_energy } = environmental_data;
  const total = cpu_energy + gpu_energy;
  const cpu_perc = ((cpu_energy / total) * 100).toFixed(2);
  const gpu_perc = ((gpu_energy / total) * 100).toFixed(2);

  const barchart_data = [
    {
      angle: cpu_energy / total,
      label: `CPU & DRAM Consumption: ${cpu_energy}J`,
      subLabel: `${cpu_perc}%`,
      color: "#aed6f1",
    },
    {
      angle: gpu_energy / total,
      label: `GPU Consumption: ${gpu_energy}J`,
      subLabel: `${gpu_perc}%`,
      color: " #f5b041",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <>
      <div className="innpv-memory innpv-subpanel">
        <Subheader icon="database">Energy and Environmental Impact</Subheader>
        <div className="innpv-subpanel-content">
          {isLoading ? (
            <Container fluid>
              <Row className="justify-content-md-center">
                <Card>
                  <Card.Body>
                    <Spinner animation="border" size="sm" /> Loading Energy and
                    Environmental data
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          ) : (
            <Container fluid>
              <Row>
                <Col>
                  <div>
                    <p>
                      Total Consumption:
                      <strong>{cpu_energy + gpu_energy}J</strong>
                    </p>
                  </div>
                  <div>
                    <h4>Breakdown:</h4>
                    <PieChart
                      data={barchart_data}
                      height={225}
                      labelMultiplier={2.5}
                      fontSize={14}
                      showLabel={true}
                    />
                  </div>
                </Col>
                <Col>Bar Chart</Col>
              </Row>
            </Container>
          )}
        </div>
      </div>
    </>
  );
};

export default EnergyConsumption;
