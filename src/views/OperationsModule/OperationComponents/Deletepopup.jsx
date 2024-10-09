import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Deletepopup = (props) => {
    const handleClose = () => props.setShowModal();

  return (
    <>
      <Modal show={true} className='' >
        <Modal.Header >
          <Modal.Title className=' text-heading text--xl'>Are you sure you want to delete?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={()=>props.deleteEntry()} >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Deletepopup
