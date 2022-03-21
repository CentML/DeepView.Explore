
import Subheader from './Subheader';
import { XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, MarkSeries } from 'react-vis';
import { Badge, Button, ButtonGroup, Card, CardGroup, Container, Form, Row, ToggleButton, Col, Image, Table } from 'react-bootstrap';
import React from 'react';

export default class ProviderPanel extends React.Component {
    constructor(props) {
        super(props);
        this.onClickConfig = this.onClickConfig.bind(this);
        this.recalculateCost = this.recalculateCost.bind(this);
        this.populateProviderGraph = this.populateProviderGraph.bind(this);
        
        this.setParentState = props.setParentState;

        this.normalColor = '#8DD0FF';
        this.highlightColor = '#44C96D';
        this.normalSize = 8;
        this.enlargedSize = 12;

        this.state = {
            plotData: [],
            nearest: null,
            clicked: null,
            numEpochs: 50,
            numIters: 1000,
            maxNumGpu: 4
        };

        this.providers = {
            google: { name: "Google Cloud Platform", logo: "https://logos-world.net/wp-content/uploads/2021/02/Google-Cloud-Emblem.png" },
            azure: { name: "Microsoft Azure", logo: "https://sonraisecurity.com/wp-content/uploads/2021/04/azure-logo-e1619210112399.png" },
            aws: { name: "Amazon Web Services", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png" },
            centml: { name: "CentML", logo: "https://www.cs.toronto.edu/~ybgao/habitat/centml.png" }
        };

        // perf obtained from https://cloud.google.com/blog/topics/developers-practitioners/benchmarking-rendering-software-compute-engine
        // assume k80 half as fast as p4
        this.gpus = {
            t4: { vmem: 16, perf: 1/0.3717 },
            p4: { vmem: 8, perf: 1/0.605},
            v100: { vmem: 16, perf: 1/0.1472 },
            p100: { vmem: 16, perf: 1/0.2253 },
            a100: { vmem: 40, perf: 1/0.1147 },
            k80: { vmem: 24, perf: 0.5/0.605 },
            rtx2080ti: {vmem: 11, perf: 0.8*(1/0.1472)}
        };

        // costs are 1 GPU * hr
        this.instances = [
            {id: 0, provider: "google", ngpus: 1, instance: "a2-highgpu-1g", gpu: "a100", cost: 2.939},
            {id: 1, provider: "google", ngpus: 1, instance: "nvidia-tesla-t4", gpu: "t4", cost: 0.35},
            {id: 2, provider: "google", ngpus: 1, instance: "nvidia-tesla-p4", gpu: "p4", cost: 0.60},
            {id: 3, provider: "google", ngpus: 1, instance: "nvidia-tesla-v100", gpu: "v100", cost: 2.48},
            {id: 4, provider: "google", ngpus: 1, instance: "nvidia-tesla-p100", gpu: "p100", cost: 1.46},
            {id: 5, provider: "google", ngpus: 1, instance: "nvidia-tesla-k80", gpu: "k80", cost: 0.45},

            {id: 6, provider: "aws", ngpus: 1, instance: "p3.2xlarge", gpu: "v100", cost: 3.06},
            {id: 7, provider: "aws", ngpus: 1, instance: "p2.xlarge", gpu: "k80", cost: 0.90},
            {id: 8, provider: "aws", ngpus: 1, instance: "g4dn.xlarge", gpu: "t4", cost: 0.526},

            {id: 9, provider: "azure", ngpus: 1, instance: "NC6", gpu: "k80", cost: 0.90},
            {id: 10, provider: "azure", ngpus: 1, instance: "NC6s v2", gpu: "p100", cost: 2.07},
            {id: 11, provider: "azure", ngpus: 1, instance: "NC6s v3", gpu: "v100", cost: 3.06},
            {id: 12, provider: "azure", ngpus: 1, instance: "NC4as T4 v3", gpu: "t4", cost: 0.526},

            {id: 13, provider: "centml", ngpus: 1, instance: "CentML", gpu: "rtx2080ti", cost: 0.20},

            // 2/4 GPU instances

            {id: 14, provider: "google", ngpus: 2, instance: "a2-highgpu-2g", gpu: "a100", cost: 2*2.939},
            {id: 15, provider: "google", ngpus: 2, instance: "nvidia-tesla-t4", gpu: "t4", cost: 2*0.35},
            {id: 16, provider: "google", ngpus: 2, instance: "nvidia-tesla-p4", gpu: "p4", cost: 2*0.60},
            {id: 17, provider: "google", ngpus: 2, instance: "nvidia-tesla-v100", gpu: "v100", cost: 2*2.48},
            {id: 18, provider: "google", ngpus: 2, instance: "nvidia-tesla-p100", gpu: "p100", cost: 2*1.46},
            {id: 19, provider: "google", ngpus: 2, instance: "nvidia-tesla-k80", gpu: "k80", cost: 2*0.45},

            {id: 20, provider: "aws", ngpus: 2, instance: "g4ad.8xlarge", gpu: "t4", cost: 1.734},

            {id: 21, provider: "google", ngpus: 4, instance: "a2-highgpu-2g", gpu: "a100", cost: 4*2.939},
            {id: 22, provider: "google", ngpus: 4, instance: "nvidia-tesla-t4", gpu: "t4", cost: 4*0.35},
            {id: 23, provider: "google", ngpus: 4, instance: "nvidia-tesla-p4", gpu: "p4", cost: 4*0.60},
            {id: 24, provider: "google", ngpus: 4, instance: "nvidia-tesla-v100", gpu: "v100", cost: 4*2.48},
            {id: 25, provider: "google", ngpus: 4, instance: "nvidia-tesla-p100", gpu: "p100", cost: 4*1.46},
            {id: 26, provider: "google", ngpus: 4, instance: "nvidia-tesla-k80", gpu: "k80", cost: 4*0.45},

            {id: 27, provider: "aws", ngpus: 4, instance: "p3.8xlarge", gpu: "v100", cost: 12.24},
            {id: 28, provider: "aws", ngpus: 4, instance: "g4dn.12xlarge", gpu: "t4", cost: 3.912},
        ];

        // populate graph
        this.populateProviderGraph(4);
    }

    populateProviderGraph(maxGpus) {
        // Generate randomized data
        // for (let i = 0; i < this.instances.length; i++) {

        console.log("maxGpus", maxGpus);
        this.setState({
            maxNumGpu: maxGpus
        });

        this.state.plotData = [];
        for (let i = 0; i < this.instances.length; i++) {
            let perf = this.gpus[this.instances[i].gpu].perf * this.instances[i].ngpus * (1114.12/341.6241/4);
            if (this.instances[i].ngpus <= maxGpus) {
                this.state.plotData.push({
                    id: this.instances[i].id,
                    // x: 1.0 / this.gpus[this.instances[i].gpu].perf,
                    // y: this.instances[i].cost / this.gpus[this.instances[i].gpu].perf,
                    x: 1.0 / perf,
                    y: this.instances[i].cost / perf,
                    size: this.normalSize,
                    color: this.normalColor,
                    info: this.instances[i]
                });
            }
        }
    }

    recalculateCost() {
        let thisGpu = this.state.clicked;
        if (thisGpu == null) return;
        // V100: 40ms
        // Relative per-iteration time is 40 * perf(v100) / perf(current)
        let iters = this.state.numEpochs * this.state.numIters;
        let perf = this.gpus[thisGpu.info.gpu].perf * thisGpu.ngpus * (1114.12/341.6241/4);
        let perIterMs = 40 * (1/0.1472) / perf;
        let totalHr = iters * perIterMs / (3.6e+6);
        let totalCost = thisGpu.info.cost * totalHr;

        this.setState({
            estimated_cost: totalCost,
            estimated_time: totalHr
        });
    }

    onClickConfig(value) {
        this.setState({clicked: value});

        for (let i = 0; i < this.state.plotData.length; i++) {
            this.state.plotData[i].color = this.normalColor;
            this.state.plotData[i].size = this.normalSize;
        }
        this.state.plotData[value.id].color = this.highlightColor;
        this.state.plotData[value.id].size = this.enlargedSize;

        this.setParentState({btnDeployVariant: 'primary'});

        // V100: 40ms
        // Relative per-iteration time is 40 * perf(v100) / perf(current)
        let iters = this.state.numEpochs * this.state.numIters;
        let perf = this.gpus[value.info.gpu].perf * value.info.ngpus * (1114.12/341.6241/4);
        // let perIterMs = 40 * (1/0.1472) / this.gpus[value.info.gpu].perf;
        let perIterMs = 40 * (1/0.1472) / perf;
        let totalHr = iters * perIterMs / (3.6e+6);
        let totalCost = value.info.cost * totalHr;

        this.setState({
            estimated_cost: totalCost,
            estimated_time: totalHr
        });
    }

    render() {
        return (
            <>
                <div className="innpv-memory innpv-subpanel">
                    <Subheader icon="database">Providers</Subheader>
                    <Container>
                    <Row>
                        <Col>Filter Num GPUs:</Col>
                        <Col>
                        <ButtonGroup className="me-2" aria-label="">
                            { [1, 2, 4].map(idx => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant={idx == this.state.maxNumGpu ? "primary" : "light"}
                                name="radio"
                                size="sm"
                                value={idx}
                                checked={idx == this.state.maxNumGpu}
                                onChange={(e) => this.populateProviderGraph(e.currentTarget.value)}
                            >{idx}</ToggleButton>
                            )) }
                        </ButtonGroup>
                        </Col>
                        <Col></Col>
                    </Row>
                    </Container>
                    <XYPlot width={500} height={300}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis title="Relative Training Time" style={{ fontSize: 15}}/>
                        <YAxis title="Relative Cost" style={{ fontSize: 15 }}/>
                        <MarkSeries
                            className="mark-series-example"
                            strokeWidth={4}
                            opacity="0.9"
                            colorType='literal'
                            sizeRange={[10, 15]}
                            data={this.state.plotData || []}
                            onNearestXY={value => this.setState({nearest: value})}
                            onSeriesMouseOut={() => this.setState({nearest: null})}
                            onValueClick={this.onClickConfig}
                        />
                    </XYPlot>
                </div>
                <div className="innpv-memory innpv-subpanel">
                    <Subheader icon="database">Training Schedule</Subheader>
                    <Container>
                    <Form>
                    <Row>
                        <Col xs={5}>
                        <Form.Group className="mb-3" controlId="formEpochs">
                            <Form.Label>Epochs</Form.Label>
                            <Form.Control type="text" value={this.state.numEpochs} placeholder="number of epochs" 
                            onChange={e => { this.setState({numEpochs: parseInt(e.target.value)}); this.recalculateCost(); }}
                            />
                        </Form.Group>
                        </Col>
                        <Col xs={5}>
                        <Form.Group className="mb-3" controlId="formIterations">
                            <Form.Label>Iterations</Form.Label>
                            <Form.Control type="text" value={this.state.numIters} placeholder="iterations per epoch"
                                onChange={e => { this.setState({numIters: parseInt(e.target.value)}); this.recalculateCost(); }}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
                    </Form>
                    </Container>
                </div>
                <div className="innpv-memory innpv-subpanel">
                    <Subheader icon="database">Deployment Plan</Subheader>
                    { this.state.clicked && 
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Col xs={3}>
                                            <Image src={this.providers[this.state.clicked.info.provider].logo} width="75px"></Image>
                                        </Col>
                                        <Col xs={9}>
                                            <h1>{this.state.clicked.info.instance}</h1>
                                            <Badge>Estimated Cost: ${this.state.estimated_cost.toFixed(2)}</Badge>
                                            <Badge bg='success'>Estimated Training Time: {this.state.estimated_time.toFixed(3)} Hours</Badge>
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
                                                <th>{this.state.clicked.info.gpu}</th>
                                                <th>{this.state.clicked.info.ngpus}</th>
                                                <th>{this.gpus[this.state.clicked.info.gpu].vmem} GB</th>
                                                <th>{this.gpus[this.state.clicked.info.gpu].perf.toFixed(2)}</th>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                    }
                    { this.state.clicked == null && 
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>Select a configuration.</Card.Title>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                    }
                </div>
            </>
        );
    }
}
