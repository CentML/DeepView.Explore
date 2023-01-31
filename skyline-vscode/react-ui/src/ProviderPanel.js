import React,{useState, useEffect} from "react";
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

import { find_card_in_habitat } from "./utils";
import { instances,cardMemory } from "./data/providers";

const normalColor = "#8DD0FF";
const highlightColor = "#44C96D";
const normalSize = 8;
const enlargedSize = 12;

const populate_initial_data = (habitatData)=>{
  let filtered_instances=[]
  if(habitatData){
    for(const instance of instances){
      const found_in_habitat = habitatData.find((item)=> item[0].toLowerCase() === instance.gpu.toLowerCase())
      const found_in_cardMemory = cardMemory.find((item)=> item.name.toLocaleLowerCase() === instance.gpu.toLocaleLowerCase())
      if (found_in_habitat && found_in_cardMemory){
        filtered_instances.push({
          id: instance.id,
          x: found_in_habitat[1], // msec
          y: instance.cost / (3.6e6) * found_in_habitat[1], // cost per msec * habitatData
          size: normalSize,
          color: normalColor,
          info: instance,
          vmem: found_in_cardMemory.vmem
        })
      }
    }
  
  }
  console.log(filtered_instances)
  return filtered_instances;
}



const ProviderPanel = ({numIterations,habitatData,changeParentState}) => {
    const [providerPanelSettings, setProviderPanelSettings] = useState({
              plotData: populate_initial_data(habitatData),
              nearest: null,
              clicked: null,
              maxNumGpu: '4',
              estimated_cost: 0,
              estimated_time: 0,
            })
    
    

    const providers = {
      google: { name: "Google Cloud Platform", logo: "resources/google.png" },
      azure: { name: "Microsoft Azure", logo: "resources/azure.jpg" },
      aws: { name: "Amazon Web Services", logo: "resources/aws.png" },
      centml: { name: "CentML", logo: "resources/centml.png" },
    };

    // perf obtained from https://cloud.google.com/blog/topics/developers-practitioners/benchmarking-rendering-software-compute-engine
    // assume k80 half as fast as p4
    /**
     * 
     * this.gpus = {
            t4: { vmem: 16, perf: 1/0.3717 },
            p4: { vmem: 8, perf: 1/0.605},
            v100: { vmem: 16, perf: 1/0.1472 },
            p100: { vmem: 16, perf: 1/0.2253 },
            a100: { vmem: 40, perf: 1/0.1147 },
            k80: { vmem: 24, perf: 0.5/0.605 },
            rtx2080ti: {vmem: 11, perf: 0.8*(1/0.1472)}
        };
     */

    const initial_data = populate_initial_data(habitatData);
    
    // const gpus = {
    //   t4: { vmem: 16, perf: 1 / 0.3717, time_per_iter: find_card_in_habitat(habitatData,'t4') },
    //   p4: { vmem: 8, perf: 1 / 0.605, time_per_iter: find_card_in_habitat(habitatData,'p4') },
    //   v100: { vmem: 16, perf: 1 / 0.1472, time_per_iter: find_card_in_habitat(habitatData,'v100') },
    //   p100: { vmem: 16, perf: 1 / 0.2253, time_per_iter: find_card_in_habitat(habitatData,'p100') },
    //   a100: { vmem: 40, perf: 1 / 0.1147, time_per_iter: find_card_in_habitat(habitatData,'a100') },
    //   k80: { vmem: 24, perf: 0.5 / 0.605, time_per_iter: find_card_in_habitat(habitatData,'p4') },
    //   rtx2080ti: { vmem: 11, perf: 0.8*(1/0.1472), time_per_iter: find_card_in_habitat(habitatData,'rtx2080ti')},
    // };
    // console.log(gpus);

    

  const populateProviderGraph = (maxGpus) => {
    
    // let newPlotData = [];
    // for (let i = 0; i < instances.length; i++) {
    //   let perf =
    //     gpus[instances[i].gpu].time_per_iter || gpus[instances[i].gpu].perf *
    //     instances[i].ngpus *
    //     (1114.12 / 341.6241 / 4);
    //   if (instances[i].ngpus <= Number(maxGpus)) {
    //     newPlotData.push({
    //       id: instances[i].id,
    //       x: 1.0 / perf,
    //       y: instances[i].cost / perf,
    //       size: normalSize,
    //       color: normalColor,
    //       info: instances[i],
    //     });
    //   }
    // }
    setProviderPanelSettings((prevState)=>({
        ...prevState,
        maxNumGpu: maxGpus,
        plotData: initial_data?.filter((item)=>item.info.ngpus<=maxGpus)})
    )
  };

  const recalculateCost = (provider) => {
    // let thisGpu = providerPanelSettings.clicked;
    // console.log(thisGpu);
    if (provider == null) return;
    // V100: 40ms
    // Relative per-iteration time is 40 * perf(v100) / perf(current)
    // let iters = numIterations;
    // let perf =
    //   gpus[thisGpu.info.gpu].time_per_iter || gpus[thisGpu.info.gpu].perf *
    //   thisGpu.info.ngpus *
    //   (1114.12 / 341.6241 / 4);
    // let perIterMs = (40 * (1 / 0.1472)) / perf;
    // let totalHr = (iters * perIterMs) / 3.6e6;
    // let totalCost = thisGpu.info.cost * totalHr;
    let totalHr = (numIterations * provider.x) / 3.6e6;
    let totalCost = provider.info.cost * totalHr;

    setProviderPanelSettings((prevState)=>({
      ...prevState,
      clicked: provider,   
      estimated_cost: totalCost,
      estimated_time: totalHr,
    }));
  }

  const onClickConfig = (value) => {
    console.log(value);

    //setProviderPanelSettings((prevState)=>({ ...prevState, clicked: value }));

    // const change_plot_data = providerPanelSettings.plotData;
    
    // for (let i = 0; i < change_plot_data.length; i++) {
    //   change_plot_data[i].color = normalColor;
    //   change_plot_data[i].size = normalSize;
    // }
    // change_plot_data[value.id].color = highlightColor;
    // change_plot_data[value.id].size = enlargedSize;

    setProviderPanelSettings((prevState)=>({
      ...prevState,
      plotData: prevState.plotData.map((item) => {
        if(item.id === value.id){
          return {
            ...item,
            color:highlightColor,
            size:enlargedSize
          }
        }
        return {
          ...item,
          color:normalColor,
          size:normalSize
        }
      })
    }))
    changeParentState((prevState)=>({ ...prevState, btnDeployVariant: "primary" }));

    // // V100: 40ms
    // // Relative per-iteration time is 40 * perf(v100) / perf(current)
    // let iters = numIterations;
    // let perf =
    //   gpus[value.info.gpu].perf *
    //   value.info.ngpus *
    //   (1114.12 / 341.6241 / 4);
    // let perIterMs = (40 * (1 / 0.1472)) / perf;
    // let totalHr = (iters * perIterMs) / 3.6e6;
    // let totalCost = value.info.cost * totalHr;

    // setProviderPanelSettings((prevState)=>({
    //     ...prevState,   
    //     estimated_cost: totalCost,
    //     estimated_time: totalHr,
    //   }));;
    recalculateCost(value);
  }

    useEffect(()=>{
        // populate graph
        populateProviderGraph('4');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        recalculateCost(providerPanelSettings.clicked);
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
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>{providerPanelSettings.clicked.info.gpu}</th>
                              <th>{providerPanelSettings.clicked.info.ngpus}</th>
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
          </>
        );
}

export default ProviderPanel;