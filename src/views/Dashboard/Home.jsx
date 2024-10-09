import api from "../../../src/apis";
import { GET_STATE_METRICS, GET_AREA_METRICS, GET_DISTRICT_METRICS, GET_ALL_METRICS } from "../../graphql";
import {
  FaBlackTie,
  FaBriefcase,
  FaGraduationCap,
  FaClipboardCheck,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import InfoCards from "./components/InfoCards";
import { ProgramEnrollmentsChart, EmploymentConnectionsChart } from "../../components/content/DashboardCharts";
import TabPicker from "../../components/content/TabPicker";
// import WidgetUtilTab from "../../components/content/WidgetUtilTab";
import Collapsible from "../../components/content/CollapsiblePanels";
import Opportunities from "./components/Opportunities";
import Students from "./components/Students";
import ProgramEnrollments from "./components/ProgramEnrollments";
import { getMyDataMetrics } from "./components/DashboardActions";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const DashboardStyled = styled.div`
  .react-loading-skeleton {
    display: block;
  }

  @media (min-width: 1024px){
  .box-1 {
    width: 46%;
    margin-left:45px;
  }

  .box-2 {
    width: 46%;
    margin-right:25px;
    }
}

@media (min-width: 576px){
  .col-sm-12 {
    padding-bottom: 2px;
  }
  .mb-5 {
    margin-bottom: 1rem !important;
  }
}
`;

const Home = () => {
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const userId = Number(localStorage.getItem("user_id")) || 2;
  const state = localStorage.getItem('user_state');
  const area = localStorage.getItem('user_area');
  const [userState, setUserState] = useState({});

  useEffect(() => {
    clearState();
    switch(activeTab.key) {
      case "my_state":
        getMyStateMetrics();
        break;
      case "my_area":
        getMyAreaMetrics();
        break;
      case "all_medha":
        getMyAllMetrics();
        break;
      default:
        updateMyDataMetrics();
        break;
    }
  }, [activeTab]);

  const updateMyDataMetrics = async () => {
    setLoading(true);
    const myDataMetrics = {};
    await getMyDataMetrics(userId, 'registrations').then(data => {
      myDataMetrics['registrations'] = data.data.data.programEnrollmentsConnection.aggregate.count;
    });
    await getMyDataMetrics(userId, 'certifications').then(data => {
      myDataMetrics['certifications'] = data.data.data.programEnrollmentsConnection.aggregate.count;
    });
    await getMyDataMetrics(userId, 'internships').then(data => {
      myDataMetrics['internships'] = data.data.data.employmentConnectionsConnection.aggregate.count;
    });
    await getMyDataMetrics(userId, 'placements').then(data => {
      myDataMetrics['placements'] = data.data.data.employmentConnectionsConnection.aggregate.count;
    });

    setUserState(myDataMetrics);
    setLoading(false);
  }

  const getMyStateMetrics = async () => {
    setLoading(true);
    await api.post("/graphql", {
      query: GET_STATE_METRICS,
      variables: {
        state
      },
    })
    .then(data => {
      setUserState(data.data.data.metricsStates[0]);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const getMyAreaMetrics = async () => {
    setLoading(true);
    await api.post("/graphql", {
      query: GET_AREA_METRICS,
      variables: {
         area
      },
    })
    .then(data => {
      setUserState(data.data.data.metricsAreas[0]);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const getMyAllMetrics = async () => {
    setLoading(true);
    await api.post("/graphql", {
      query: GET_ALL_METRICS,
    })
    .then(data => {
      setUserState(data.data.data.metricsAlls[0]);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const clearState = () => {
    setUserState('');
  }

  return (
    <DashboardStyled className="container-fluid">
      {/* <Collapsible opened={true} title="My Key Metrics" id="keyMetrics">
        <div className="d-flex justify-content-between">
        
        </div>
        {isLoading ? (
          <div className="row mb-5">
            {[1, 2, 3, 4].map(i => (
              <div className="col-md-3 col-sm-12" key={i}>
                <Skeleton count={1} height={135} width="100%" />
              </div>
            ))}
          </div>
        ) : (
        <div className="row mb-5">
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="success"
              value={userState.registrations? userState.registrations :"0" }
              title="Registrations"
              icon={<FaClipboardCheck size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="danger"
              value={userState.certifications? userState.certifications :"0" }
              title="Certifications"
              caption={parseInt((userState.certifications / userState.registrations)* 100 || "0") + '% of Registrations'}
              icon={<FaGraduationCap size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="warning"
              value={userState.internships? userState.internships :"0" }
              title="Internships"
              caption={parseInt((userState.internships / userState.certifications) * 100 || "0") + "% of Certifications"}
              icon={<FaBlackTie size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="info"
              value={userState.placements? userState.placements :"0" }
              title="Placements"
              caption={parseInt((userState.placements / userState.certifications) * 100 || "0") + "% of Certifications"}
              icon={<FaBriefcase size={25} color={"white"} />}
            />
          </div>
        </div>
        )}
          <div className="row">
            <div className="box-1 col-sm-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <ProgramEnrollmentsChart />
                </div>
              </div>
            </div>
            <div className="box-2 col-sm-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <EmploymentConnectionsChart />
                </div>
              </div>
            </div>
          </div>
      </Collapsible> */}
      <Opportunities />
      <ProgramEnrollments/>
      <Students />
    </DashboardStyled>
  );
};

export default Home;
