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
`;

const CheckTot = (props) => {
  let { onHide } = props;
  const pattern = /^[0-9]{10}$/;
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
                        <th>Participant Name </th>
                        <th>Age </th>
                        <th>Gender </th>
                        <th>Mobile no. </th>
                        <th>State </th>
                        <th>City </th>
                        <th>Designation </th>
                        <th>College Name</th>
                        <th>Project Name </th>
                        <th>Partner Department</th>
                        <th>Module Name</th>
                        <th>Start Date </th>
                        <th>End Date </th>
                        <th>Trainer 1 </th>
                        <th>Trainer 2 </th>
                        <th>Certificate Given </th>
                        <th>Project Type </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.notUploadedData.map((obj, i) => (
                        <tr key={i}>
                          <td>{obj.index}</td>
                          <td>{obj.user_name}</td>
                          <td className={!isNumber(obj.age)?"text-danger":""}>{ obj.age }</td>
                          <td>{obj.gender}</td>
                          <td className={!pattern.test(obj.contact) ? "text-danger":""}>{obj.contact}</td>
                          <td>{obj.state}</td>
                          <td>{obj.city}</td>
                          <td>{obj.designation}</td>
                          <td className={!obj.college ? "text-danger" : ""}>{
                            obj.college
                              ? obj.college
                              : "Please select from dropdown"
                          
                          }</td>
                          <td
                            className={obj.project_name?.notFound || !obj.project_name ? "text-danger" : ""}
                          >
                            {obj.project_name?.value
                              ? obj.project_name?.value
                              : obj.project_name
                              ? obj.project_name
                              : "Please select from dropdown"}
                          </td>
                          <td
                            className={obj.partner_dept.notFound ? "text-danger" : ""}
                          >
                            {obj.partner_dept?.value
                              ? obj.partner_dept?.value
                              : obj.partner_dept
                              ? obj.partner_dept
                              : "Please select from dropdown"}
                          </td>
                          <td
                            className={
                              obj.module_name.notFound ? "text-danger" : ""
                            }
                          >
                            {obj.module_name?.value
                              ? obj.module_name?.value
                              : obj.module_name
                              ? obj.module_name
                              : "Please select from dropdown"}
                          </td>
                          <td className={obj.start_date?.notFound || !obj.start_date ? "text-danger" : ""}>{obj.start_date.value ?obj.start_date.value :obj.start_date ?obj.start_date:"please add start date"}</td>
                          <td className={obj.end_date?.notFound || !obj.end_date ? "text-danger" : ""}>{obj.end_date.value ?obj.end_date.value :obj.end_date ?obj.end_date:"please add start date"}</td>
                          <td className={!obj.trainer_1 ? "text-danger" : ""}>
                            {obj.trainer_1
                              ? obj.trainer_1
                              : "Please select from dropdown"}
                          </td>
                          <td className={!obj.trainer_2 ? "text-danger" : ""}>
                            {obj.trainer_2
                              ? obj.trainer_2
                              : "Please select from dropdown"}
                          </td>
                          <td>{obj.certificate_given}</td>
                          <td
                            className={
                              obj.project_type.notFound ? "text-danger" : ""
                            }
                          >
                            {obj.project_type?.value
                              ? obj.project_type?.value
                              : obj.project_type
                              ? obj.project_type
                              : "Please select from dropdown"}
                          </td>
                          {/* <td>{obj.project_type}</td> */}
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
            <div className="d-flex align-content-center justify-content-between">
            <h6 className="text-danger">Error found !</h6>
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

export default CheckTot;
