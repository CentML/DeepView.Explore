import React, { useState } from "react";
import ProjectInfo from "../components/ProjectInfo";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import { useSelector, useDispatch } from "react-redux";
import { updatePassState } from "../redux/slices/passesStateSlice";

const WelcomeScreen = () => {
  const { vscodeApi } = useSelector((state) => state.vsCodeSliceReducer);
  const { analysisState } = useSelector(
    (state) => state.analysisStateSliceReducer
  );
  const [passesCheckbox, setPassesCheckbox] = useState({
    ddp: false,
  });
  const [btn_clicked, setBtn_clicked] = useState(false);

  const dispatch = useDispatch();

  const onClickBeginAnalysis = () => {
    dispatch(
      updatePassState({ name: "ddpPass", value: passesCheckbox["ddp"] })
    );
    setBtn_clicked(true);
    if (vscodeApi) {
      vscodeApi.postMessage({
        command: "begin_analysis_clicked",
        ddpFlag: passesCheckbox["ddp"],
      });
    }
  };

  const updatePassFlag = (name, value) => {
    console.log(name, value);
    setPassesCheckbox((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Container>
        <Card>
          <Card.Title></Card.Title>
          <Card.Body>
            <Stack gap={3}>
              <Image src="resources/deepview.png"></Image>
              {analysisState && (
                <>
                  <ProjectInfo />
                </>
              )}
              <Form>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    checked={passesCheckbox["ddp"] ? true : false}
                    onChange={(e) => updatePassFlag("ddp", e.target.checked)}
                    type="checkbox"
                    label="DDP Analysis (adds 3-5 minutes to the process)"
                  />
                </Form.Group>
              </Form>
              <Button
                variant={btn_clicked ? "secondary" : "success"}
                size="lg"
                onClick={onClickBeginAnalysis}
                disabled={btn_clicked}
              >
                {btn_clicked ? "Analyzing Project ..." : "Begin Analysis"}
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default WelcomeScreen;
