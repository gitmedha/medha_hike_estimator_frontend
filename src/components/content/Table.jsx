import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import styled from "styled-components";
import Pagination from "./Pagination";
import Skeleton from "react-loading-skeleton";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const StickyPagination = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  padding: 10px;
  border-top: 1px solid #d7d7e0;
  @media screen and (max-width: 431px) {
    padding-bottom: 10px;
  }
`;

const Styles = styled.div`
  border: 1.5px solid #d7d7e0;
  background: #ffffff;
  border-radius: 5px;
  font-size: 14px;

  .clickable:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  table {
    box-sizing: border-box;
    width: 100%;
    table-layout: auto;

    thead {
      th {
        color: #787b96;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding-top: 0;
      padding-bottom: 0;
      color: #787b96;
      border-bottom: 1px solid #bfbfbf;
      height: 60px;
    }

    .ellipsis-header,
    .ellipsis-cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 150px;
    }

    .highlight-cell {
      color: #257b69;
      font-weight: bold;
    }
  }

  .mobile {
    border: 1.5px solid #d7d7e0;
    .row {
      padding-top: 15px;
      padding-bottom: 15px;
      margin: 0;

      &:not(:last-child) {
        border-bottom: 1px solid #bfbfbf;
      }

      .cell:not(:last-child) {
        margin-bottom: 10px;
      }

      .highlight-cell {
        color: #257b69;
        font-weight: bold;
      }
    }
  }

  .table-row-link {
    text-decoration: none;
    color: inherit;
    height: 100%;
    display: flex;
    align-items: center;
  }

  @media screen and (min-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }

  @media screen and (max-width: 431px) {
    min-height: 180px;
  }
`;

const Table = ({
  columns,
  data,
  fetchData,
  totalRecords,
  loading,
  showPagination = true,
  onRowClick = null,
  indexes = false,
  paginationPageSize = 10,
  onPageSizeChange = () => {},
  paginationPageIndex = 0,
  onPageIndexChange = () => {},
  collapse_tab_name = null,
  isSearchEnable = false,
  isFilterApplied = false,
}) => {
   const highlightedColumns = ['Employee ID', 'Employee Name', 'Name', 'ID','First Name','Last Name','Employee','Reviewer'];
  
  // Memoize the columns to prevent unnecessary re-renders
  const memoizedColumns = React.useMemo(() => {
    return columns.map(col => ({
      ...col,
      Cell: ({ value, column }) => {
        const shouldHighlight = highlightedColumns.includes(column.Header);
        return (
          <div className={shouldHighlight ? "highlight-cell" : ""}>
            {value}
          </div>
        );
      }
    }));
  }, [columns]);

  const tableInstance = useTable(
    {
      columns: memoizedColumns,
      data,
      initialState: { pageIndex: 0, pageSize: paginationPageSize },
      manualSortBy: true,
      manualPagination: true,
      pageCount: Math.ceil(totalRecords / paginationPageSize),
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance;

  const rowClickFunctionExists = typeof onRowClick === "function";

  const handleRowClick = (row) => {
    if (rowClickFunctionExists) {
      onRowClick(row.original);
    }
  };

  // Add a ref to track if we should skip the next fetch
  const skipFetchRef = React.useRef(false);

  React.useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    fetchData(pageIndex, pageSize, sortBy, isSearchEnable, isFilterApplied);
  }, [pageIndex, pageSize, sortBy, isSearchEnable, isFilterApplied]);

  React.useEffect(() => {
    skipFetchRef.current = true;
    onPageSizeChange(pageSize);
  }, [pageSize]);

  React.useEffect(() => {
    skipFetchRef.current = true;
    setPageSize(paginationPageSize);
  }, [paginationPageSize]);

  React.useEffect(() => {
    skipFetchRef.current = true;
    onPageIndexChange(pageIndex);
  }, [pageIndex]);

  React.useEffect(() => {
    skipFetchRef.current = true;
    gotoPage(paginationPageIndex);
  }, [paginationPageIndex]);

  return (
    <>
      <Styles>
        <div className="d-none d-md-block">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {indexes && <th style={{ width: "1.5rem" }}>#</th>}
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={column.Header === "Title" ? "ellipsis-header" : ""}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaLongArrowAltDown />
                          ) : (
                            <FaLongArrowAltUp />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {loading ? (
                <>
                  <tr>
                    <td colSpan={columns.length}><Skeleton height="100%" /></td>
                  </tr>
                  <tr>
                    <td colSpan={columns.length}><Skeleton height="100%" /></td>
                  </tr>
                  <tr>
                    <td colSpan={columns.length}><Skeleton height="100%" /></td>
                  </tr>
                </>
              ) : page.length ? (
                page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      onClick={() => handleRowClick(row)}
                      className={row.original.href || rowClickFunctionExists ? "clickable" : ""}
                    >
                      {indexes && (
                        <td style={{ color: "#787B96", fontFamily: "Latto-Bold" }}>
                          {row.original.href && !rowClickFunctionExists ? (
                            <a className="table-row-link" href={row.original.href}>
                              {pageIndex * pageSize + index + 1}.
                            </a>
                          ) : (
                            <>
                              {pageIndex * pageSize + index + 1}.
                            </>
                          )}
                        </td>
                      )}
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className={cell.column.Header === "Title" ? "ellipsis-cell" : ""}
                        >
                          {row.original.href ? (
                            <a className="table-row-link" href={row.original.href}>
                              {cell.render("Cell")}
                            </a>
                          ) : (
                            cell.render("Cell")
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={indexes ? columns.length + 1 : columns.length}
                    style={{
                      color: "#787B96",
                      fontFamily: "Latto-Bold",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontStyle: "italic",
                        fontFamily: "Latto-Regular",
                      }}
                    >
                      No entries found.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-md-none mobile">
          {loading ? (
            <Skeleton count={3} height="60px" />
          ) : (
            page.map((row, index) => {
              prepareRow(row);
              return (
                <div
                  key={index}
                  className={`row ${row.original.href || rowClickFunctionExists ? "clickable" : ""}`}
                  onClick={() => {}}
                >
                  {row.cells.map((cell, cellIndex) => {
                    const isHighlighted = highlightedColumns.includes(cell.column.Header);
                    return (
                      <div
                        key={cellIndex}
                        className={`cell ${isHighlighted ? "highlight-cell" : ""} ${
                          cellIndex === row.cells.length - 1 && collapse_tab_name === "Attandance" 
                            ? "d-flex justify-content-end" 
                            : ""
                        }`}
                      >
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </Styles>

      {showPagination && (
        <StickyPagination>
          <Pagination
            totalRecords={totalRecords}
            totalPages={pageCount}
            pageNeighbours={2}
            gotoPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            pageIndex={pageIndex}
            pageLimit={pageSize}
            setPageLimit={setPageSize}
          />
        </StickyPagination>
      )}
    </>
  );
};

export default Table;