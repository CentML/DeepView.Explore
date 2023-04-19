import React from 'react';

import PerfBar from './PerfBar';
import App from '../../App';

const MemoryPerfBar = (props) => {

  const onDoubleClick = () => {
    if(props.elem.file_refs && props.elem.file_refs.length > 0 && App.vscodeApi){
      let file_context = props.elem.file_refs[0];

      App.vscodeApi.postMessage({
        command: "highlight_source_line",
        file: file_context.path,
        lineno: file_context.line_no
      });
    }
  }

  const {tooltipHTML, ...rest} = props;

  return (
    <PerfBar
      clickable={true}
      renderPerfHints={()=>{}}
      tooltipHTML={tooltipHTML}
      onDoubleClick={onDoubleClick}
      {...rest}
    />
  );

}

export default MemoryPerfBar;