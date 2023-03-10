import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import ProgressBar from "react-bootstrap/ProgressBar";


const DRAG_MAX_PCT = 0.2;
const GAIN = 0.8;

function easing(x) {
  // y = 1 - (1 - x)^3
  const inner = 1 - x;
  const cubed = Math.pow(inner, 3);
  return 1 - cubed;
}

const Elastic = ({
  className = "",
  disabled = false,
  handleShrink = () => {},
  handleGrow = () => {},
  handleSnapBack = () => {},
  updateMarginTop = () => {},
  heightPct,
  tooltipHTML,
  children,
  elem,
  index,
}) => {
  const [height, setHeight] = useState(-100);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [clickedUpper, setClickedUpper] = useState(false);
  const [clickClientY, setClickClientY] = useState(0);
  const [targetHeight, setTargetHeight] = useState(1);

  const handleMouseDown = (event) => {
    if (disabled) {
      return;
    }

    setDragging(true);
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const middle = boundingRect.height / 2;
    const clickPositionY = event.clientY - boundingRect.top;
    setClickedUpper(clickPositionY < middle);
    setClickClientY(event.clientY);
    setTargetHeight(boundingRect.height);
    setHeight(boundingRect.height);
  };

  const handleMouseUp = () => {
    clearDragging();
  };

  const handleMouseLeave = () => {
    clearDragging();
  };

  const clearDragging = () => {
    if (!dragging) {
      return;
    }
    setDragging(false);
    setPaddingTop(0);
    setPaddingBottom(0);
    setHeight(0);
    updateMarginTop(0);
    handleSnapBack();
  };

  const handleMouseMove = (event) => {
    if (!dragging || disabled) {
      return;
    }
    // Positive means cursor moved down, negative means cursor moved up
    const deltaY = (event.clientY - clickClientY) * GAIN;
    const deltaYPct = Math.abs(deltaY / targetHeight);

    // Don't allow the element to shrink/grow beyond a certain threshold
    if (deltaYPct > DRAG_MAX_PCT) {
      return;
    }

    const easedAmount =
      easing(deltaYPct / DRAG_MAX_PCT) * targetHeight * DRAG_MAX_PCT;

    if (deltaY > 0) {
      // Cursor moved down
      if (clickedUpper) {
        // Shrink from the top
        setPaddingTop(easedAmount);
        handleShrink();
      } else {
        // Grow from the bottom
        setHeight(targetHeight + easedAmount);
        handleGrow();
      }
    } else {
      // Cursor moved up
      if (clickedUpper) {
        // Grow from the top
        setHeight(targetHeight + easedAmount);
        updateMarginTop(easedAmount);
        handleGrow();
      } else {
        // Shrink from the bottom
        setPaddingBottom(easedAmount);
        handleShrink();
      }
    }
  };

  // Use the initial height unless the user has dragged the element
  const containerStyle = {
    height: height <= 0 ? `${heightPct}%` : `${height}px`,
  };
  const innerStyle = {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
  };

  const calculateTooltipPosition = ({ top, left }) => {
    const posLeft = 40;
    const posTop =
      Math.abs(window.innerHeight - top) < 100 ? window.innerHeight - 100 : top;
    return { top: posTop, left: posLeft };
  };

  return (
    <>
      <div
        className={`innpv-elastic ${className}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={containerStyle}
        data-tip
        data-for={`${index}`}
      >
        <div className="innpv-elastic-inner" style={innerStyle}>
          {children}
        </div>
        <ReactTooltip
          id={`${index}`}
          type="info"
          effect="float"
          place="right"
          arrowColor="transparent"
          overridePosition={calculateTooltipPosition}
        >
          <div style={{ display: "flex" }}>
            <div>
              {elem["name"] === "untracked" ? (
                <p>
                  <span style={{ display: "block" }}>Untracked</span>
                  <span style={{ display: "block" }}>
                    Time: {Math.round(elem["total_time"] * 100) / 100} ms
                  </span>
                </p>
              ) : (
                <p>
                  <span style={{ display: "block" }}>{elem["name"]}</span>
                  <span style={{ display: "block" }}>
                    Forward: {Math.round(elem["forward_ms"] * 100) / 100} ms
                  </span>
                  <span style={{ display: "block" }}>
                    Backward: {Math.round(elem["backward_ms"] * 100) / 100} ms
                  </span>
                </p>
              )}
            </div>
            <div
              style={{
                marginLeft: "0.5rem",
                paddingLeft: "0.5rem",
                borderLeft: "0.1rem solid #d5dbdb",
              }}
            >
              <p>GPU utilization</p>
              <ProgressBar variant="success" now={40} label="40%" />
            </div>
          </div>
        </ReactTooltip>
      </div>
    </>
  );
};

export default Elastic;
