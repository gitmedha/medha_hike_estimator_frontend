import React from "react";
import styled from 'styled-components';
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";

import Pagination from "../../../components/content/Pagination";
import { FaAngleDoubleDown} from "react-icons/fa";
import { urlPath } from "../../../constants";
import DetailField from "../../../components/content/DetailField";

const Styles = styled.div`
  display: flex;
  flex-wrap: wrap;

  .box {
    width: 100%;
    height: 180px;
    position: relative;
    display: flex;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;

    .title-box {
      position: absolute;
      background: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 50%);
      height: 100%;
      width: 100%;
      display: flex;
      align-items: flex-end;


      .title {
        padding: 8px;
        color: white;
        font-family: 'Latto-Bold';
        font-size: 14px;
        line-height: 1.25;
      }
    }
  }

  .box-icon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px 5px 5px 5px;
  }

  .box-line-active {
    height: 25px;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .box-line {
    width: 100%;

    .box-line-upper {
      width: 100%;
      height: 8px;
      display: flex;
      .complete {
        background-color: #31B89D;
        height: 100%;
      }
      .incomplete {
        background-color: #C4C4C4;
        height: 100%;
      }
    }
    .box-line-lower {
      height: calc(35px - 8px);
      background-color: white;
    }
  }

  .box-line-active {
    height: 35px;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: #31B89D;
  }

  .box-wrapper {
    margin-left: 10px;
    margin-right: 10px;
    width: 135px;

    &.active {
      .box-line {
        display: none;
      }
      .box-line-active {
        display: flex;
      }
    }
  }

  .btn-cv-view {
    font-size: 14px;
    line-height: 1.25;
    padding: 5px 8px;
  }

  .box-details {
    border-top: 4px solid #31B89D;
    border-bottom: 4px solid #31B89D;
    padding: 15px 30px 0;
    width: 100%;
    margin-bottom: 30px;
  }
  .btn-view-more {
    background-color: #31B89D;
    font-family: 'Latto-Bold';
    padding-left: 15px;
    padding-right: 15px;
  }

  .cv-updated-on {
    font-family: 'Latto-Italic';
    font-weight: 300;
    font-size: 14px;
    line-height: 1.25;
    color: #787B96;
  }

  @media screen and (min-width: 768px) {
    //
  }
`

