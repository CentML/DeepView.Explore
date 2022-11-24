
import Subheader from './Subheader';

import {
    XAxis,
    YAxis,
    HorizontalBarSeries,
    XYPlot,
    makeWidthFlexible
  } from 'react-vis';

import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export default function Habitat({habitatData}) {

    // The colors used for the visualization
    // The first n-1 colors should follow a blue gradient while the last
    // color is used for the current device.
    const colors = [
        '#7986cb',
        '#5c6bc0',
        '#3f51b5',
        '#3949ab',
        '#303f9f',
        '#283593',
        '#1a237e',
        '#ffc300'
    ];

    // const sampleData = [
    //     {y: 'device 1', x: 10, color: 0},
    //     {y: 'device 2', x: 5, color: 1},
    //     {y: 'device 3', x: 15, color: 2},
    //     {y: 'device 4', x: 20, color: 3}
    // ];

    const sampleDataVGG = [
        {y: "V100", x: 38.6031339393715, color: 0},
        {y: "P100", x: 67.57987999101333, color: 1},
        {y: "T4", x: 118.20070742178441, color: 2},
        {y: "P4000", x: 145.73762440806306, color: 3},
        {y: "RTX2070", x: 74.75586879514157, color: 4}
    ];

    // Resnet
    const sampleDataResnet = [
        {y: "V100", x: 47.40975887490825, color: 0},
        {y: "P100", x: 81.04154092289134, color: 1},
        {y: "T4", x: 124.23241486678548, color: 2},
        {y: "P4000", x: 173.1962974218274, color: 3},
        {y: "RTX2070", x: 90.15023999989465, color: 4}
    ];

    let sampleData = [];

    for (var i = 0; i < habitatData.length; i++) {
        sampleData.push({
            y: habitatData[i][0],
            x: habitatData[i][1],
            color: habitatData[i][0] == "source" ? colors[colors.length - 1] : colors[i % (colors.length - 1)]
            // color: habitatData[i][0] == "source" ? colors.length - 1 : i % (colors.length - 1)
        });
    }

    console.log(sampleData);

    return (
        <div className="innpv-memory innpv-subpanel">
            <Subheader icon="database">Habitat</Subheader>
            <div className="innpv-subpanel-content">
                { habitatData.length == 0 && 
                <Container fluid>
                <Row className="justify-content-md-center">
                <Card>
                    <Card.Body><Spinner animation="border" size="sm" /> Loading Habitat predictions.</Card.Body>
                </Card>
                </Row>
                </Container>
                }

                { habitatData != [] && 
                <FlexibleXYPlot 
                    height={225}
                    yType='ordinal'
                    colorType="literal" colorRange={colors}
                    margin={{left: 100}}>

                    <XAxis title="Predicted Runtime (ms)" style={{ fontSize: 15 }}/>
                    <YAxis style={{fontSize: 12}}/>
                    <HorizontalBarSeries data={sampleData} />
                </FlexibleXYPlot>
                }
            </div>
        </div>
    );
}