import './App.css';
import './styles.css';

import React, { useState, useEffect } from 'react';
import { Alert, Badge, Button, Card, Col, Tab, Tabs, Row, Container } from 'react-bootstrap';

import BarSlider from './BarSlider'
import Subheader from './Subheader'
import NumericDisplay from './NumericDisplay'
import ProjectInfo from './ProjectInfo'
import Habitat from './Habitat'
import DeploymentTab from './DeploymentTab'
import WelcomeScreen from './WelcomeScreen';

/**
 * Returns information required to draw memory and throughput information
 * @param {*} analysisState 
 * @param {*} bs 
 * @returns an object containing {memory, maxMemory, thoughput, maxThroughput}
 */
function updateSliders(analysisState, memoryPerc, throughputPerc, setSliderMemory, setSliderThroughput) {
    let memoryModel = analysisState['throughput']['peak_usage_bytes'];
    let throughputModel = analysisState['throughput']['run_time_ms'];

    let maxBatch = Math.floor((analysisState['breakdown']['memory_capacity_bytes'] - memoryModel[1]) / memoryModel[0]);

    let maxMemory = analysisState['breakdown']['memory_capacity_bytes'];
    let maxThroughput = maxBatch * 1000.0 / (maxBatch * throughputModel[0] + throughputModel[1]);

    let bs = 1;
    if (memoryPerc && throughputPerc) {
        console.log("memory and throughput perc cannot both be not null");
        return;
    } else if (memoryPerc) {
        bs = Math.floor(memoryPerc * maxBatch / 100.0);
    } else if (throughputPerc) {
        let tp = throughputPerc * maxThroughput / 100.0;
        bs = Math.floor(tp * throughputModel[1]) / (1000.0 - tp * throughputModel[0]);
    } else {
        console.log("memory and throughput perc cannot both be null");
        return;
    }

    bs = Math.max(1, Math.min(bs, maxBatch));

    let memory = bs * memoryModel[0] + memoryModel[1];
    let throughput = bs * 1000.0 / (bs * throughputModel[0] + throughputModel[1]);

    setSliderMemory([100.0 * memory / maxMemory, memory / 1e6, maxMemory / 1e6]);
    setSliderThroughput([100.0 * throughput / maxThroughput, throughput, maxThroughput]);
}

// https://stackoverflow.com/questions/54135313/webview-extension-in-typescript
/**
 * Returns the vscode API handle. the acquireVsCodeApi function would not be available when compiling
 * the react project, so we need to dynamically look it up. This function also caches the handle and
 * returns it if previously acquired.
 * @returns The VSCode API handle
 */
function acquireApi() {
    // if (typeof this.acquireApi.api == 'undefined') {
    if (typeof acquireApi.api == 'undefined') {
        console.log("Calling acquire function");
        if (typeof acquireVsCodeApi == "function") {
            let f = window['acquireVsCodeApi'];
            let a = f();
            acquireApi.api = a;
        } else {
            acquireApi.api = null;
        }
    } else {
        console.log("Api previously acquired. returning.");
    }

    return acquireApi.api;
}

function restartProfiling() {
    console.log("restartProfiling");
    let vscode = App.vscodeApi;
    vscode.postMessage({
        command: "restart_profiling_clicked"
    });
}

