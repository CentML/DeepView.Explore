import React from "react";
import Subheader from "../components/Subheader";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";

const GpuUtilization = ({ layers }) => {
  return (
    <>
      <div className="innpv-memory innpv-subpanel">
        <Subheader icon="database">GPU use by layer</Subheader>
        <div className="innpv-subpanel-content">
          {layers && layers.length === 0 ? (
            <Container fluid>
              <Row className="justify-content-md-center">
                <Card>
                  <Card.Body>
                    <Spinner animation="border" size="sm" /> Loading Information
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          ) : (
            <Container fluid className="mt-2 mb-2">
              <Row xs={2} sm={3} md={4}>
                {layers?.map((elem, idx) => {
                  return (
                    <Col key={`${elem["name"]}_${idx}`}>
                      <Card body className="mt-2 mb-2">
                        <div>
                          <ProgressBar variant="success" now={70} label="70%" />
                        </div>
                        <div>
                          {elem["name"] === "untracked" ? (
                            <p>
                              <span style={{ display: "block" }}>
                                Untracked
                              </span>
                              <span style={{ display: "block" }}>
                                Time: $
                                {Math.round(elem["total_time"] * 100) / 100} ms
                              </span>
                            </p>
                          ) : (
                            <p>
                              <span style={{ display: "block" }}>
                                {elem["name"]}
                              </span>
                              <span style={{ display: "block" }}>
                                Forward:{" "}
                                {Math.round(elem["forward_ms"] * 100) / 100} ms
                              </span>
                              <span style={{ display: "block" }}>
                                Backward:{" "}
                                {Math.round(elem["backward_ms"] * 100) / 100} ms
                              </span>
                            </p>
                          )}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Container>
          )}
        </div>
      </div>
    </>
  );
};

export default GpuUtilization;
