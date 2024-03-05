import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
const ProjectInfo = () => {
  const { analysisState } = useSelector(
    (state) => state.analysisStateSliceReducer
  );
  const projectRoot = analysisState["project_root"];
  const entryPoint = analysisState["project_entry_point"];
  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel innpv-subpanel-content">
          <div>
            <strong>Project Root</strong> &nbsp; {projectRoot}
          </div>
          <div>
            <strong>Entry Point</strong> &nbsp;&nbsp;&nbsp; {entryPoint}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div``;
export default ProjectInfo;