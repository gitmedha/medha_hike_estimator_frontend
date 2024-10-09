import styled from 'styled-components';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Select from 'react-select'

const Styled = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;

  select {
    border: none;
    outline: none;

    &:focus {
      outline: none;
    }
  }

  .count{
    align-items: center;
    border-radius: 4px;
    border-width: 1px;
    cursor: default;
    display: flex;
    flex-wrap: wrap;
    padding: 4px;
    color: #787B96;
    font-weight:bold;
    margin:4px -12px;
  }

  ul.pagination {
    margin: 30px auto;
    padding:2px 2px 2px 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    .pagination-link-wrapper {
      margin: auto 3px;

      &.active {
        .pagination-link {
          border-color: #207B69;
          background-color: #207B69;
          color: white;
        }
      }
    }

    .pagination-link {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Latto-Bold';
      width: 30px;
      height: 30px;
      font-size: 12px;
      text-align: center;
      border-radius: 3px;
      background-color: white;
      border: 1px solid #EEEFF8;
      box-sizing: border-box;
      color: #207B69;
      cursor: pointer;

      &.disabled {
        color: #D1D2DB;

        &:hover {
          cursor: not-allowed;
          color: #D1D2DB;
        }
      }
    }
  }

  @media screen and (min-width: 768px) {
    .count{
    align-items: center;
    border-radius: 4px;
    border-width: 1px;
    cursor: default;
    display: flex;
    flex-wrap: wrap;
    padding: 4px;
    color: #787B96;
    font-weight:bold;
    margin:4px 4px;
  }
    ul.pagination {

      .pagination-link-wrapper {
        margin: auto 5px;
      }

      .pagination-link {
        width: 30px;
        height: 36px;
        font-size: 14px;
      }
    }
  }
`

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

const Pagination = ({totalRecords, totalPages, pageNeighbours = 2, gotoPage, nextPage, previousPage, pageIndex, pageLimit, setPageLimit}) => {
  const currentPage = pageIndex + 1;

  const fetchPageNumbers = () => {
    const totalNumbers = (pageNeighbours * 2) + 1;
    if (totalPages > totalNumbers) {
      let startPage = Math.max(1, currentPage - pageNeighbours + Math.max(0, 3 - currentPage));
      let endPage = Math.min(totalPages, currentPage + pageNeighbours + Math.max(0, 3 - currentPage));
      if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - pageNeighbours -  2);
      }
      return range(startPage, endPage);
    }
    return range(1, totalPages);
  }

  const pages = fetchPageNumbers();

  const pageSizeOptions = [
    { value: 10, label: 'Show 10' },
    { value: 25, label: 'Show 25' },
    { value: 50, label: 'Show 50' },
    { value: 100, label: 'Show 100' },
  ];

  return (
    <Styled>
      <div className="row d-flex align-items-center justify-content-center w-100">
      <div className="col-md-2" >
          <span className="count" >Total Records: &nbsp; {totalRecords} </span>
        </div>
        <div className="col-md-7">
          <nav>
            <ul className="pagination">
              <li key='first' className="pagination-link-wrapper">
                <span className={`pagination-link ${currentPage <= 1 ? 'disabled' : ''}`} href="#" aria-label="Previous" onClick={() => gotoPage(0)} disabled={currentPage <= 1}>
                  <span className="sr-only"><FaAngleDoubleLeft /></span>
                </span>
              </li>
              <li key='previous' className="pagination-link-wrapper">
                <span className={`pagination-link ${currentPage <= 1 ? 'disabled' : ''}`} href="#" aria-label="Previous" onClick={() => previousPage()} disabled={currentPage <= 1}>
                  <span className="sr-only"><FaAngleLeft /></span>
                </span>
              </li>
              { pages.map((page, index) => {
                return (
                  <li key={index} className={`pagination-link-wrapper ${ currentPage === page ? 'active' : ''}`}>
                    <span className="pagination-link" href="#" onClick={() => gotoPage(page - 1)}>{ page }</span>
                  </li>
                );
              }) }
              <li key='next' className="pagination-link-wrapper">
                <span className={`pagination-link ${currentPage >= totalPages ? 'disabled' : ''}`} href="#" aria-label="Next" onClick={() => nextPage()} disabled={currentPage >= totalPages}>
                  <span className="sr-only"><FaAngleRight /></span>
                </span>
              </li>
              <li key='last' className="pagination-link-wrapper">
                <span className={`pagination-link ${currentPage >= totalPages ? 'disabled' : ''}`} href="#" aria-label="Next" onClick={() => gotoPage(totalPages - 1)} disabled={currentPage >= totalPages}>
                  <span className="sr-only"><FaAngleDoubleRight /></span>
                </span>
              </li>
            </ul>
          </nav>

        </div>
        <div className="page-box col-md-2">
          <Select
            value = {pageSizeOptions.filter(option => option.value === pageLimit)}
            options={pageSizeOptions}
            isSearchable={false}
            onChange={e => {
              localStorage.setItem('tablePageSize', Number(e.value));
              setPageLimit(Number(e.value))
            }}
          />
        </div>
        
      </div>
    </Styled>
  );
}

export default Pagination;
