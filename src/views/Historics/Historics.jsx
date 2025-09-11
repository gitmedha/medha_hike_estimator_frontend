import nProgress from "nprogress";
import { useState, useMemo, useCallback, useEffect } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import toaster from "react-hot-toast";
import api from "../../apis";
import { connect } from "react-redux";
import SearchBar from "../../components/layout/SearchBar";
import { searchHistorics, LoadSearchPicklist, downloadTableExcel } from "./HistoricComponents/HistoricActions";
import HistoricForm from "./HistoricComponents/HistoricForm";
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { setAlert } from "../../store/reducers/Notifications/actions";
import UploadExcel from "../../components/layout/UploadExcel";
const Historics = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [employersAggregate, setEmployersAggregate] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const isAdmin = localStorage.getItem('admin');
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [showUploadExcelInput, setShowUploadExcelInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Search related state
  const [searchParams, setSearchParams] = useState({
    isActive: false,
    field: null,
    value: null
  });

  const columns = useMemo(
    () => [
      {
        Header: "Employee",
        accessor: "employee",
      },
      {
        Header: "Reviewer",
        accessor: "reviewer",
      },
      {
        Header: "KRA",
        accessor: "kra_vs_goals",
      },
      {
        Header: "Competency",
        accessor: "competency",
      },
      {
        Header: "Average",
        accessor: "final_score",
      },
      {
        Header: "Start Month",
        accessor: "start_month",
      },
      {
        Header: "Ending Month",
        accessor: "ending_month",
      },
    ],
    []
  );

  const optionsForSearch = [
    { label: "Employee", value: "employee", key: 0 },
    { label: "Reviewer", value: "reviewer", key: 1 },
    { key: 2, label: "Kra", value: "kra_vs_goals" },
    { key: 3, label: "Competency", value: "competency" },
    { key: 4, label: "Average", value: "final_score" },
    { key: 5, label: "Start Month", value: "start_month" },
    { key: 6, label: "Ending Month", value: "ending_month" }
  ];

  const getEmployers = useCallback(async (limit, offset, sortBy, sortOrder) => {
    nProgress.start();
    setLoading(true);
    try {
      const params = {
        limit,
        offset,
        sortBy,
        sortOrder
      };

      if (searchParams.isActive && searchParams.field) {
        params.searchField = searchParams.field;
        
        if (searchParams.field === "start_month" || searchParams.field === "ending_month") {
          if (typeof searchParams.value === 'object') {
            params.from = searchParams.value.from;
            params.to = searchParams.value.to;
          } else {
            params.searchValue = searchParams.value;
          }
        } else {
          params.searchValue = searchParams.value;
        }
      }

      const data = await api.get('/api/historical_data/get_historical_data', { params });
      if (data.status === 200) {
        setEmployers(data?.data?.data);
        setEmployersAggregate(data?.data?.total);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
      toaster.error("Failed to load historical data");
    } finally {
      setLoading(false);
      nProgress.done();
    }
  }, [searchParams]);

  const fetchData = useCallback(
    (pageIndex, pageSize, sortBy) => {
      let sortByField = "employee";
      let sortOrder = "asc";

      if (sortBy.length) {
        sortByField = sortBy[0].id;
        sortOrder = sortBy[0].desc ? "desc" : "asc";
      }

      const offset = pageIndex * pageSize;
      getEmployers(pageSize, offset, sortByField, sortOrder);
    },
    [getEmployers]
  );

  const search = async (SearchProps) => {
    try {
      setSearchParams({
        isActive: true,
        field: SearchProps.searchField,
        value: (SearchProps.from && SearchProps.to) 
          ? { from: SearchProps.from, to: SearchProps.to }
          : SearchProps.searchValue
      });
      
      // Reset to first page when searching
      setPaginationPageIndex(0);
    } catch (error) {
      console.error("Search error:", error);
      toaster.error("Search failed");
    }
  };

  const clearSearch = () => {
    setSearchParams({
      isActive: false,
      field: null,
      value: null
    });
    setPaginationPageIndex(0);
  };

  const loadDefaultOptions = async (dropDownField) => {
    const searchPickList = await LoadSearchPicklist(dropDownField);
    return searchPickList;
  };

  const onFailure = () => {
    toaster.error("Failed to create historic data", { position: "bottom-center" });
  };

  const onSuccess = () => {
    toaster.success("Created the historic data successfully!", { position: "bottom-center" });
    fetchData(paginationPageIndex, paginationPageSize, []);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toaster.error("No file selected!", { position: "bottom-center" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      nProgress.start();
      const response = await api.post("/api/historical_data/upload_excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toaster.success("File uploaded successfully!", { position: "bottom-center" });
        fetchData(0, paginationPageSize, []);
      } else {
        toaster.error("File upload failed!", { position: "bottom-center" });
      }
    } catch (error) {
      toaster.error("File upload failed!", { position: "bottom-center" });
    } finally {
      nProgress.done();
      setShowUploadExcelInput(false);
      setSelectedFile(null);
    }
  };

  const onRowClick = (row) => {
    history.push(`/historic/${row.id}`);
  };

  useEffect(() => {
    fetchData(0, paginationPageSize, []);
  }, [fetchData, paginationPageSize]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-2">
        <div className="col">
          <SearchBar
            searchFieldOptions={optionsForSearch}
            searchValueOptions={[]}
            handleSearch={search}
            handleSearchPicklist={loadDefaultOptions}
            isDisable={!searchParams.isActive}
            turnSearchOff={clearSearch}
            storeField={(e) => setSearchParams(prev => ({...prev, field: e}))}
            storeValue={(e) => setSearchParams(prev => ({...prev, value: e}))}
          />
        </div>
        {isAdmin === "true" && (
          <div className="col-4 d-flex justify-content-end mt-4">
            <Dropdown className="d-inline" style={{marginRight: '10px'}}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="bulk_action_button_sec">
                ACTIONS
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowUploadExcelInput(true)} className="d-flex align-items-center">
                  Upload Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => downloadTableExcel()}>
                  Download Excel
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button
              className="btn btn-primary add_button_sec ml-2"
              onClick={() => setModalShow(true)}
            >
              Add New
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: "0 17px" }}>
        <Table
          columns={columns}
          data={employers}
          totalRecords={employersAggregate}
          fetchData={fetchData}
          loading={loading}
          paginationPageSize={paginationPageSize}
          onPageSizeChange={setPaginationPageSize}
          paginationPageIndex={paginationPageIndex}
          onPageIndexChange={setPaginationPageIndex}
          isSearchEnable={searchParams.isActive}
          onRowClick={onRowClick}
        />
      </div>
      {modalShow && (
        <HistoricForm
          show={modalShow}
          onHide={() => setModalShow(false)}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      )}
      {showUploadExcelInput &&  (
       <UploadExcel
        expectedColumns={[
          "Employee",
          "Reviewer",
          "KRA vs Goals",
          "Competency",
          "Final Score",
          "Start Month",
          "Ending Month"
        ]}
        colMapping={{
          "Employee": "employee",
          "Reviewer": "reviewer",
          "KRA vs Goals": "kra_vs_goals",
          "Competency": "competency",
          "Final Score": "final_score",
          "Start Month": "start_month",
          "Ending Month": "ending_month"
        }}
        validationRules={{
          "Employee": (val) => !!val && typeof val === "string",

          "Reviewer": (val) => !!val && typeof val === "string",

          "KRA vs Goals": (val) => {
            if (val === "" || val === null) return true; // optional
            return !isNaN(parseFloat(val)) || "KRA vs Goals must be a number";
          },

          "Competency": (val) => {
            if (val === "" || val === null) return true; // optional
            return !isNaN(parseFloat(val)) || "Competency must be a number";
          },

          "Final Score": (val, row) => {
            if (val === "" || val === null) return "Final Score cannot be empty";

            const kra = parseFloat(row["kra_vs_goals"]) || 0;
            const comp = parseFloat(row["competency"]) || 0;
            const expected = (kra + comp) / 2;
            const actual = parseFloat(val);
            if (expected !== actual) {
              return `Final Score must be the average of KRA and Competency (${expected})`;
            }

            return true;
          },
          "Start Month": (val) => {
            console.log("Validating Start Month:", val);
  const regex = /^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s\d{4}$/i;
  return regex.test(val?.trim()) || "Start Month must be in 'MMM YYYY' or 'MMMM YYYY' format";
},

"Ending Month": (val, row) => {
  const regex = /^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s\d{4}$/i;
  if (!regex.test(val?.trim())) return "Ending Month must be in 'MMM YYYY' or 'MMMM YYYY' format";

  if (row["start_month"]) {
    const start = new Date(row["start_month"]);
    const end = new Date(val);

    if (!isNaN(start) && !isNaN(end) && start > end) {
      return "Ending Month must be later than Start Month";
    }
  }
  return true;
}

        }}

        uploadApi="/api/historical_data/upload_excel"
        onValidData={(valid) => console.log("Valid rows:", valid)}
        onInvalidData={(invalid) => console.log("Invalid rows:", invalid)}
        refreshData={() => fetchData(paginationPageIndex, paginationPageSize, [])}
        onClose={() => setShowUploadExcelInput(false)}
        title="Upload Historical Data"
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Historics);