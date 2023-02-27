import React from "react";
import Subheader from "../components/Subheader";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
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
