import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const SaveSession = ({ timeBreakDown, encodedFiles }) => {
  const { vscodeApi } = useSelector((state) => state.vsCodeSliceReducer);
  const { analysisState } = useSelector(
    (state) => state.analysisStateSliceReducer
  );
  const { epochs, iterPerEpoch } = useSelector(
    (state) => state.trainingScheduleReducer
  );
  const fileNamesSet = new Set();
  timeBreakDown?.fine?.forEach((elem) => {
    if (elem.file_refs && elem.file_refs.length > 0) {
      fileNamesSet.add(elem.file_refs[0].path);
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.download = "profiling_session.json";
    const blob = new Blob([
      JSON.stringify({ analysisState, epochs, iterPerEpoch, encodedFiles }),
    ]);
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  useEffect(() => {
    vscodeApi?.postMessage({
      command: "encoding_start",
      file_names: [...fileNamesSet],
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Wrapper>
        <div className="submit-layout">
          <h6 className="save-title">Save your profiling session</h6>
          <div className="save-content">
            <FontAwesomeIcon
              icon={faDownload}
              size="2x"
              color=" #5dade2 "
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  .submit-layout {
    padding-top: 15px;
    display: flex;
    flex-direction: row;
  }
  .save-title {
    margin-right: 1rem;
    text-align: center;
  }

  .save-content:hover {
    cursor: pointer;
  }

  @media only screen and (min-width: 560px) {
    .submit-layout {
      padding-top: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
`;

export default SaveSession;
