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

export const FileUpload = connect(
  mapStateToProps,
  mapActionsToProps
)(({ file, title, done, mapFileToEntity, setAlert }) => {
  const [modalShow, setModalShow] = useState(false);

  const modalCloseHandler = async (fileId) => {
    try {
      if (typeof fileId === "object" || fileId === undefined) {
        setModalShow(false);
        return;
      }

      // update resource with uploaded file id
      await mapFileToEntity(fileId);
      setAlert("File updated successfully.", "success");
      setModalShow(false);
      done();
    } catch (err) {
      setAlert("Unable to update the file.", "error");
    }
  };

  return (
    <div className="justify-content-start">
      {!file && (
        <Tooltip placement="top" title="Click Here to Upload">
        <a  href="#" className="menu_links" onClick={() => setModalShow(true)}> <FaUpload size="27" color='207B69' /> </a>
        </Tooltip>
      )}

      <h1 className="bebas-thick text--primary align-self-center m-0">
        {title}
      </h1>
      <FileUploadModal show={modalShow} onHide={modalCloseHandler} />
    </div>
  );
});

const FileUploadModal = (props) => {
  let { onHide } = props;
  const [fileId, setFileId] = useState(null);
  const handler = (data) => setFileId(data.id);
  const updateFile = () => onHide(fileId);

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
          Update File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div
          style={{ width: "100%", height: "200px" }}
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

export default FileUpload;
