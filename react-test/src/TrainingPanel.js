

import Subheader from './Subheader';
import { XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, MarkSeries, LineMarkSeries } from 'react-vis';
import { Button, ProgressBar } from 'react-bootstrap';
import React, { useEffect } from 'react';
import '../node_modules/react-vis/dist/style.css';



export default class TrainingPanel extends React.Component {
    constructor(props) {
        super(props);
        this.beginTraining = this.beginTraining.bind(this);
        
        this.state = {
            pbarProps: { variant: "primary", value: 0, animated: true}, 
            trainingCurveData: []
        };

    }

    async beginTraining() {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        await sleep(100);
        let epochCount = 50;
        for (var i = 0; i < epochCount; i++) {
            this.setState( {pbarProps: {variant: "primary", value: i*(100/epochCount), animated: true}} );
            
            let fakeTrainAcc = 1.0 / (1 + Math.exp(-1.5 * (i/(epochCount/10)- 2)));
            let noise = Math.random() * 0.05;
            this.state.trainingCurveData.push({x: i, y: fakeTrainAcc+noise});

            await sleep(250);
        }

        this.setState( {pbarProps: {variant: "success", value: 100, animated: false}} );
    }

    render() {
        return (
            <>
                { this.state.trainingCurveData.length == 0 && <Button variant='primary' onClick={this.beginTraining}>Begin Training</Button> }
                <ProgressBar variant={this.state.pbarProps.variant} animated={this.state.pbarProps.animated} now={this.state.pbarProps.value} />
                <XYPlot width={500} height={300}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis title="Epoch" style={{ fontSize: 15 }}/>
                    <YAxis title="Training Accuracy" style={{ fontSize: 15 }}/>
                    <LineMarkSeries
                        className="training-curve"
                        style={{
                            strokeWidth: '3px'
                        }}
                        lineStyle={{ stroke: 'red' }}
                        markStyle={{ stroke: 'blue' }}
                        data={this.state.trainingCurveData}
                    />
                </XYPlot>
                { this.state.trainingCurveData.length == 100 && <Button variant='success' >Download Model</Button> }
            </>
        );
    }
}
