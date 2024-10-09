import React from "react";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import styled from "styled-components";
import { isNumber } from "lodash";

const Style = styled.div`
  overflow-x: auto;
  // width: 120%;

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  td {
    width: 250px !important;
  }
  overflow: hidden;
  .border-danger{
    border-color: 5px solid red;
  }
`;

const CheckValuesOpsUploadedData = (props) => {
  let { onHide } = props;
  return (
    <>
      <Modal
        centered
        size="xl"
        show={props.show}
        onHide={onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal "
        id="custom-modal"
        // dialogClassName="fullscreen-modal"
      >
        <Modal.Header className="bg-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex align-items-center"
          >
            <h1 className="text--primary bebas-thick mb-0">
              <p> Data Validation Failures</p>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Style>
          <Modal.Body className="bg-white hide-scrollbar">
            <div style={{ width: "100%", height: "450px", overflow: "scroll" }}>
              {props.notUploadedData.length > 0 ? (
                <>
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Assigned To</th>
                        <th>Activity Type</th>
                        <th>Institution</th>
                        <th>State</th>
                        <th>Medha Area</th>
                        <th>Batch Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Session Topic</th>
                        <th>Project Funder</th>
                        <th>Guest Name</th>
                        <th>Guest Designation</th>
                        <th>Organization</th>
                        <th>No. of Participant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.notUploadedData.map((obj, i) => (
                        <tr key={i}>
                          <td>{obj.index}</td>
                          <td className={obj.assigned_to.notFound ?"text-danger":""}>{obj.assigned_to.notFound ? obj.assigned_to.value:obj.assigned_to}</td>
                          <td>{obj.activity_type}</td>
                          <td className={obj.institution.notFound ?"text-danger":""}>{obj.institution.notFound ?obj.institution.value :obj.institution}</td>
                          <td>{obj.state}</td>
                          <td>{obj.area}</td>
                          <td className={obj.batch.notFound ?"text-danger":""}>{obj.batch.notFound ? obj.batch.value :obj.batch}</td>
                          <td className={obj.start_date.notFound ?"text-danger":""}>{obj.start_date.notFound ? obj.start_date.value:obj.start_date}</td>
                          <td className={obj.end_date.notFound ?"text-danger":""}>{obj.end_date.notFound ?obj.end_date.value:obj.end_date}</td>
                          <td>{obj.topic}</td>
                          <td>{obj.donor}</td>
                          <td>{obj.guest}</td>
                          <td>{obj.designation}</td>
                          <td>{obj.organization}</td>
                          <td className={isNumber(obj.students_attended)?"":"text-danger" }>{obj.students_attended}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <div className="d-flex justify-content-center align-content-center">
                  <h2 className="text--primary bebas-thick mb-0"></h2>
                </div>
              )}
              
            </div>
            <div className="">
            <h6 className="text-danger text-center">There are 1 or more incorrect data in the excel. Please correct the ones shown in red and reupload the file</h6>
            {(isSRM() || isAdmin()) && (
            <div className="row mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                {props.notUploadedData.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => props.uploadExcel(props.excelData)}
                    className="btn btn-primary px-4 "
                  >
                    Upload
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary px-4 "
                    onClick={() => onHide()}
                  >
                    ReUpload
                  </button>
                )}
              </div>
            </div>

          )}
          <div/>
          </div>
          </Modal.Body>
         
        </Style>
      </Modal>
    </>
  );
};

export default CheckValuesOpsUploadedData;
