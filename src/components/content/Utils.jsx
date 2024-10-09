import moment from "moment";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

import api from "../../apis";
import SkeletonLoader from "./SkeletonLoader";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FILE_UPLOAD, GET_STUDENT_DETAILS } from "../../graphql";
import { FaAngleDoubleRight } from "react-icons/fa";

const ProgressBarContainer = styled.div`
  span {
    font-size: 12px !important;
  }
`;

const badgeStyle = {
  height: "auto", // to fix overflowing issue
  display: "flex",
  padding: "4px 12px",
  // paddingLeft: "12px",
  // paddingRight: "12px",
  borderRadius: "5px",
  alignItems: "center",
  letterSpacing: "0.5px",
  justifyContent: "center",
};

export const Badge = ({ value, pickList = [] }) => {
  const config = pickList.filter((item) => {
    return (
      item.value.toLowerCase() ===
      (typeof value === "string" ? value.toLowerCase() : value)
    );
  });
  const badgeConfig = {
    color: config.length ? config[0]["text-color"] : "#000000",
    backgroundColor: config.length ? config[0]["highlight-color"] : "#FFFFFF",
    text: config.length ? config[0]["value"] : value,
  };
  return (
    <div className="d-flex align-items-center h-100">
      <div
        className="text--sm latto-bold"
        style={{
          ...badgeStyle,
          ...{
            color: badgeConfig.color,
            backgroundColor: badgeConfig.backgroundColor,
          },
        }}
      >
        {badgeConfig.text}
      </div>
    </div>
  );
};

export const TableRowDetailLink = ({ value, to }) => {
  return (
    <Link to={`/${to}/${value}`} className="d-flex align-items-center h-100">
      <FaAngleDoubleRight size={18} color={"#31B89D"} />
    </Link>
  );
};

export const StudentDetailsRenderer = (props) => {
  const [openModal, showModal] = useState(false);
  const toggleModal = () => showModal(!openModal);

  return (
    <div>
      <FaAngleDoubleDown size={20} color={"#257b69"} onClick={toggleModal} />
      {openModal && (
        <StudentModal
          show={openModal}
          onHide={toggleModal}
          student={{
            id: props.data.student.id,
            institute: props.data.institution.name,
            name: props.data.student.full_name,
          }}
        />
      )}
    </div>
  );
};

const StudentModal = (props) => {
  const [details, setDetails] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getStudentDetails();
    // eslint-disable-next-line
  }, []);

  const getStudentDetails = async () => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: GET_STUDENT_DETAILS,
        variables: {
          id: props.student.id,
        },
      });
      setDetails(data.data.student);
    } catch (err) {
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          {props.student.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="row px-3">
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Parents Name</p>
              <p>{details.name_of_parent_or_guardian}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Phone Number</p>
              <p>{details.phone}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Status</p>
              <p>{details.status}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">
                Date Of Birth
              </p>
              <p>{moment(details.date_of_birth).format("DD MMM YYYY")}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Category</p>
              <p>{details.category}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Email</p>
              <p>{details.email}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Gender</p>
              <p className="text-capitalize">{details.gender}</p>
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="text--primary latto-bold pb-0 mb-0">Institute</p>
              <p className="text-capitalize">{props.student.institute}</p>
            </div>
          </div>
        )}
        <div className="row mt-3 py-3">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={props.onHide}
              className="btn btn-secondary btn-regular mr-2"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const SerialNumberRenderer = ({ node }) => {
  return (
    <div className="h-100 d-flex align-items-center">
      <p
        className="mb-0"
        style={{ color: "#787B96", fontFamily: "Latto-Bold" }}
      >
        {node.rowIndex + 1}.
      </p>
    </div>
  );
};

export const TextRenderer = ({ value }) => {
  return (
    <div className="h-100 d-flex align-items-center">
      <p className="mb-0">{value}</p>
    </div>
  );
};

export const Anchor = (props) => {
  const { text, href, ...otherProps } = props;
  return (
    <div className="h-100 d-flex align-items-center">
      <a href={href} className="mb-0" style={{ color: "#00ADEF" }} {...otherProps}>
        {text}
      </a>
    </div>
  );
};

export const ProgressBarField = ({ value, failBelow = 75 }) => (
  <ProgressBarContainer>
    <ProgressBar
      bgColor={value < failBelow ? "#FF3A3A" : "#31B89D"}
      completed={value ? value : 0}
      labelColor={value ? "#fff" : "#1C2833"}
      baseBgColor={"#EEEFF8"}
    />
  </ProgressBarContainer>
);

export const cellStyle = {
  display: "flex",
  outline: "none",
  alignItems: "center",
  fontFamily: "Latto-Regular",
};

export const uploadFile = async (file) => {
  let formdata = new FormData();
  const queryString = {
    query: FILE_UPLOAD,
    variables: {
      file: null,
    },
  };

  formdata.append("operations", JSON.stringify(queryString));
  formdata.append(
    "map",
    JSON.stringify({
      0: ["variables.file"],
    })
  );

  formdata.append("0", file, file.name);

  return await api.post("/graphql", formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // await setFileUrl(urlPath(data.data.upload.url.substring(0)));
  // await setFileId(Number(data.data.upload.id));
};
