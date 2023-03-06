import React,{useState} from "react";

import Elastic from "./Elastic";
import PerfHintState from "./PerfHintState";

const DOUBLE_CLICK_DELAY_MS = 500;

const PerfBar = (
  {isActive = false,
  resizable = false,
  clickable = false,
  renderPerfHints = (perfHintState) => null,
  tooltipHTML = null,
  onClick = (event) => {},
  onDoubleClick = (event) => {},
  onActiveChange = (isActive) => {},
  percentage,
  updateMarginTop,
  colorClass,
elem,
index}
) => {

  const [lastClick, setLastClick] = useState(0);
  const [perfHintState, setPerfHintState] = useState(PerfHintState.NONE);

  const handleHoverEnter = () => {
    onActiveChange(true);
  }

  const handleHoverExit = () => {
    onActiveChange(false);
  }

  const handleIncrease = () => {
    if (perfHintState === PerfHintState.INCREASING) {
      return;
    }
    setPerfHintState(PerfHintState.INCREASING);
  }

  const handleDecrease = () => {
    if (perfHintState === PerfHintState.DECREASING) {
      return;
    }
    setPerfHintState(PerfHintState.DECREASING);
  }

  const handleRestore = () => {
    if (perfHintState === PerfHintState.NONE) {
      return;
    }
    setPerfHintState(PerfHintState.NONE);
  }

  const handleClick = (event) => {
    const now = Date.now();
    const diff = now - lastClick;
    if (diff <= DOUBLE_CLICK_DELAY_MS) {
      setLastClick(0);
      onDoubleClick(event);
    } else {
      setLastClick(now);
      onClick(event);
    }
  }

  const className = () => {
    let mainClass = "innpv-perfbar-wrap";

    if (isActive) {
      mainClass += " innpv-perfbar-active";
    }

    if (resizable) {
      return mainClass + " innpv-perfbar-resizable";
    } else if (clickable) {
      return mainClass + " innpv-perfbar-clickable";
    } else {
      return mainClass;
    }
  }

  return (
    <Elastic
      className={className()}
      disabled={!resizable}
      heightPct={percentage}
      updateMarginTop={updateMarginTop}
      handleShrink={handleDecrease}
      handleGrow={handleIncrease}
      handleSnapBack={handleRestore}
      tooltipHTML={tooltipHTML}
      elem={elem}
      index={index}
    >
      <div
        className={`innpv-perfbar ${colorClass}`}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverExit}
        onClick={handleClick}
      />
      {renderPerfHints(perfHintState)}
    </Elastic>
  );


};

export default PerfBar;
