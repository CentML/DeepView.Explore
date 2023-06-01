import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";

const SaveSession = ({ timeBreakDown }) => {
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
  console.log(fileNamesSet);
  const handleSubmit = (e) => {
    e.preventDefault();
    vscodeApi?.postMessage({
      command: "save_profiling_session",
      file_names: [...fileNamesSet],
      analysisState,
      epochs,
      iterPerEpoch,
    });
  };
  return (
    <>
      <div>Save your profiling session</div>
      <Form onSubmit={handleSubmit} className="mt-2">
        <Form.Group className="mt-1">
          <Button variant="outline-primary" type="submit">
            save
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

export default SaveSession;
