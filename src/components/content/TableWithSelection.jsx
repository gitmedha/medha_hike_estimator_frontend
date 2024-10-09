import React from "react";
import { useTable, useRowSelect } from 'react-table';
import styled from 'styled-components';
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const StyledCheckbox = styled.div`
  display: flex;
`

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, id="", ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate]);

    return (
      <StyledCheckbox>
        <input type="checkbox" id={id} ref={resolvedRef} {...rest} />
      </StyledCheckbox>
    )
  }
)

const Styles = styled.div`
  border: 1.5px solid #D7D7E0;
  background: #FFFFFF;
  border-radius: 5px;
  font-size: 14px;

  .clickable:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  table {
    box-sizing: border-box;
    width: 100%;

    thead {
      th {
        color: #787B96;
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
      color: #787B96;
      border-bottom: 1px solid #BFBFBF;
      height: 60px;
    }
  }

  .mobile {
    .row {
      padding-top: 15px;
      padding-bottom: 15px;
      margin: 0;

      &:not(:last-child) {
        border-bottom: 1px solid #BFBFBF;
      }

      .cell:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }

  @media screen and (min-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`

const TableWithSelection = ({ columns, data, loading, onRowClick=null, indexes=true, selectAllHeader="", setSelectedRows = () => {}, selectedRows = {} }) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { selectedRowIds: selectedRows },
    },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <label htmlFor="selectAllRows" className="d-flex align-items-center justify-content-start mb-0">
              <IndeterminateCheckbox id="selectAllRows" {...getToggleAllRowsSelectedProps()} />
              <span style={{marginLeft: '5px'}}>{selectAllHeader}</span>
            </label>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
      ])
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = tableInstance;

  const isRowClickable = typeof onRowClick === 'function';

  const handleRowClick = (row) => {
    if (typeof onRowClick === 'function') {
      onRowClick(row.original);
    }
  }

  React.useEffect(() => {
    setSelectedRows(selectedFlatRows.map(row => row.original));
  }, [selectedFlatRows, setSelectedRows]);

  return (
    <>
      <Styles>
        <div className="d-none d-md-block">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {indexes && <th>#</th>}
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <FaLongArrowAltDown />
                            : <FaLongArrowAltUp />
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length ? (
                rows.map((row, index) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} onClick={() => handleRowClick(row)} className={`${isRowClickable ? 'clickable' : ''}`}>
                      {indexes &&
                        <td style={{ color: '#787B96', fontFamily: 'Latto-Bold'}}>
                          {index + 1}.
                        </td>
                      }
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={indexes ? columns.length + 1 : columns.length} style={{ color: '#787B96', fontFamily: 'Latto-Bold', textAlign: 'center'}}>
                    <span style={{fontStyle: 'italic', fontFamily: 'Latto-Regular'}}>No entries found.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-md-none mobile">
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <div key={index} className={`row ${isRowClickable ? 'clickable' : ''}`} onClick={() => handleRowClick(row)}>
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <div key={cellIndex} className="cell">
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Styles>
    </>
  )
};

export default TableWithSelection;
