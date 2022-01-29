import './App.css';
import './styles.css';

import React, { useState } from 'react';
import BarSlider from './BarSlider'
import Subheader from './Subheader'
import NumericDisplay from './NumericDisplay'

function App() {
    const [sliderMemoryPerc, setSliderMemoryPerc] = useState(50);
    const [sliderThroughputPerc, setSliderThroughputPerc] = useState(50);

    const onMemoryResize = function (change) {
        var newHeight = sliderMemoryPerc * (1 + change/100);
        newHeight = Math.min(100, Math.max(0, newHeight));
        setSliderMemoryPerc(newHeight);
    }

    const onThroughputResize = function (change) {
        var newHeight = sliderThroughputPerc * (1 + change/100);
        newHeight = Math.min(100, Math.max(0, newHeight));
        setSliderThroughputPerc(newHeight);
    }

    return (
        <>
        <div className="innpv-memory innpv-subpanel">
            <Subheader icon="database">Peak Memory Usage</Subheader>
            <div className="innpv-subpanel-content">
            <BarSlider 
                percentage={sliderMemoryPerc}
                limitPercentage='100'
                handleResize={onMemoryResize}
                style={{height: '100%'}}
            />

            <div className="innpv-subpanel-sidecontent">
                <NumericDisplay
                top="Peak Usage"
                number={69}
                bottom="Megabytes"
                />
                <div className="innpv-separator" />
                <NumericDisplay
                top="Maximum Capacity"
                number={420}
                bottom="Megabytes"
                />
            </div>
            </div>
        </div>
        <div className="innpv-memory innpv-subpanel">
            <Subheader icon="database">Throughput</Subheader>
            <div className="innpv-subpanel-content">
            <BarSlider 
                percentage={sliderThroughputPerc}
                limitPercentage='100'
                handleResize={onThroughputResize}
                style={{height: '100%'}}
            />

            <div className="innpv-subpanel-sidecontent">
                <NumericDisplay
                top="Throughput"
                number={69}
                bottom="samples/second"
                />
                <div className="innpv-separator" />
                <NumericDisplay
                top="Predicted Maximum"
                number={420}
                bottom="samples/second"
                />
            </div>
            </div>
        </div>
        </>
    );
}

export default App;
