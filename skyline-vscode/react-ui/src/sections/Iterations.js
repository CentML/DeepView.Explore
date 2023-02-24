import React, { useState } from "react";
import { Row, Col, Button, Form, FloatingLabel } from "react-bootstrap";
import styled from "styled-components";
import { numberFormat } from "../utils/utils";

const Iterations = ({ setNumIterations }) => {
  const [iterations, setIterations] = useState({
    epochs: 50,
    iterPerEpoch: 2000,
  });
  const [message, setMessage] = useState(null);
  const [estimation, setEstimation] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (!value) {
      setIterations((prevState) => ({ ...prevState, [name]: 0 }));
      return;
    }
    const val = parseFloat(value);

    if (Number.isInteger(val)) {
      setIterations((prevState) => ({ ...prevState, [name]: val }));
      setMessage(null);
    } else {
      setMessage("You must only use integer numbers");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      iterations.epochs &&
      Number.isInteger(iterations.epochs) &&
      iterations.iterPerEpoch &&
      Number.isInteger(iterations.iterPerEpoch)
    ) {
      if (iterations.epochs * iterations.iterPerEpoch >= 1e21) {
        setMessage("The total number of iterations should be less than 1e21");
      } else {
        setEstimation(true);
        setNumIterations(iterations.epochs * iterations.iterPerEpoch);
        setMessage(null);
        setTimeout(() => {
          setEstimation(false);
        }, 2000);
      }
    }
  };

  return (
    <>
      <Wrapper>
        <div className="innpv-memory innpv-subpanel">
          <div className="innpv-subpanel-content">
            <Form onSubmit={handleSubmit} className="mt-2">
              <Row>
                <h5>Training Schedule</h5>
                <Col>
                  <FloatingLabel label="Number of Epochs" className="mb-3">
                    <Form.Control
                      type="text"
                      name="epochs"
                      aria-describedby="warningMessage"
                      value={iterations.epochs}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel
                    label="Number of iterations per epoch"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="iterPerEpoch"
                      aria-describedby="warningMessage"
                      value={iterations.iterPerEpoch}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                 
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Text className="iterations-text">
                      Total number of iterations:{" "}
                      {numberFormat(
                        iterations.epochs * iterations.iterPerEpoch
                      )}
                    </Form.Text>
                  </Form.Group>
                  {message && (
                    <Form.Text
                      id="warningMessage"
                      className="warning-message text-danger"
                    >
                      {message}
                    </Form.Text>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mt-1">
                    <Button variant="outline-primary" type="submit">
                      {estimation ? "processing" : "submit"}
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.main`
  .warning-message {
    font-size: 14;
    font-weight: 700;
    color: "red";
  }
  .iterations-text {
    font-size: 14;
    font-weight: 700;
  }
`;

export default Iterations;