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
import PerfBarContainer from './PerfBarContainer';
import MemoryPerfBar from './MemoryPerfBar';

import ReactTooltip from 'react-tooltip';


import { computePercentage, getTraceByLevel } from './utils';
// Changed by John 
import { profiling_data } from './data/mock_data';
import EnergyConsumption from './sections/EnergyConsumption';
// end changed by John

/**
 * Returns information required to draw memory and throughput information
 * @param {*} analysisState 
 * @param {*} bs 
 * @returns an object containing {memory, maxMemory, thoughput, maxThroughput}
 */
function updateSliders(analysisState, memoryPerc, throughputPerc, setSliderMemory, setSliderThroughput, bs) {
    let memoryModel = analysisState['throughput']['peak_usage_bytes'];
    let throughputModel = analysisState['throughput']['run_time_ms'];

    let maxBatch = Math.floor((analysisState['breakdown']['memory_capacity_bytes'] - memoryModel[1]) / memoryModel[0]);

    let maxMemory = analysisState['breakdown']['memory_capacity_bytes'];
    let maxThroughput = maxBatch * 1000.0 / (maxBatch * throughputModel[0] + throughputModel[1]);

    if (!bs) { // changed by John, was if (bs == null)
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
    }
    let memory = bs * memoryModel[0] + memoryModel[1];
    let throughput = bs * 1000.0 / (bs * throughputModel[0] + throughputModel[1]);

    setSliderMemory([100.0 * memory / maxMemory, memory / 1e6, maxMemory / 1e6]);
    setSliderThroughput([100.0 * throughput / maxThroughput, throughput, maxThroughput]);

    return bs;
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
    if (typeof acquireApi.api === 'undefined') { // changed by John, was ==
        console.log("Calling acquire function");
        if (typeof acquireVsCodeApi === "function") { // changed by John, was ==
            let f = window['acquireVsCodeApi'];
            let a = f();
            acquireApi.api = a;
        } else {
            acquireApi.api = null;
        }
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
    const [curBatchSize, setCurBatchSize] = useState(0);
    const [timeBreakDown, setTimeBreakdown] = useState([]);

    const [vscodeApi, setVscodeApi] = useState(acquireApi());
    const [errorText, setErrorText] = useState();
    App.vscodeApi = vscodeApi;

    const onMemoryResize = function (change) {
        let newHeight = sliderMemory[0] * (1 + change / 100);
        newHeight = Math.min(100, Math.max(0, newHeight));
        // setSliderMemoryPerc(newHeight);

        let bs = updateSliders(analysisState, newHeight, null, setSliderMemory, setSliderThroughput, null);
        setCurBatchSize(bs);
    }

    const onThroughputResize = function (change) {
        var newHeight = sliderThroughput[0] * (1 + change / 100);
        newHeight = Math.min(100, Math.max(0, newHeight));

        let bs = updateSliders(analysisState, null, newHeight, setSliderMemory, setSliderThroughput, null);
        setCurBatchSize(bs);
    }

    const processAnalysisState = function (state) {
        setAnalysisState(state);
        if (state.breakdown) {
            let operation_tree = state.breakdown.operation_tree;
            let { coarse, fine } = getTraceByLevel(operation_tree);
            setTimeBreakdown({ 
                coarse: computePercentage(coarse, state.breakdown.iteration_run_time_ms),
                fine: computePercentage(fine, state.breakdown.iteration_run_time_ms)
            });
            ReactTooltip.rebuild();
        }
    }

    useEffect(function () {
        window.addEventListener('message', event => {
            console.log("Message:", JSON.stringify(event.data));
            if (event.data['message_type'] === "analysis") { // changed by John, was ==
                processAnalysisState(event.data);
                updateSliders(event.data, null, null, setSliderMemory, setSliderThroughput, event.data["breakdown"]["batch_size"]);
            } else if (event.data['message_type'] === "text_change") { // changed by John, was ==
                console.log("Text change!");
                setTextChanged(true);
            } else if (event.data['message_type'] === 'error') { // changed by John, was ==
                setErrorText(event.data['error_text']);
            }
        });

        const sendMock = true;

        if (sendMock) {
            setTimeout(() => {
                const mockResponse = profiling_data;
                console.log("mock response", mockResponse);
                processAnalysisState(mockResponse);
                updateSliders(mockResponse, 0.5, null, setSliderMemory, setSliderThroughput);
            }, 1000);

            // setTimeout(() => {
            //     setErrorText("this is the body");
            // }, 5000);
        }
    }, []);

    if (errorText) {
        return (
            <>
            <Alert variant="danger">
            <Alert.Heading>Analysis Error</Alert.Heading>
            <p>
                An error has occurred during analysis. This could be a problem with Skyline or possibly your code. For more information, refer to the detailed message below:
            </p>
            <hr />
            <p className="mb-0">
                <code>
                    {errorText}
                </code>
            </p>
            <hr />
            <Button onClick={restartProfiling}>Restart Profiling</Button>
            </Alert>
            </>
        )
    }

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
                    <div className='innpv-contents-columns'>
                    <div className='innpv-perfbar-contents'>
                        <PerfBarContainer 
                            labels={timeBreakDown.coarse ? timeBreakDown.coarse.map(elem => {
                                return {
                                    label: elem["percentage"] > 10 ? elem["name"] : "", 
                                    percentage: elem["percentage"],
                                    clickable: false
                                }
                            }) : []}
                            renderPerfBars={() => {
                                return timeBreakDown.fine ? timeBreakDown.fine.map((elem, idx) => {
                                    return <MemoryPerfBar 
                                        key={`${elem["name"]}_${idx}`}
                                        elem={elem}
                                        isActive={true}
                                        label={elem["name"]}
                                        overallPct={elem["percentage"]}
                                        percentage={elem["percentage"]}
                                        resizable={false}
                                        // changed by John, was ==
                                        colorClass={elem["name"] === "untracked" ?  "innpv-untracked-color" : "innpv-blue-color-" + ((idx % 5)+1)} 
                                        // changed by John, was ==
                                        tooltipHTML={elem["name"] === "untracked" ? `<b>Untracked</b><br>Time: ${Math.round(elem["total_time"] * 100)/100}ms` : `<b>${elem["name"]}</b><br>Forward: ${Math.round(elem["forward_ms"]*100)/100}ms<br>Backward: ${Math.round(elem["backward_ms"]*100)/100}ms`}
                                    />
                                }) : () => { return []; }
                            }}
                        />
                        <ReactTooltip type="info" effect="float" html={true}/>
                    </div>
                    <div className="innpv-contents-subrows">
                    <div className="innpv-memory innpv-subpanel">
                        
                        {
                        // changed by John, was == 
                        curBatchSize !== 0 && <><Alert variant='secondary'>Using predicted batch size <b>{Math.round(curBatchSize)}</b></Alert><br /></> }
                        
                        <Subheader icon="database">Peak Memory Usage</Subheader>
                            <Row>
                                <Col>
                                <Badge className="float-end" bg="secondary">{analysisState["hardware_info"]["gpus"][0]}</Badge>
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
                    <EnergyConsumption />
                    </div>
                    </div>
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
