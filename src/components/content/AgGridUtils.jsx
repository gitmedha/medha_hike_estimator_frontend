import moment from "moment";
import api from "../../apis";
import Avatar from "./Avatar";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SkeletonLoader from "./SkeletonLoader";
import { FaAngleDoubleDown } from "react-icons/fa";
import { GET_STUDENT_DETAILS } from "../../graphql";
import { FaAngleDoubleRight } from "react-icons/fa";
import ProgressBar from "@ramonak/react-progress-bar";

const styleObject = {
  height: "25px",
  display: "flex",
  marginTop: "7px",
  maxWidth: "200px",
  paddingLeft: "5px",
  paddingRight: "5px",
  borderRadius: "5px",
  alignItems: "center",
  letterSpacing: "0.5px",
  justifyContent: "center",
};

const colorRenderer = (value) => {
  const casedValue = value ? value.toLowerCase() : "";

  switch (casedValue) {
    case "enrollment ongoing":
      return {
        color: "#0AC1B6",
        backgroundColor: "#D2FFFC",
      };
    case "to be started":
      return {
        color: "#E9AD03",
        backgroundColor: "#FFE69E",
      };
    case "in progress":
      return {
        color: "#A5BC18",
        backgroundColor: "#E7FE5C",
      };
    case "completed":
      return {
        color: "#00ADEF",
        backgroundColor: "#D6F4FF",
      };
    case "discontinued":
      return {
        color: "#F84A00",
        backgroundColor: "#FFD2BF",
      };
    case "active":
      return {
        color: "#0EC62B",
        backgroundColor: "#B2FFBF",
        textTransform: "capitalize",
      };
    case "inactive":
      return {
        color: "#FF3737",
        backgroundColor: "#FFCDCD",
        textTransform: "capitalize",
      };
    case "government":
      return {
        color: "#3D29B6",
        backgroundColor: "#E7E3FF",
        textTransform: "capitalize",
      };
    case "iti":
      return {
        color: "#FCA600",
        backgroundColor: "#FFEAC1",
        textTransform: "capitalize",
      };
    case "private":
      return {
        color: "#62636C",
        backgroundColor: "#DCDCDC",
        textTransform: "capitalize",
      };
    default:
      return {};
  }
};

export const BadgeRenderer = ({ value }) => {
  return (
    <div
      className="text--sm latto-bold"
      style={{
        ...styleObject,
        ...colorRenderer(value),
      }}
    >
      {value}
    </div>
  );
};

export const AvatarRenderer = (props) => (
  <Avatar name={props.data.name} logo={props.data.logo} />
);

export const TableLink = ({ value, to }) => {
  return (
    <Link to={`/${to}/${value}`}>
      <FaAngleDoubleRight size={18} color={"#257b69"} />
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
  return <p>{node.rowIndex + 1}</p>;
};

export const ProgressRenderer = ({ value }) => (
  <div style={{ marginTop: "10px", paddingRight: "20px", paddingLeft: "20px" }}>
    <ProgressBar
      bgColor={"#5C4CBF"}
      completed={value ? value : 0}
      labelColor={value ? " #fff" : "#1C2833"}
      baseBgColor={value ? "#EEEFF8" : "#909497"}
    />
  </div>
);

export const cellStyle = {
  display: "flex",
  outline: "none",
  alignItems: "center",
  // flexDirection: "column",
  // justifyContent: "center",
  fontFamily: "Latto-Regular",
};
