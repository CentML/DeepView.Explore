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
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import CarbonEquivalent from "./CarbonEquivalent";

import { deploymentScatterGraphColorSize } from "../data/properties";

import { ProviderPanelModal } from "../components/Modals";

import {
  calculate_training_time,
  getCarbonDataOfInstance,
  numberFormat,
  currencyFormat,
} from "../utils/utils";

import { loadJsonFiles } from "../utils/parsers";

import { useSelector } from "react-redux";

const ProviderPanel = () => {
  const {analysisState} = useSelector((state) => state.analysisStateSliceReducer);
  const { epochs, iterPerEpoch } = useSelector(
    (state) => state.trainingScheduleReducer
  );
  const numIterations = epochs * iterPerEpoch;
  const habitatData = analysisState["habitat"]["predictions"];
  const cloudProviderURLs = analysisState["additionalProviders"];

  const [providerPanelSettings, setProviderPanelSettings] = useState({
    plotData: null,
    initialData: null,
    cloudProviders: null,
    nearest: null,
    clicked: null,
    fetchErrors: null,
    carbonData: null,
    maxNumGpu: 0,
    provider: "all",
    gpu: "all",
    estimated_cost: 0,
    estimated_time: 0,
  });

  const habitatIsDemo = habitatData.find(
    (item) => item[0] === "demo" && item[1] === 1
  );

  const MAX_GPU = [1, 2, 4, 0]; // 0 is all

  // const initial_data = populate_initial_data(habitatData);

  let gpuList = new Set();
  if (providerPanelSettings.initialData) {
    providerPanelSettings.initialData.forEach((element) => {
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

    const filtered_plot_data = providerPanelSettings.initialData
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

  const recalculateCost = (instance) => {
    if (instance == null) return;
    const originalData = providerPanelSettings.initialData.find(
      (item) => item.id === instance.id
    );
    let totalHr = calculate_training_time(numIterations, originalData); // NEED YUBO FEEDBACK
    let totalCost = instance.info.cost * totalHr;

    let currCarbonData =
      instance.regions !== undefined
        ? getCarbonDataOfInstance(
            totalHr,
            instance,
            providerPanelSettings.cloudProviders[instance.info.provider]
          )
        : null;

    setProviderPanelSettings((prevState) => ({
      ...prevState,
      clicked: instance,
      estimated_cost: totalCost,
      estimated_time: totalHr,
      carbonData: currCarbonData,
    }));
  };

  const onClickConfig = (value) => {
    setProviderPanelSettings((prevState) => ({
      ...prevState,
      plotData: prevState.plotData.map((item) => {
        if (item.id === value.id) {
          return {
            ...item,
            fill: deploymentScatterGraphColorSize.HIGHLIGHTCOLOR,
            z: deploymentScatterGraphColorSize.HIGHLIGHTSIZE,
          };
        }
        return {
          ...item,
          fill: providerPanelSettings.cloudProviders[item.info.provider].color,
          z: deploymentScatterGraphColorSize.NORMALSIZE,
        };
      }),
    }));
    recalculateCost(value);
  };

  useEffect(() => {
    recalculateCost(providerPanelSettings.clicked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numIterations]);

  useEffect(() => {
    async function fetchData() {
      const jsondata = await loadJsonFiles(habitatData, cloudProviderURLs);
      setProviderPanelSettings((prevState) => ({
        ...prevState,
        plotData: jsondata.instanceArray,
        initialData: jsondata.instanceArray,
        cloudProviders: jsondata.cloudProviders,
        fetchErrors: jsondata.errors,
      }));
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {providerPanelSettings.plotData &&
      providerPanelSettings.cloudProviders ? (
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">Providers</Subheader>
          <Container fluid>
            {habitatIsDemo && (
              <Row className="mt-2">
                <Alert variant="danger">
                  Currently showing a demo data because local GPU is not
                  supported by DeepView.Predict or there was an issue generating
                  accurate predictions
                </Alert>
              </Row>
            )}
            <Row>
              <Col xl={12} xxl={12}>
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
                          {Object.keys(
                            providerPanelSettings.cloudProviders
                          ).map((provider, index) => {
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
                              checked={
                                numgpu === providerPanelSettings.maxNumGpu
                              }
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
                      providers={providerPanelSettings.cloudProviders}
                      numIterations={numIterations}
                    />
                  </Row>
                </Row>
                {providerPanelSettings.fetchErrors && (
                  <Row className="mt-2">
                    <ProviderPanelModal
                      errors={providerPanelSettings.fetchErrors}
                    />
                  </Row>
                )}
              </Col>
              <Col xl={12} xxl={12} className="mb-4">
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
                                    providerPanelSettings.cloudProviders[
                                      providerPanelSettings.clicked.info
                                        .provider
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
                                <th>
                                  {providerPanelSettings.clicked.info.gpu}
                                </th>
                                <th>
                                  {providerPanelSettings.clicked.info.ngpus}
                                </th>
                                <th>{providerPanelSettings.clicked.vmem} GB</th>
                              </tr>
                            </tbody>
                          </Table>
                          {providerPanelSettings.carbonData && (
                            <CarbonEquivalent
                              carbonData={providerPanelSettings.carbonData}
                            />
                          )}
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
      ) : (
        <div className="innpv-memory innpv-subpanel">
          <Container fluid>
            <Row className="justify-content-md-center">
              <Card>
                <Card.Body>
                  <Spinner animation="border" size="sm" /> Loading instances
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default ProviderPanel;
