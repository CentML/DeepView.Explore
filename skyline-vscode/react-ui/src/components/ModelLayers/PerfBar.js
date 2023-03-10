import React, { useState } from "react";

import Elastic from "./Elastic";
import PerfHintState from "./PerfHintState";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import PieGraph from "../PieGraph";

const DOUBLE_CLICK_DELAY_MS = 500;

const PerfBar = ({
  isActive = false,
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
  index,
}) => {
  const [show, setShow] = useState(false);
  const [lastClick, setLastClick] = useState(0);
  const [perfHintState, setPerfHintState] = useState(PerfHintState.NONE);

  const piegraph_data = [
    {
      name: 'conv1',
      value: 10,
    },
    {
      name: 'bn1',
      value: 5,
    },
    {
      name: 'conv2',
      value: 20,
    },
    {
      name: 'bn2',
      value: 8,
    },
    {
      name: 'conv3',
      value: 10,
    },
    {
      name: 'bn3',
      value: 11,
    },
    {
      name: 'downsample',
      value: 15,
    },
    {
      name: 'relu',
      value: 30,
    },
    {
      name: 'overhead',
      value: 20,
    },
  ]

  const handleHoverEnter = () => {
    onActiveChange(true);
  };

  const handleHoverExit = () => {
    onActiveChange(false);
  };

  const handleIncrease = () => {
    if (perfHintState === PerfHintState.INCREASING) {
      return;
    }
    setPerfHintState(PerfHintState.INCREASING);
  };

  const handleDecrease = () => {
    if (perfHintState === PerfHintState.DECREASING) {
      return;
    }
    setPerfHintState(PerfHintState.DECREASING);
  };

  const handleRestore = () => {
    if (perfHintState === PerfHintState.NONE) {
      return;
    }
    setPerfHintState(PerfHintState.NONE);
  };

  const handleClick = (event) => {
    const now = Date.now();
    const diff = now - lastClick;
    // if (diff <= DOUBLE_CLICK_DELAY_MS) {
    //   setLastClick(0);
    //   onDoubleClick(event);
    // } else {
    //   setLastClick(now);
    //   onClick(event);
    // }
    setShow(true);
  };

  const redirectToFile = () => {
    setShow(false);
    onDoubleClick();
  };

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
  };

  return (
    <>
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
          onDoubleClick={onDoubleClick}
        />
        {renderPerfHints(perfHintState)}
      </Elastic>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{elem["name"]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              columnGap: "50px",
            }}
          >
            <div>
              <p style={{ margin: "0" }}>Utilization:</p>
            </div>
            <div style={{ flexGrow: "4" }}>
              <ProgressBar variant="success" now={40} label="40%" />
            </div>
          </div>
          <div>
            <div>
              <h6 style={{marginTop:'1rem', marginBottom:'0'}}>Breakdown:</h6>
              <PieGraph data={piegraph_data} height={320} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={redirectToFile}>
            Go to file
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PerfBar;
