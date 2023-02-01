import ProviderPanel from "./ProviderPanel";
import TrainingPanel from "./TrainingPanel";
import {
  Accordion,
  Button,
  Col,
  Row,
  Container,
  Card,
  Spinner,
} from "react-bootstrap";
import React, { useState } from "react";

const DeploymentTab = ({ numIterations, habitatData }) => {
  const [deploymentTabSettings, setDeploymentTabSettings] = useState({
    activeTab: "0",
    btnDeployVariant: "secondary",
    btnDeployLabel: "Deploy and Run Model",
  });
  const deployOnClick = () => {
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    setTimeout(async () => {
      setDeploymentTabSettings((prevState) => ({
        ...prevState,
        btnDeployVariant: "secondary",
        btnDeployLabel: "Deploying Model....",
      }));
      await sleep(1000);

      setDeploymentTabSettings((prevState) => ({
        ...prevState,
        activeTab: "1",
      }));
    }, 100);
  };

  return (
    <>
      {habitatData.length === 0 ? (
        <Container fluid>
          <Row className="justify-content-md-center">
            <Card>
              <Card.Body>
                <Spinner animation="border" size="sm" /> Loading Information.
              </Card.Body>
            </Card>
          </Row>
        </Container>
      ) : (
        <Accordion
          defaultActiveKey="0"
          activeKey={deploymentTabSettings.activeTab}
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>Deployment Target</Accordion.Header>
            <Accordion.Body>
              <ProviderPanel
                numIterations={numIterations}
                habitatData={habitatData}
                changeParentState={setDeploymentTabSettings}
              />
              <Row>
                <Col>
                  <Button
                    variant={deploymentTabSettings.btnDeployVariant}
                    disabled={
                      true ||
                      deploymentTabSettings.btnDeployVariant === "secondary"
                    }
                    onClick={deployOnClick}
                  >
                    {deploymentTabSettings.btnDeployLabel}
                  </Button>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Training</Accordion.Header>
            <Accordion.Body>
              <TrainingPanel></TrainingPanel>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
};

export default DeploymentTab;
