import React from 'react';

const CheckBoxForm = (props) => {
  const handleBulkChange = () => {
    props.setBulkAddCheck(true);
    props.setMassEditCheck(false);
  };

  const handleMassEditChange = () => {
    props.setBulkAddCheck(false);
    props.setMassEditCheck(true);
  };

  return (
    <div className="d-flex">
      <div className="mr-3">
        <input
          type="radio"
          id="bulk"
          name="option"
          checked={props.bulkcheck}
          onChange={handleBulkChange}
        />
        <label htmlFor="bulk">{props.bulkAdd}</label>
      </div>

      <div className="ml-3">
        <input
          type="radio"
          id="massEdit"
          name="option"
          checked={!props.bulkcheck}
          onChange={handleMassEditChange}
        />
        <label htmlFor="massEdit">{props.massEdit}</label>
      </div>
    </div>
  );
};

export default CheckBoxForm;
