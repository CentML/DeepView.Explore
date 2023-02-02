import React, { useState, useEffect } from "react";
import Subheader from "./Subheader";
import ScatterGraph from "./components/ScatterGraph";
import {
  Badge,
  ButtonGroup,
  Card,
  CardGroup,
  Container,
  Row,
  ToggleButton,
  Col,
  Image,
  Table,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import { instances, cardMemory } from "./data/providers";

const highlightColor = "#9b59b6";
const normalSize = 200;
const highlightSize = 280;

const providers = {
  google: {
    name: "Google Cloud Platform",
    logo: "resources/google.png",
    color: "#f1c40f",
  },
  azure: {
    name: "Microsoft Azure",
    logo: "resources/azure.jpg",
    color: "#3498db",
  },
  aws: {
    name: "Amazon Web Services",
    logo: "resources/aws.png",
    color: "#e67e22",
  },
  centml: { name: "CentML", logo: "resources/centml.png", color: "#28b463" },
};

const populate_initial_data = (habitatData) => {
  let filtered_instances = [];
  if (habitatData) {
    for (const instance of instances) {
      const found_in_habitat = habitatData.find(
        (item) => item[0].toLowerCase() === instance.gpu.toLowerCase()
      );
      const found_in_cardMemory = cardMemory.find(
        (item) =>
          item.name.toLocaleLowerCase() === instance.gpu.toLocaleLowerCase()
      );
      if (found_in_habitat && found_in_cardMemory) {
        filtered_instances.push({
          id: instance.id,
          x: found_in_habitat[1], // msec
          y: (instance.cost / 3.6e6) * found_in_habitat[1], // cost per msec * habitatData = cost per 1 iteration
          info: instance,
          vmem: found_in_cardMemory.vmem,
          fill: providers[instance.provider].color,
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

    let totalHr =
      (numIterations * originalData.x) / 3.6e6 / provider.info.ngpus; // NEED YUBO FEEDBACK
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
          fill: providers[item.info.provider].color,
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
            <Col xl={8}>
              <Row>
                <Col>
                  <div>
                    <h6>Filter by provider</h6>
                    <Form.Select
                      onChange={(e) =>
                        handleFilterChange("provider", e.target.value)
                      }
                    >
                      <option value="all">All</option>
                      {Object.keys(providers).map((provider, index) => {
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
                <Row>
                  <ScatterGraph
                    data={providerPanelSettings.plotData}
                    onClickHandler={onClickConfig}
                    xlabel={"Total Training time (hrs)"}
                    ylabel={"Total Cost (US dollars)"}
                    providers={providers}
                    numIterations={numIterations}
                  />
                </Row>
              </Row>
            </Col>
            <Col xl={4}>
              <div className="innpv-memory innpv-subpanel">
                <Subheader icon="database">Deployment Plan</Subheader>
                {providerPanelSettings.clicked && (
                  <h6>
                    Estimation for <Badge bg="secondary">{numIterations}</Badge>{" "}
                    total iterations
                  </h6>
                )}
                {providerPanelSettings.clicked && (
                  <CardGroup>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <Row>
                            <Col xs={3}>
                              <Image
                                src={
                                  providers[
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
                                Estimated Cost: $
                                {providerPanelSettings.estimated_cost.toFixed(
                                  2
                                )}
                              </Badge>
                              <Badge bg="success">
                                Estimated Training Time:{" "}
                                {providerPanelSettings.estimated_time.toFixed(
                                  3
                                )}{" "}
                                Hours
                              </Badge>
                            </Col>
                          </Row>
                        </Card.Title>
                        <Card.Text>
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
                                <th>
                                  {providerPanelSettings.clicked.info.gpu}
                                </th>
                                <th>
                                  {providerPanelSettings.clicked.info.ngpus}
                                </th>
                                <th>
                                  {/* {gpus[providerPanelSettings.clicked.info.gpu].vmem} GB */}
                                  {providerPanelSettings.clicked.vmem} GB
                                </th>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Text>
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
