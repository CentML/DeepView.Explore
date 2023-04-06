import ProviderPanel from "./ProviderPanel";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import React from "react";
import { numberFormat } from "../utils/utils";

const DeploymentTab = ({ numIterations, habitatData,additionalProviders }) => {
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
              Estimation for{" "}
              <Badge bg="secondary">{numberFormat(numIterations)}</Badge> total
              iterations
            </h6>
            <ProviderPanel
              numIterations={numIterations}
              habitatData={habitatData}
              cloudProviderURLs={additionalProviders}
            />
          </Row>
        </Container>
      )}
    </>
  );
};

export default DeploymentTab;
