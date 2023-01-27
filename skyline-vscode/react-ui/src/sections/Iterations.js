import React, { useState } from "react";
import { Button, Form, FloatingLabel } from "react-bootstrap";

const Iterations = ({ setNumIterations }) => {
  const [iterations, setIterations] = useState({
    epochs: 100,
    iterPerEpoch: 100,
  });
  const [message, setMessage] = useState(null);
  const [estimation, setEstimation] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (!value) {
      setIterations((prevState)=>({ ...prevState, [name]: 0 }));
      return;
    }
    const val = parseFloat(value);

    if (Number.isInteger(val)) {
      setIterations((prevState)=>({ ...prevState, [name]: val }));
      setMessage(null);
    } else {
      setMessage("Your must only use integer numbers");
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
        if(iterations.epochs * iterations.iterPerEpoch>=1e21){
            setMessage("The total number of iterations should be less than 1e21");
        }
      else{
        setEstimation(true);
        setNumIterations(iterations.epochs * iterations.iterPerEpoch);
        setMessage(null);
        setTimeout(()=>{setEstimation(false)},2000);
      }
    }
  };

  return (
    <>
      <div className="innpv-memory innpv-subpanel">
        <div className="innpv-subpanel-content">
          <Form onSubmit={handleSubmit} className="mt-2">
            <h5>Training Schedule</h5>
            <FloatingLabel label="Number of Epochs" className="mb-3">
              <Form.Control
                type="text"
                name="epochs"
                aria-describedby="warningMessage"
                value={iterations.epochs}
                onChange={handleChange}
              />
            </FloatingLabel>
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
            {message && (
              <Form.Text id="warningMessage" muted>
                {message}
              </Form.Text>
            )}
            <Form.Group className="mb-2">
              <Form.Text>
                Total number of iterations:{" "}
                {iterations.epochs * iterations.iterPerEpoch}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mt-1">
              <Button variant="outline-primary" type="submit">
                {estimation ? 'processing':'submit'}
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Iterations;
