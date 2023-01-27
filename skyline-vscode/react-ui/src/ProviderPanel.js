import Subheader from "./Subheader";
import {
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  MarkSeries,
  FlexibleWidthXYPlot,
} from "react-vis";
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
} from "react-bootstrap";
import React,{useState, useEffect} from "react";

const ProviderPanel = ({numIterations,habitatData,changeParentState}) => {
    const [providerPanelSettings, setProviderPanelSettings] = useState({
              plotData: [],
              nearest: null,
              clicked: null,
              maxNumGpu: '4',
              estimated_cost: 0,
              estimated_time: 0,
            })
    
    const normalColor = "#8DD0FF";
    const highlightColor = "#44C96D";
    const normalSize = 8;
    const enlargedSize = 12;

    const providers = {
      google: { name: "Google Cloud Platform", logo: "resources/google.png" },
      azure: { name: "Microsoft Azure", logo: "resources/azure.jpg" },
      aws: { name: "Amazon Web Services", logo: "resources/aws.png" },
      centml: { name: "CentML", logo: "resources/centml.png" },
    };

    // perf obtained from https://cloud.google.com/blog/topics/developers-practitioners/benchmarking-rendering-software-compute-engine
    // assume k80 half as fast as p4
    const gpus = {
      t4: { vmem: 16, perf: 1 / 0.3717 },
      p4: { vmem: 8, perf: 1 / 0.605 },
      v100: { vmem: 16, perf: 1 / 0.1472 },
      p100: { vmem: 16, perf: 1 / 0.2253 },
      a100: { vmem: 40, perf: 1 / 0.1147 },
      k80: { vmem: 24, perf: 0.5 / 0.605 },
      rtx2080ti: { vmem: 11, perf: 0.8 * (1 / 0.1472) },
    };

    // costs are 1 GPU * hr
    const instances = [
      {
        id: 0,
        provider: "google",
        ngpus: 1,
        instance: "a2-highgpu-1g",
        gpu: "a100",
        cost: 2.939,
      },
      {
        id: 1,
        provider: "google",
        ngpus: 1,
        instance: "nvidia-tesla-t4",
        gpu: "t4",
        cost: 0.35,
      },
      {
        id: 2,
        provider: "google",
        ngpus: 1,
        instance: "nvidia-tesla-p4",
        gpu: "p4",
        cost: 0.6,
      },
      {
        id: 3,
        provider: "google",
        ngpus: 1,
        instance: "nvidia-tesla-v100",
        gpu: "v100",
        cost: 2.48,
      },
      {
        id: 4,
        provider: "google",
        ngpus: 1,
        instance: "nvidia-tesla-p100",
        gpu: "p100",
        cost: 1.46,
      },
      {
        id: 5,
        provider: "google",
        ngpus: 1,
        instance: "nvidia-tesla-k80",
        gpu: "k80",
        cost: 0.45,
      },

      {
        id: 6,
        provider: "aws",
        ngpus: 1,
        instance: "p3.2xlarge",
        gpu: "v100",
        cost: 3.06,
      },
      {
        id: 7,
        provider: "aws",
        ngpus: 1,
        instance: "p2.xlarge",
        gpu: "k80",
        cost: 0.9,
      },
      {
        id: 8,
        provider: "aws",
        ngpus: 1,
        instance: "g4dn.xlarge",
        gpu: "t4",
        cost: 0.526,
      },

      {
        id: 9,
        provider: "azure",
        ngpus: 1,
        instance: "NC6",
        gpu: "k80",
        cost: 0.9,
      },
      {
        id: 10,
        provider: "azure",
        ngpus: 1,
        instance: "NC6s v2",
        gpu: "p100",
        cost: 2.07,
      },
      {
        id: 11,
        provider: "azure",
        ngpus: 1,
        instance: "NC6s v3",
        gpu: "v100",
        cost: 3.06,
      },
      {
        id: 12,
        provider: "azure",
        ngpus: 1,
        instance: "NC4as T4 v3",
        gpu: "t4",
        cost: 0.526,
      },

      {
        id: 13,
        provider: "centml",
        ngpus: 1,
        instance: "CentML",
        gpu: "rtx2080ti",
        cost: 0.2,
      },

      // 2/4 GPU instances

      {
        id: 14,
        provider: "google",
        ngpus: 2,
        instance: "a2-highgpu-2g",
        gpu: "a100",
        cost: 2 * 2.939,
      },
      {
        id: 15,
        provider: "google",
        ngpus: 2,
        instance: "nvidia-tesla-t4",
        gpu: "t4",
        cost: 2 * 0.35,
      },
      {
        id: 16,
        provider: "google",
        ngpus: 2,
        instance: "nvidia-tesla-p4",
        gpu: "p4",
        cost: 2 * 0.6,
      },
      {
        id: 17,
        provider: "google",
        ngpus: 2,
        instance: "nvidia-tesla-v100",
        gpu: "v100",
        cost: 2 * 2.48,
      },
      {
        id: 18,
        provider: "google",
        ngpus: 2,
        instance: "nvidia-tesla-p100",
        gpu: "p100",
        cost: 2 * 1.46,
      },
      {
        id: 19,
        provider: "google",
        ngpus: 2,
        instance: "nvidia-tesla-k80",
        gpu: "k80",
        cost: 2 * 0.45,
      },

      {
        id: 20,
        provider: "aws",
        ngpus: 2,
        instance: "g4ad.8xlarge",
        gpu: "t4",
        cost: 1.734,
      },

      {
        id: 21,
        provider: "google",
        ngpus: 4,
        instance: "a2-highgpu-2g",
        gpu: "a100",
        cost: 4 * 2.939,
      },
      {
        id: 22,
        provider: "google",
        ngpus: 4,
        instance: "nvidia-tesla-t4",
        gpu: "t4",
        cost: 4 * 0.35,
      },
      {
        id: 23,
        provider: "google",
        ngpus: 4,
        instance: "nvidia-tesla-p4",
        gpu: "p4",
        cost: 4 * 0.6,
      },
      {
        id: 24,
        provider: "google",
        ngpus: 4,
        instance: "nvidia-tesla-v100",
        gpu: "v100",
        cost: 4 * 2.48,
      },
      {
        id: 25,
        provider: "google",
        ngpus: 4,
        instance: "nvidia-tesla-p100",
        gpu: "p100",
        cost: 4 * 1.46,
      },
      {
        id: 26,
        provider: "google",
        ngpus: 4,
        instance: "nvidia-tesla-k80",
        gpu: "k80",
        cost: 4 * 0.45,
      },

      {
        id: 27,
        provider: "aws",
        ngpus: 4,
        instance: "p3.8xlarge",
        gpu: "v100",
        cost: 12.24,
      },
      {
        id: 28,
        provider: "aws",
        ngpus: 4,
        instance: "g4dn.12xlarge",
        gpu: "t4",
        cost: 3.912,
      },
    ];

  const populateProviderGraph = (maxGpus) => {
    
    let newPlotData = [];
    for (let i = 0; i < instances.length; i++) {
      let perf =
        gpus[instances[i].gpu].perf *
        instances[i].ngpus *
        (1114.12 / 341.6241 / 4);
      if (instances[i].ngpus <= Number(maxGpus)) {
        newPlotData.push({
          id: instances[i].id,
          x: 1.0 / perf,
          y: instances[i].cost / perf,
          size: normalSize,
          color: normalColor,
          info: instances[i],
        });
      }
    }
    setProviderPanelSettings((prevState)=>({
        ...prevState,
        maxNumGpu: maxGpus,
        plotData: newPlotData,})
    )
  };

  const recalculateCost = () => {
    let thisGpu = providerPanelSettings.clicked;
    if (thisGpu == null) return;
    // V100: 40ms
    // Relative per-iteration time is 40 * perf(v100) / perf(current)
    let iters = numIterations;
    let perf =
      gpus[thisGpu.info.gpu].perf *
      thisGpu.info.ngpus *
      (1114.12 / 341.6241 / 4);
    let perIterMs = (40 * (1 / 0.1472)) / perf;
    let totalHr = (iters * perIterMs) / 3.6e6;
    let totalCost = thisGpu.info.cost * totalHr;

    setProviderPanelSettings((prevState)=>({
      ...prevState,   
      estimated_cost: totalCost,
      estimated_time: totalHr,
    }));
  }

  const onClickConfig = (value) => {
    setProviderPanelSettings((prevState)=>({ ...prevState, clicked: value }));

    for (let i = 0; i < providerPanelSettings.plotData.length; i++) {
        providerPanelSettings.plotData[i].color = normalColor;
        providerPanelSettings.plotData[i].size = normalSize;
    }
    providerPanelSettings.plotData[value.id].color = highlightColor;
    providerPanelSettings.plotData[value.id].size = enlargedSize;

    changeParentState((prevState)=>({ ...prevState, btnDeployVariant: "primary" }));

    // V100: 40ms
    // Relative per-iteration time is 40 * perf(v100) / perf(current)
    let iters = numIterations;
    let perf =
      gpus[value.info.gpu].perf *
      value.info.ngpus *
      (1114.12 / 341.6241 / 4);
    let perIterMs = (40 * (1 / 0.1472)) / perf;
    let totalHr = (iters * perIterMs) / 3.6e6;
    let totalCost = value.info.cost * totalHr;

    setProviderPanelSettings((prevState)=>({
        ...prevState,   
        estimated_cost: totalCost,
        estimated_time: totalHr,
      }));;
  }

    useEffect(()=>{
        // populate graph
        populateProviderGraph('4');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        recalculateCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[numIterations])

    
    return (
          <>
            <div className="innpv-memory innpv-subpanel">
              <Subheader icon="database">Providers</Subheader>
              <Container>
                <Row>
                  <Col>Filter Max Number of GPUs:</Col>
                  <Col>
                    <ButtonGroup className="me-2" aria-label="">
                      {['1', '2', '4'].map((idx) => (
                        <ToggleButton
                          key={idx}
                          id={`radio-${idx}`}
                          type="radio"
                          variant={
                            idx === providerPanelSettings.maxNumGpu ? "primary" : "light"
                          }
                          name="radio"
                          size="sm"
                          value={idx}
                          checked={idx === providerPanelSettings.maxNumGpu}
                          onChange={(e) =>
                            populateProviderGraph(e.currentTarget.value)
                          }
                        >
                          {idx}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Col>
                  <Col></Col>
                </Row>
              </Container>
              <FlexibleWidthXYPlot width={600} height={300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis title="Relative Training Time" style={{ fontSize: 15 }} />
                <YAxis title="Relative Cost" style={{ fontSize: 15 }} />
                <MarkSeries
                  className="mark-series-example"
                  strokeWidth={4}
                  opacity="0.9"
                  colorType="literal"
                  sizeRange={[10, 15]}
                  data={providerPanelSettings.plotData || []}
                  onNearestXY={(value) => setProviderPanelSettings((prevState)=>({ ...prevState,nearest: value }))}
                  onSeriesMouseOut={() => setProviderPanelSettings((prevState)=>({ ...prevState, nearest: null }))}
                  onValueClick={onClickConfig}
                />
              </FlexibleWidthXYPlot>
            </div>
            <div className="innpv-memory innpv-subpanel">
              <Subheader icon="database">Deployment Plan</Subheader>
              {providerPanelSettings.clicked && (
                <h6>
                  Estimation for{" "}
                  <Badge bg="secondary">{numIterations}</Badge> total
                  iterations
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
                                providers[providerPanelSettings.clicked.info.provider]
                                  .logo
                              }
                              width="75px"
                            ></Image>
                          </Col>
                          <Col xs={9}>
                            <h1>{providerPanelSettings.clicked.info.instance}</h1>
                            <Badge>
                              Estimated Cost: $
                              {providerPanelSettings.estimated_cost.toFixed(2)}
                            </Badge>
                            <Badge bg="success">
                              Estimated Training Time:{" "}
                              {providerPanelSettings.estimated_time.toFixed(3)} Hours
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
                              <th>Rel. Performance</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>{providerPanelSettings.clicked.info.gpu}</th>
                              <th>{providerPanelSettings.clicked.info.ngpus}</th>
                              <th>
                                {gpus[providerPanelSettings.clicked.info.gpu].vmem} GB
                              </th>
                              <th>
                                {gpus[
                                  providerPanelSettings.clicked.info.gpu
                                ].perf.toFixed(2)}
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
          </>
        );
}

export default ProviderPanel;