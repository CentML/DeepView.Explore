import React, { useState, useEffect } from "react";
import Subheader from "../components/Subheader";
import { ProviderScatterGraph } from "../components/ScatterGraph";

import Badge from "react-bootstrap/Badge";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import {
  cloudInstances,
  gpuPropertyList,
  cloudProviders,
} from "../data/providers";
import {
  calculate_training_time,
  numberFormat,
  currencyFormat,
} from "../utils/utils";

const highlightColor = "#9b59b6";
const normalSize = 200;
const highlightSize = 280;

const populate_initial_data = (habitatData) => {
  let filtered_instances = [];
  if (habitatData) {
    for (const instance of cloudInstances) {
      const found_in_habitat = habitatData.find(
        (item) => item[0].toLowerCase() === instance.gpu.toLowerCase()
      );
      const found_in_gpuPropertyList = gpuPropertyList.find(
        (item) =>
          item.name.toLocaleLowerCase() === instance.gpu.toLocaleLowerCase()
      );
      if (found_in_habitat && found_in_gpuPropertyList) {
        filtered_instances.push({
          id: instance.id,
          x: found_in_habitat[1], // msec
          y: (instance.cost / 3.6e6) * found_in_habitat[1], // cost per msec * habitatData = cost per 1 iteration
          info: instance,
          vmem: found_in_gpuPropertyList.vmem,
          fill: cloudProviders[instance.provider].color,
          z: normalSize,
        });
      }
    }
  }
  return filtered_instances;
};

