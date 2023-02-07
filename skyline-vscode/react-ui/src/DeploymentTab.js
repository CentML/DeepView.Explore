import ProviderPanel from "./ProviderPanel";
import {
  Row,
  Container,
  Card,
  Spinner,
  Badge
} from "react-bootstrap";
import React from "react";
import { numberFormat } from "./utils";

const DeploymentTab = ({ numIterations, habitatData }) => {
  

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
        <Container fluid>
          <Row>
            <h1>Deployment Target</h1>
            <h6>
                    Estimation for <Badge bg="secondary">{numberFormat(numIterations)}</Badge>{" "}
                    total iterations
                  </h6>
                <ProviderPanel
                numIterations={numIterations}
                habitatData={habitatData}
              />
          </Row>
        </Container>
      )}
    </>
  );
};

export default DeploymentTab;
