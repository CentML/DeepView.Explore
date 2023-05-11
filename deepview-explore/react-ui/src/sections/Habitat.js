import React from "react";
import Subheader from "../components/Subheader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import { HabitatScatterGraph } from "../components/ScatterGraph";
import { useSelector } from "react-redux";

export default function Habitat() {
  const {analysisState} = useSelector((state) => state.analysisStateSliceReducer);
  const habitatData = analysisState["habitat"];
  const habitatIsDemo = habitatData.predictions?.find(
    (item) => item[0] === "demo" && item[1] === 1
  );
  if (habitatData.error) {
    return (
      <>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">DeepView.Predict</Subheader>
          <div className="innpv-subpanel-content">
            <Container fluid className="mt-2">
              <Row className="justify-content-md-center">
                <h6>There was an error generating Deepview Predictions</h6>
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  }
  if (habitatIsDemo) {
    return (
      <>
        <div className="innpv-memory innpv-subpanel">
          <Subheader icon="database">DeepView.Predict</Subheader>
          <div className="innpv-subpanel-content">
            <Container fluid className="mt-2">
              <Row className="justify-content-md-center">
                <h6>
                  The local GPU is not supported by DeepView.Predict or
                  DeepView.Predict is not installed
                </h6>
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
        <Subheader icon="database">DeepView.Predict</Subheader>
        <div className="innpv-subpanel-content">
          {Object.keys(habitatData).length === 0 ? (
            <Container fluid>
              <Row className="justify-content-md-center">
                <Card>
                  <Card.Body>
                    <Spinner animation="border" size="sm" /> Loading
                    DeepView.Predict data
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          ) : (
            <HabitatScatterGraph
              habitatData={[...habitatData["predictions"]]}
              height={500}
            />
          )}
        </div>
      </div>
    </>
  );
}
