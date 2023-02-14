import React, { useState, useEffect } from "react";

const MOUSE_MOVE_EVENT = "mousemove";
const MOUSE_UP_EVENT = "mouseup";

const Resizable = ({
  className = "",
  handleResize = () => {},
  heightPct,
  children,
}) => {
  const [dragging, setDragging] = useState(false);
  const [clickClientY, setClickClientY] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(1);
  const [initialHeightPct, setInitialHeightPct] = useState(1);

  const handleMouseDown = (event) => {
    const { height } = event.currentTarget.getBoundingClientRect();
    setDragging(true);
    setClickClientY(event.clientY);
    setSliderHeight(height / (heightPct / 100));
    setInitialHeightPct(heightPct);
  };

  const handleMouseUp = (event) => {
    setDragging(false);
  };

  const handleMouseMove = (event) => {
    if (!dragging) {
      return;
    }
    const diff = clickClientY - event.clientY;
    setClickClientY(event.clientY);
    handleResize(diff / sliderHeight * 100, initialHeightPct);
  };

  useEffect(() => {
    document.addEventListener(MOUSE_MOVE_EVENT, handleMouseMove);
    document.addEventListener(MOUSE_UP_EVENT, handleMouseUp);

    return () => {
      document.removeEventListener(MOUSE_MOVE_EVENT,handleMouseMove);
      document.removeEventListener(MOUSE_UP_EVENT, handleMouseUp);
    };
  });

  return(
    <div
        className={`innpv-resizable ${className}`}
        style={{ height: `${heightPct}%` }}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
  )
};

export default Resizable;
