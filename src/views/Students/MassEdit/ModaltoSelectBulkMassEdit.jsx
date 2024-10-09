// import { Modal } from "bootstrap";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import ModalShowmassedit from "./ModalShowmassedit";
import MassEmployerUpload from "./MassEmployerUpload";
import ModalMassEdit from "./ModalMassEdit";

const ModaltoSelectBulkMassEdit = (props) => {
  const {AddCheck,EditCheck}=props
  const [SelectedOption, setSelectedOption] = useState("");
  const [bulkAddCheck, setBulkAddCheck] = useState(AddCheck);
  const [massEditCheck, setMassEditCheck] = useState(EditCheck);


  useEffect(()=>{
    setBulkAddCheck(false);
    setMassEditCheck(false)
  },[])
  const handelClick = () => { 
    if(SelectedOption){
      if (SelectedOption == "bulkAdd") {
        setBulkAddCheck(true);
        setMassEditCheck(false);
      } if(SelectedOption =="massEdit") {
        setMassEditCheck(true);
        setBulkAddCheck(false);
      }
    }
    
  };

  const closeBulkAdd =()=>{
    setBulkAddCheck(false)
    setMassEditCheck(false)
  }

  // console.log("BulkAddCheck",bulkAddCheck)
  // console.log("massEditCheck",massEditCheck);
  return (
    <Modal
      centered
      size="lg"
      responsive
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal py-5"
    >
      {(!bulkAddCheck && !massEditCheck) ? (
        <div className="py-5 px-5">
          <label className="text--primary latto-bold text-center">
            Select{" "}
          </label>
          <Select
            options={[
              { value: "bulkAdd", label: "Bulk Add" },
              { value: "massEdit", label: "Mass Edit" },
            ]}
            className="basic-single"
            classNamePrefix="select "
            onChange={(e) => {
              setSelectedOption(e.value);
            }}
            // defaultValue={colourOptions[0]}
            // isDisabled={isDisabled}
            // isLoading={isLoading}
            // isClearable={isClearable}
            // isRtl={isRtl}
            // isSearchable={isSearchable}
            name="color"
          />

          <div className="row justify-content-end mt-4">
            <div className="col-auto p-0">
              <button
                type="button"
                onClick={props.onHide}
                className="btn btn-secondary btn-regular collapse_form_buttons"
              >
                CANCEL
              </button>
            </div>
            <div className="col-auto p-0">
              <button
                onClick={handelClick}
                disabled={SelectedOption?.length === 0}
                className="btn btn-primary btn-regular collapse_form_buttons"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : bulkAddCheck ? (
        <>
          <ModalShowmassedit 
            onHide={()=>{
              setSelectedOption([])
              setBulkAddCheck(false)}}
            show={bulkAddCheck}
            type={"Bulk"}
            data={props.data}
            handelSubmitMassEdit={props.handelSubmitMassEdit}
            uploadAlumniData={props.uploadAlumniData}
            uploadData={props.uploadData}
          />
        </>
      ) : massEditCheck ?(
        <>

          <ModalMassEdit 
            onHide={()=>{
              setMassEditCheck(false)
              setSelectedOption([])
            }}
            show={massEditCheck}
            type={"Bulk"}
            data={props.data}
            handelSubmitMassEdit={props.handelSubmitMassEdit}
            uploadAlumniData={props.uploadAlumniData}
            uploadData={props.uploadData}
          />
        </>
      ) :""}

      {/* {bulkAddCheck ? <div>Bulk Add</div> :<div>Mass Edit</div>} */}
    </Modal>
  );
};

export default ModaltoSelectBulkMassEdit;
