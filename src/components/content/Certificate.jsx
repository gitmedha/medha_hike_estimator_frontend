import api from "../../apis";
import Tooltip from "./Tooltip";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import FileUploader from "./FileUploader";
import { FaUpload } from "react-icons/fa";

import { connect } from "react-redux";
import { setAlert } from "../../store/reducers/Notifications/actions";

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export const CertificateUpload = connect(
  mapStateToProps,
  mapActionsToProps
)(({ certificate, title, done, query, id, setAlert }) => {
  const [modalShow, setModalShow] = useState(false);

  const modalCloseHandler = async (CertificateId) => {
    try {
      if (typeof CertificateId === "object" || CertificateId === undefined) {
        setModalShow(false);
        return;
      }
      let data = {experience_certificate: CertificateId};

      if (certificate) {
        data =  { [certificate]: CertificateId };
      }
      await api.post("/graphql", {
        query,
        variables: {
          data: data,
          id,
        },
      });
      setAlert("Certificate updated successfully.", "success");
      setModalShow(false);
      done();
    } catch (err) {
      setAlert("Unable to update the Certificate.", "error");
    }
  };

  return (
    <div className=" justify-content-start mb-2">
      {certificate && (
        <Tooltip placement="top" title="Click Here to upload file">
          <a href="#" className="menu_links" onClick={() => setModalShow(true)}>
            {" "}
            <FaUpload size="25" color="207B69" />{" "}
          </a>
        </Tooltip>
      )}

      <h1 className="bebas-thick text--primary mr-3 align-self-center mt-2">
        {title}
      </h1>
      <CertificateModal show={modalShow} onHide={modalCloseHandler} />
    </div>
  );
});

const CertificateModal = (props) => {
  let { onHide } = props;
  const [CertificateId, setFile] = useState(null);
  const handler = (data) => setFile(data.id);
  const updateFile = () => onHide(CertificateId);

  return (
    <Modal
      centered
      size="lg"
      {...props}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Upload File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div
          style={{ width: "100%", height: "270px" }}
          className="flex-row-centered"
        >
          <FileUploader handler={handler} />
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <button className="btn btn-secondary btn-regular" onClick={onHide}>
          CANCEL
        </button>
        <button className="btn btn-primary btn-regular" onClick={updateFile}>
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificateUpload;
