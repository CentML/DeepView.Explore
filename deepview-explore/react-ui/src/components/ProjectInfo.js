
import React from "react";
import styled from "styled-components";

const ProjectInfo = ({ projectRoot, entryPoint }) => {
  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel">
          <div className="innpv-subpanel-content">
            <div className="info-main">
              <div className="info-body">
                <h6>Project Root</h6> <code>{projectRoot}</code>
              </div>
              <div className="info-body">
                <h6>Entry Point</h6> <code>{entryPoint}</code>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}


const Wrapper = styled.div`
.info-main {
  display: flex;
  flex-direction: column;
}
.info-body {
  display: flex;
  flex-direction: row;
  h6 {
    margin-right: 1rem;
  }
}
`;
export default ProjectInfo;