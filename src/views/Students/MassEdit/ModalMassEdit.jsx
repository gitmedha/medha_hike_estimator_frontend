import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import api from "../../../apis";
import { connect } from "react-redux";
import MassEdit from "../MassEdit/MassEdit";
import MassEmployerUpload from "../MassEdit/MassEmployerUpload";
import AlumMassEdit from "./AlumMassEdit";
import EmploymentmassEdit from "./EmploymentmassEdit";

const Styled = styled.div`
  .cont {
    position: absolute;
    right: 0;
    top:10px;
  }
  .cross {
    border: none;
    background: none;
  }
`;

const ModalMassEdit = (props) => {
  let { onHide, show } = props;
  const [modalmassEditShow1, setModalShow1] = useState(false);
  const [modalmassEditShow2, setModalShow2] = useState(false);


  const HideMassEmployeCreateModal = async (data) => {
    if (data.length == 0) {
      // return ;
      setAlert("Unable to create Employment Connection Data.", "error");
    } else {
      try {
        const response = await api.post(
          "/employment-connections/createBulkEmploymentConnection",
          data
        );
        setAlert("Employment Connection data created successfully.", "error");
      } catch (error) {
        setAlert("Unable to create Employment Connection Data.", "error");
      }
    }
  };
 

  const hideMassCreateModal = async (data) => {
    if (data.length == 0) {
      setAlert("Unable to create Alumni Data.", "error");
    } else {
      try {
        const response = await api.post(
          "/alumni-services/createBulkAlumniServices",
          data
        );
        setAlert("Alumni data created successfully.", "success");
      } catch (error) {
        setAlert("Unable to create Alumni Data.", "error");
      }
    }
  };
  const handleMassemployer = () => {
    setModalShow2(!modalmassEditShow2);
    // // onHide();
    // setModalShow1(!modalmassEditShow1)
  };
  const handleMassAlumuni = (data) => {
    setModalShow1(!modalmassEditShow1);
    // onHide();
  };

  const uploadData = (data) => {
    props.uploadData(data);
    // handleMassemployer();
  };

  const uploadAlumniData = (data) => {
    props.uploadAlumniData(data);
  };

  const handelSubmit = (data, key) => {
    props.handelSubmitMassEdit(data, key);
  };


  // console.log(modalmassEditShow1)
  // console.log(modalmassEditShow2);

  return (
    <div>
      <Modal
        centered
        size="lg"
        show={show}
        onHide={onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
      >
        <Modal.Header
          id="example-custom-modal-styling-title"
          className="bg-white"
        >
          <Modal.Title id="contained-modal-title-vcenter" className="d-flex ">
            <Styled>
              <div className="row justify-content-between align-items-center">
                <div className="col-auto">
                  <h1 className="text--primary bebas-thick mb-0">
                    Please select one option to Bulk Edit
                  </h1>
                </div>

                <div className="col-auto cont">
                  <button onClick={()=>props.onHide()} className="cross">
                    <FaTimes />
                  </button>
                </div>
              </div>
            </Styled>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white" >
          <div className="d-flex justify-content-around align-items-center " style={{ minHeight: "150px" }}>
            <div
              role="button"
              onClick={handleMassAlumuni}
              className="btn mass_edit_bottons "
            >
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="100" width="100" xmlns="http://www.w3.org/2000/svg"><path d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"></path></svg>
              <p>Alumni Engagement </p>
            </div>
            <div
              role="button"
              onClick={handleMassemployer}
              className="btn mass_edit_bottons"
            >
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="100" width="100" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z"></path></svg>
              
              <p>Employment Connection</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

   {modalmassEditShow1 ? <AlumMassEdit
        // data={props.data}
        show={modalmassEditShow1}
        onHide={handleMassAlumuni}
        uploadData={hideMassCreateModal}
        uploadAlumniData={uploadAlumniData}
        handelSubmitMassEdit={props.handelSubmitMassEdit}
      /> :"" }
            
      {modalmassEditShow2 ? <EmploymentmassEdit
        data={props.data}
        show={modalmassEditShow2}
        onHide={handleMassemployer}
        uploadData={uploadData}
        handelSubmitMassEdit={handelSubmit}
        // onHide={HideMassEmployeCreateModal}
      /> :""}
       
      
        

    
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(ModalMassEdit);
