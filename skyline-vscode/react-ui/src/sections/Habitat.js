import React from "react";
import Subheader from "../components/Subheader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import { HabitatScatterGraph } from "../components/ScatterGraph";

export default function Habitat({ habitatData }) {
  const habitatIsDemo = habitatData.find(
    (item) => item[0] === "demo" && item[1] === 1
  );
  if (habitatIsDemo) {
    return (
      <>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">Habitat</Subheader>
          <div className="innpv-subpanel-content">
            <Container fluid className="mt-2">
              <Row className="justify-content-md-center">
                <h6>The local GPU is not supported by DeepView.Predict</h6>
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  }

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
                    <Spinner animation="border" size="sm" /> Loading DeepView.Predict data
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          ) : (
            <HabitatScatterGraph habitatData={habitatData} height={500} />
          )}
        </div>
      </div>
    </>
  );
}
