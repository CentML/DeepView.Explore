import React from 'react';

import Resizable from './Resizable';

const BarSlider = ({
  percentage,
  limitPercentage = 100,
  handleResize = () => {},
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}) => {
  const limitBarHeight = 100 - limitPercentage;
  return (
    <div
        className="innpv-barslider"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="innpv-barslider-barwrap">
          <Resizable
            className="innpv-resizable-barslider"
            heightPct={percentage}
            handleResize={handleResize}
          >
            <div className="innpv-barslider-bar" />
          </Resizable>
          {limitBarHeight > 1e-3 ?
            <div className="innpv-barslider-limit" style={{height: `${limitBarHeight}%`}} /> : null}
        </div>
      </div>
  )
}

export default BarSlider;