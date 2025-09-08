import React from "react";

const CheckInvalidRows = ({ invalidRows, expectedColumns }) => {
  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Row #</th>
            {expectedColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          {invalidRows.map((row, i) => (
            <tr key={i}>
              <td>{row.rowNumber}</td>
              {expectedColumns.map((col) => (
                <td
                  key={col}
                  style={{
                    backgroundColor: row.errors[col] ? "#f8d7da" : "transparent",
                  }}
                >
                  {row[col]}
                </td>
              ))}
              <td>
                {Object.values(row.errors).map((err, j) => (
                  <div key={j} style={{ color: "red" }}>
                    {err}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckInvalidRows;