function App() {
    const [sliderMemory, setSliderMemory] = useState([50, 69, 420]);
    const [sliderThroughput, setSliderThroughput] = useState([50, 69, 420]);
    const [analysisState, setAnalysisState] = useState();
    const [textChanged, setTextChanged] = useState(false);

    const [vscodeApi, setVscodeApi] = useState(acquireApi());
    App.vscodeApi = vscodeApi;

    const onMemoryResize = function (change) {
        let newHeight = sliderMemory[0] * (1 + change / 100);
        newHeight = Math.min(100, Math.max(0, newHeight));
        // setSliderMemoryPerc(newHeight);

        updateSliders(analysisState, newHeight, null, setSliderMemory, setSliderThroughput);
    }

    const onThroughputResize = function (change) {
        var newHeight = sliderThroughput[0] * (1 + change / 100);
        newHeight = Math.min(100, Math.max(0, newHeight));

        updateSliders(analysisState, null, newHeight, setSliderMemory, setSliderThroughput);
    }

    useEffect(function () {
        window.addEventListener('message', event => {
            console.log("Message:", JSON.stringify(event.data));
            if (event.data['message_type'] == "analysis") {
                setAnalysisState(event.data);
                // updateSliders(event.data, 0.5, null, setSliderMemory, setSliderThroughput);
                updateSliders(event.data, null, 0.5, setSliderMemory, setSliderThroughput);
            } else if (event.data['message_type'] == "text_change") {
                console.log("Text change!");
                setTextChanged(true);
            }
        });

        const sendMock = false;

        if (sendMock) {
            setTimeout(() => {
                const mockResponse = { "project_root": "/home/jim/research/skyline/skyline/samples/vgg", "project_entry_point": "entry_point.py", "throughput": { "samples_per_second": 202.63523864746094, "predicted_max_samples_per_second": 237.05572509765625, "run_time_ms": [4.2184174205145775, 13.475225268612844], "peak_usage_bytes": [50231905.85249807, 1486033095.3592386], "batch_size_context": "entry_point.py,11", "can_manipulate_batch_size": true }, "breakdown": { "peak_usage_bytes": 2261087744, "memory_capacity_bytes": 8361672704, "iteration_run_time_ms": 74.29951477050781, "batch_size": 16, "num_nodes_operation_tree": 12, "num_nodes_weight_tree": 5 }, "habitat": [] }
                console.log("mock response", mockResponse);
                setAnalysisState(mockResponse);
                updateSliders(mockResponse, 0.5, null, setSliderMemory, setSliderThroughput);
            }, 1000);
        }
    }, []);

    if (analysisState && analysisState['throughput'] && Object.keys(analysisState['throughput']).length > 0)
        return (
            <>
                <Container fluid>
                <Card>
                    <Card.Header>Project Information</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <ProjectInfo
                                projectRoot={analysisState['project_root']}
                                entryPoint={analysisState['project_entry_point']}
                            />
                        </Card.Text>
                        { textChanged && 
                        <Alert key='info' variant='info'>
                            Change is detected in the project. <Button size='sm' onClick={restartProfiling}>Restart Profiling</Button>
                        </Alert>
                        }
                    </Card.Body>
                </Card>
                <br></br>
                <Tabs defaultActiveKey="profiling" className="mb-3">
                    <Tab eventKey="profiling" title="Profiling">
                    <div className="innpv-memory innpv-subpanel">
                        <Subheader icon="database">Peak Memory Usage</Subheader>
                            <Row>
                                <Col>
                                <Badge className="float-end" bg="secondary">RTX2070</Badge>
                                <Badge className="float-end" bg="success">Local</Badge>
                                </Col>
                            </Row>
                        <div className="innpv-subpanel-content">
                            <BarSlider
                                percentage={sliderMemory[0]}
                                limitPercentage='100'
                                handleResize={onMemoryResize}
                                style={{ height: '100%' }}
                            />

                            <div className="innpv-subpanel-sidecontent">
                                <NumericDisplay
                                    top="Peak Usage"
                                    number={sliderMemory[1]}
                                    bottom="Megabytes"
                                />
                                <div className="innpv-separator" />
                                <NumericDisplay
                                    top="Maximum Capacity"
                                    number={sliderMemory[2]}
                                    bottom="Megabytes"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="innpv-memory innpv-subpanel">
                        <Subheader icon="database">Throughput</Subheader>
                        <div className="innpv-subpanel-content">
                            <BarSlider
                                percentage={sliderThroughput[0]}
                                limitPercentage='100'
                                handleResize={onThroughputResize}
                                style={{ height: '100%' }}
                            />

                            <div className="innpv-subpanel-sidecontent">
                                <NumericDisplay
                                    top="Throughput"
                                    number={sliderThroughput[1]}
                                    bottom="samples/second"
                                />
                                <div className="innpv-separator" />
                                <NumericDisplay
                                    top="Predicted Maximum"
                                    number={sliderThroughput[2]}
                                    bottom="samples/second"
                                />
                            </div>
                        </div>
                    </div>
                    <Habitat habitatData={analysisState['habitat']}/>
                    </Tab>
                    <Tab eventKey="deploy" title="Deployment">
                        <DeploymentTab></DeploymentTab>
                    </Tab>
                </Tabs>
                </Container>
            </>
        );

    return (
        <>
            <WelcomeScreen analysisState={analysisState} vscodeApi={vscodeApi}></WelcomeScreen>
        </>
    );
}

export default App;
