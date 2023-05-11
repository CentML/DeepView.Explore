import ProviderPanel from "./ProviderPanel";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import React from "react";
import { numberFormat } from "../utils/utils";

import { useSelector } from "react-redux";

const DeploymentTab = () => {

  const {analysisState} = useSelector((state) => state.analysisStateSliceReducer);
  const {epochs, iterPerEpoch} = useSelector((state)=>state.trainingScheduleReducer);
  const numIterations = epochs * iterPerEpoch;
  const habitatData = analysisState["habitat"];

  return (
    <>
      {Object.keys(habitatData).length === 0 ? (
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
        <Container fluid>
          <Row>
            <h1>Deployment Target</h1>
            <h6>
              Estimation for{" "}
              <Badge bg="secondary">{numberFormat(numIterations)}</Badge> total
              iterations
            </h6>
            <ProviderPanel />
          </Row>
        </Container>
      )}
    </>
  );
};

export default DeploymentTab;