const ProviderPanel = ({ numIterations, habitatData }) => {
  const [providerPanelSettings, setProviderPanelSettings] = useState({
    plotData: populate_initial_data(habitatData),
    nearest: null,
    clicked: null,
    maxNumGpu: 0,
    provider: "all",
    gpu: "all",
    estimated_cost: 0,
    estimated_time: 0,
  });

  const MAX_GPU = [1, 2, 4, 0]; // 0 is all

  const initial_data = populate_initial_data(habitatData);

  let gpuList = new Set();
  if (initial_data) {
    initial_data.forEach((element) => {
      gpuList.add(element.info.gpu.toLocaleLowerCase());
    });
  }

  const handleFilterChange = (category, value) => {
    let numGpuFilter = providerPanelSettings.maxNumGpu;
    let providerFilter = providerPanelSettings.provider;
    let gpuFilter = providerPanelSettings.gpu;

    switch (category) {
      case "provider":
        providerFilter = value;
        break;
      case "gpu":
        gpuFilter = value;
        break;
      default: // we take number of gpus as default case
        numGpuFilter = Number(value);
    }

    const filtered_plot_data = initial_data
      .filter((item) => {
        if (providerFilter !== "all") {
          return (
            item.info.provider.toLocaleLowerCase() ===
            providerFilter.toLocaleLowerCase()
          );
        }
        return true;
      })
      .filter((item) => {
        if (gpuFilter !== "all") {
          return (
            item.info.gpu.toLocaleLowerCase() === gpuFilter.toLocaleLowerCase()
          );
        }
        return true;
      })
      .filter((item) => {
        if (numGpuFilter !== 0) {
          return item.info.ngpus === numGpuFilter;
        }
        return true;
      });

    setProviderPanelSettings((prevState) => ({
      ...prevState,
      maxNumGpu: numGpuFilter,
      provider: providerFilter,
      gpu: gpuFilter,
      plotData: filtered_plot_data,
    }));
  };

  const recalculateCost = (provider) => {
    if (provider == null) return;
    const originalData = initial_data.find((item) => item.id === provider.id);

    let totalHr = calculate_training_time(numIterations, originalData); // NEED YUBO FEEDBACK
    let totalCost = provider.info.cost * totalHr;

    setProviderPanelSettings((prevState) => ({
      ...prevState,
      clicked: provider,
      estimated_cost: totalCost,
      estimated_time: totalHr,
    }));
  };

  const onClickConfig = (value) => {
    setProviderPanelSettings((prevState) => ({
      ...prevState,
      plotData: prevState.plotData.map((item) => {
        if (item.id === value.id) {
          return {
            ...item,
            fill: highlightColor,
            z: highlightSize,
          };
        }
        return {
          ...item,
          fill: cloudProviders[item.info.provider].color,
          z: normalSize,
        };
      }),
    }));
    recalculateCost(value);
  };

  useEffect(() => {
    recalculateCost(providerPanelSettings.clicked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numIterations]);

  return (
    <>
      <div className="innpv-memory innpv-subpanel">
        <Subheader icon="database">Providers</Subheader>
        <Container fluid>
          <Row>
            <Col xl={12} xxl={8}>
              <Row>
                <Row className="mt-4 mb-2">
                  <Col>
                    <div>
                      <h6>Filter by provider</h6>
                      <Form.Select
                        onChange={(e) =>
                          handleFilterChange("provider", e.target.value)
                        }
                      >
                        <option value="all">All</option>
                        {Object.keys(cloudProviders).map((provider, index) => {
                          return (
                            <option key={`${index}`} value={provider}>
                              {provider}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h6>Filter by GPU</h6>
                      <Form.Select
                        onChange={(e) =>
                          handleFilterChange("gpu", e.target.value)
                        }
                      >
                        <option value="all">All</option>
                        {[...gpuList].map((gpu, index) => {
                          return (
                            <option key={`${index}`} value={gpu}>
                              {gpu}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </div>
                  </Col>
                  <Col>
                    <div>
                      <h6>Filter Max Number of GPUs:</h6>
                      <ButtonGroup className="me-2">
                        {MAX_GPU.map((numgpu) => (
                          <ToggleButton
                            key={numgpu}
                            id={`radio-${numgpu}`}
                            type="radio"
                            variant={
                              numgpu === providerPanelSettings.maxNumGpu
                                ? "primary"
                                : "light"
                            }
                            name="radio"
                            size="sm"
                            value={numgpu}
                            checked={numgpu === providerPanelSettings.maxNumGpu}
                            onChange={(e) =>
                              handleFilterChange(
                                "numGpus ",
                                e.currentTarget.value
                              )
                            }
                          >
                            {numgpu === 0 ? "all" : numgpu}
                          </ToggleButton>
                        ))}
                      </ButtonGroup>
                    </div>
                  </Col>
                </Row>
                <Row className="pb-4">
                  <ProviderScatterGraph
                    data={providerPanelSettings.plotData}
                    onClickHandler={onClickConfig}
                    xlabel={"Total Training time (hrs)"}
                    ylabel={"Total Cost (US dollars)"}
                    providers={cloudProviders}
                    numIterations={numIterations}
                  />
                </Row>
              </Row>
            </Col>
            <Col xl={12} xxl={4} className="mb-4">
              <div className="innpv-memory innpv-subpanel">
                <Subheader icon="database">Deployment Plan</Subheader>
                {providerPanelSettings.clicked && (
                  <CardGroup>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <Row>
                            <Col xs={3}>
                              <Image
                                src={
                                  cloudProviders[
                                    providerPanelSettings.clicked.info.provider
                                  ].logo
                                }
                                width="75px"
                              ></Image>
                            </Col>
                            <Col xs={9}>
                              <h1>
                                {providerPanelSettings.clicked.info.instance}
                              </h1>
                              <Badge>
                                {`Estimated Cost: ${currencyFormat(
                                  providerPanelSettings.estimated_cost
                                )}`}
                              </Badge>
                              <p>
                                <Badge bg="success">
                                  {`Estimated Training Time: ${numberFormat(
                                    providerPanelSettings.estimated_time
                                  )} Hours`}
                                </Badge>
                              </p>
                            </Col>
                          </Row>
                        </Card.Title>
                        <Table bordered hover>
                          <thead>
                            <tr>
                              <th>GPU</th>
                              <th>Num. GPU</th>
                              <th>VRAM</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>{providerPanelSettings.clicked.info.gpu}</th>
                              <th>
                                {providerPanelSettings.clicked.info.ngpus}
                              </th>
                              <th>{providerPanelSettings.clicked.vmem} GB</th>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </CardGroup>
                )}
                {providerPanelSettings.clicked == null && (
                  <CardGroup>
                    <Card>
                      <Card.Body>
                        <Card.Title>Select a configuration.</Card.Title>
                      </Card.Body>
                    </Card>
                  </CardGroup>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ProviderPanel;
