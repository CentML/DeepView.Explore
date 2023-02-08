"use babel";

import React from "react";
import MemoryPerfBar from "./MemoryPerfBar";

class PerfBarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
    };
    this._onLabelClick = this._onLabelClick.bind(this);
  }

  _onLabelClick(label) {
    const { expanded } = this.state;
    const { labels } = this.props;

    if (
      expanded == null &&
      labels.some(
        (labelInfo) => labelInfo.clickable && labelInfo.label === label
      )
    ) {
      this.setState({ expanded: label });
    } else if (expanded === label) {
      this.setState({ expanded: null });
    }
  }

  _classes() {
    let mainClass = "innpv-perfbarcontainer-wrap";
    if (this.props.disabled) {
      mainClass += " innpv-no-events";
    }
    if (this.props.focusing) {
      mainClass += " innpv-perfbarcontainer-focusing";
    }
    return mainClass;
  }

  render() {
    const { renderPerfBars, marginTop, labels } = this.props;
    const { expanded } = this.state;
    return (
      <div className={this._classes()}>
        <div className="innpv-perfbarcontainer">
          <div
            className="innpv-perfbarcontainer-inner"
            style={{ marginTop: `-${marginTop}px` }}
          >
            {renderPerfBars?.map((elem, idx) => {
              return (
                <MemoryPerfBar
                  key={`${elem["name"]}_${idx}`}
                  elem={elem}
                  isActive={true}
                  label={elem["name"]}
                  overallPct={elem["percentage"]}
                  percentage={elem["percentage"]}
                  resizable={false}
                  colorClass={
                    elem["name"] === "untracked"
                      ? "innpv-untracked-color"
                      : "innpv-blue-color-" + ((idx % 5) + 1)
                  }
                  tooltipHTML={
                    elem["name"] === "untracked"
                      ? `<b>Untracked</b><br>Time: ${
                          Math.round(elem["total_time"] * 100) / 100
                        }ms`
                      : `<b>${elem["name"]}</b><br>Forward: ${
                          Math.round(elem["forward_ms"] * 100) / 100
                        }ms<br>Backward: ${
                          Math.round(elem["backward_ms"] * 100) / 100
                        }ms`
                  }
                />
              );
            })}
          </div>
        </div>
        <LabelContainer
          labels={labels}
          expanded={expanded}
          onLabelClick={this._onLabelClick}
        />
      </div>
    );
  }
}

PerfBarContainer.defaultProps = {
  focusing: false,
  disabled: false,
  labels: [],
  marginTop: 0,
  renderPerfBars: [],
};

function LabelContainer(props) {
  if (props.labels.length === 0) {
    return null;
  }

  return (
    <div className="innpv-perfbarcontainer-labelcontainer">
      {props.labels
        .filter(({ percentage }) => percentage > 0)
        .map(({ label, percentage, clickable }, index) => {
          let displayPct = percentage;
          if (props.expanded != null) {
            if (label === props.expanded) {
              displayPct = 100;
            } else {
              displayPct = 0.001;
            }
          }
          return (
            <div
              className={`innpv-perfbarcontainer-labelwrap ${
                clickable ? "innpv-perfbarcontainer-clickable" : ""
              }`}
              key={`${label}-${index}`}
              style={{ height: `${displayPct}%` }}
              onClick={() => props.onLabelClick(label)}
            >
              <div className="innpv-perfbarcontainer-label">{label}</div>
            </div>
          );
        })}
    </div>
  );
}

export default PerfBarContainer;
