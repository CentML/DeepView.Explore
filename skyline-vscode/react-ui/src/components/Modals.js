import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const ProviderPanelModal = ({ errors }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <h6>
        There were some errors fetching data from the urls. Please see the
        <span onClick={handleShow} style={{color:'blue',textDecoration:'underline',cursor:'pointer'}}> List of Errors</span>
      </h6>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>List of Errors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors?.map((err, idx) => {
            return (
              <div key={idx}>
                <h6>{`Error message : ${err.msg}`}</h6>
                {err.code && <p>{`Error code: ${err.code}`}</p>}
                {err.invalidFields?.map((incorrectField, id) => {
                  return (
                    <div key={id}>
                      <h6>{incorrectField.field}</h6>
                      <p>{incorrectField.err}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
