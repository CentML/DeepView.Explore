import React from "react";

import Subheader from "../components/Subheader";
import { Container, Row,Spinner, Card } from "react-bootstrap";
import { HabitatScatterGraph } from "../components/ScatterGraph";

export default function Habitat({ habitatData }) {

  return (
    <>
      <div className="innpv-memory innpv-subpanel">
        <Subheader icon="database">Habitat</Subheader>
        <div className="innpv-subpanel-content">
          {habitatData.length === 0 ? (
            <Container fluid>
              <Row className="justify-content-md-center">
                <Card>
                  <Card.Body>
                    <Spinner animation="border" size="sm" /> Loading Habitat
                    predictions.
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          ):
          (
            <HabitatScatterGraph
              habitatData={habitatData}
              height={500}
            />
          )}
        </div>
      </div>
    </>
  );
}