const StudentGrid = ({ isSidebarOpen, data, fetchData, totalRecords, loading, onRowClick=null, indexes=true, paginationPageSize, onPageSizeChange, paginationPageIndex, onPageIndexChange }) => {
  const [activeBoxRow, setActiveBoxRow] = React.useState(0);
  const [activeItem, setActiveItem] = React.useState({});
  const [activeBox, setActiveBox] = React.useState(0);
  const [boxesInRow, setBoxesInRow] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(isSidebarOpen);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(paginationPageSize);

  const history = useHistory();

  React.useLayoutEffect(() => {
    function updateSize() {
      handleResetActive();
      if (!isSidebarOpen) {
        if (window.innerWidth >= 1400) { setBoxesInRow(8); }
        else if (window.innerWidth >= 1200) { setBoxesInRow(7); }
        else if (window.innerWidth >= 1034) { setBoxesInRow(6); }
        else if (window.innerWidth >= 992) { setBoxesInRow(5); }
        else if (window.innerWidth >= 768) { setBoxesInRow(4); }
        else if (window.innerWidth >= 489) { setBoxesInRow(3); }
        else { setBoxesInRow(2); }
      } else {
        if (window.innerWidth >= 1539) { setBoxesInRow(8); }
        else if (window.innerWidth >= 1384) { setBoxesInRow(7); }
        else if (window.innerWidth >= 1229) { setBoxesInRow(6); }
        else if (window.innerWidth >= 1074) { setBoxesInRow(5); }
        else if (window.innerWidth >= 919) { setBoxesInRow(4); }
        else if (window.innerWidth >= 768) { setBoxesInRow(3); }
        else { setBoxesInRow(2); }
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
  }, []);

  const handleBoxClick = boxNumber => {
    if(activeBox!= boxNumber) {
      if (boxNumber > Math.floor(data.length/boxesInRow)*boxesInRow) {
        // box is in last row
        // set active box row to the last box index
        setActiveBoxRow(data.length);
      } else {
        // set active box row to the last box index in that row
        setActiveBoxRow(Math.ceil(boxNumber/boxesInRow) * boxesInRow);
      }
      setActiveItem(data[boxNumber-1]);
      setActiveBox(boxNumber);
    } else{
      handleResetActive();
    }
  }

  const handleResetActive = () => {
    setActiveBox(0);
    setActiveBoxRow(0);
    setActiveItem([]);
  }

  React.useEffect(() => {
    fetchData(pageIndex, pageSize, []);
  }, [fetchData, pageIndex, pageSize]);

  const previousPage = () => {
    if (pageIndex > 0) {
      gotoPage(pageIndex - 1);
    }
  }

  const nextPage = () => {
    if (pageIndex < Math.floor(totalRecords/pageSize) - 1) {
      gotoPage(pageIndex + 1);
    }
  }

  const gotoPage = (page) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
  }

  React.useEffect(() => {
    onPageSizeChange(pageSize);
  }, [pageSize]);

  React.useEffect(() => {
    setPageSize(paginationPageSize);
  }, [paginationPageSize]);

  React.useEffect(() => {
    onPageIndexChange(pageIndex);
  }, [pageIndex]);

  React.useEffect(() => {
    setPageIndex(paginationPageIndex);
  }, [paginationPageIndex]);

  return (
    <>
      <Styles>
        {data.length ? (
          data.map((item, index) => (
            <>
              <div className={`box-wrapper ${activeBox === index + 1 ? 'active' : ''}`} onClick={() => handleBoxClick(index+1)}>
                <div className={`box`} style={{backgroundImage: item.logo ? `url(${urlPath(item.logo?.url)})` : `url(/graduate-default.png)`}}>
                  <div className="box-icon">
                    {item.statusIcon}
                  </div>
                  <div className="title-box">
                    <div className="title">{item.title}</div>
                  </div>
                </div>
                <div className="box-line">
                  <div className="box-line-upper">
                    <div className="complete" style={{width: item.progressPercent}}></div>
                    <div className="incomplete" style={{width: `calc(100% - ${item.progressPercent})`}}></div>
                  </div>
                  <div className="box-line-lower"></div>
                </div>
                <div className="box-line-active">
                  <FaAngleDoubleDown size="20" />
                </div>
              </div>
              {activeBoxRow === index + 1 &&
              <div className="box-details row">
                <div className="col-md-4">
                  <DetailField label="Full Name" value={activeItem.title || '(Not entered)'} />
                  <DetailField label="Parents Name" value={activeItem.name_of_parent_or_guardian || '(Not entered)'} />
                  <DetailField label="Status" value={activeItem.status || '(Not entered)'} />
                  <DetailField label="Gender" value={activeItem.gender || '(Not entered)'} />
                  <DetailField label="CV" value={
                    activeItem.CV ? (
                      <div className="d-flex flex-column">
                        <div>
                          <a href={urlPath(activeItem.CV.url)} target="_blank" className="btn btn-secondary btn-cv-view mb-1">View</a>
                        </div>
                        <div className="cv-updated-on">(Updated on: {moment(activeItem.CV.updated_at).format('DD MMM YYYY')})</div>
                      </div>
                      ) : '(Not uploaded)'
                  } />
                </div>
                <div className="offset-md-1 col-md-4">
                  <DetailField label="Date of Birth" value={activeItem.date_of_birth ? moment(activeItem.date_of_birth).format('DD MMM YYYY') : '(Not entered)'} />
                  <DetailField label="Email" value={activeItem.email || '(Not entered)'} />
                  <DetailField label="Phone No." value={activeItem.phone || '(Not entered)'} />
                  <DetailField label="Category" value={activeItem.category || '(Not entered)'} />
                </div>
                <div className="col-md-3 d-flex flex-md-column justify-content-end align-items-end pb-3">
                  <button
                    onClick={() => history.push(`/student/${activeItem.id}`)}
                    className="btn-view-more btn btn-sm text-white"
                  >
                    View More+
                  </button>
                </div>
              </div>}
            </>
          ))
        ) : (
          <div className="d-flex w-100 justify-content-center py-5" style={{fontStyle: 'italic', color: '#787B96', fontSize: '14px'}}>No entries found.</div>
        )}
      </Styles>
      <div>
        <Pagination totalRecords={totalRecords} totalPages={Math.ceil(totalRecords/pageSize)} pageNeighbours={2} gotoPage={gotoPage} nextPage={nextPage} previousPage={previousPage} pageIndex={pageIndex} pageLimit={pageSize} setPageLimit={setPageSize} />
      </div>
    </>
  )
};

export default StudentGrid;
