'use babel';

// import path from 'path';
import React from 'react';

import PerfBar from './PerfBar';
import {toReadableByteSize} from './utils';

class MemoryPerfBar extends React.Component {
  constructor(props) {
    super(props);
    // this._renderPerfHints = this._renderPerfHints.bind(this);
    // this._onClick = this._onClick.bind(this);
    // this._onDoubleClick = this._onDoubleClick.bind(this);
    // this._onActiveChange = this._onActiveChange.bind(this);
  }

  // _generateTooltipHTML() {
  //   const {memoryNode, overallPct} = this.props;
  //   return `<strong>${memoryNode.name}</strong><br/>` +
  //     `${toReadableByteSize(memoryNode.sizeBytes)}<br/>` +
  //     `${overallPct.toFixed(2)}%`;
  // }

  render() {
    // const {memoryNode, editorsByPath, ...rest} = this.props;
    const {tooltipHTML, ...rest} = this.props;
    return (
      <PerfBar
        clickable={true}
        renderPerfHints={()=>{}}
        tooltipHTML={tooltipHTML}
        // onClick={this._onClick}
        // onDoubleClick={this._onDoubleClick}
        // onActiveChange={this._onActiveChange}
        {...rest}
      />
    );
  }
}

MemoryPerfBar.defaultProps = {
  editors: [],
};

export default MemoryPerfBar;