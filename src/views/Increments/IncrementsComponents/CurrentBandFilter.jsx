import React, { useState,useEffect} from "react";
import ReactSelect from "react-select";

const CurrentBandDropdown = (props) => {
  const {
    selectedBand,
    setSelectedBand,
    selectedTenure,
    setSelectedTenure,
    selectedLongTenures,
    setSelectedLongTenure
  } = props;
  const [newBands,setBands] = useState([]);
  const [tenures,setTenures] = useState([]);
  const [longTenures,setLongTenures] =useState([]);

  const handleBandChange = (selectedOption) => {
    setSelectedBand(selectedOption);
    updateFilters("new_band",selectedOption.value);
  };

  const handleTenureChange = (selectedOption) => {
    setSelectedTenure(selectedOption);
    updateFilters("tenure", selectedOption.value);
  };

  const handleLongTenureChange = (selectedOption) => {
    setSelectedLongTenure(selectedOption);
    updateFilters("long_tenure",selectedOption.value);
  };

  const updateFilters = (field, values) => {
  
   let existingIndex = -1;
   if(props.filters[0].fields.length){
    if(props.filters[0].fields.includes(field)){
        existingIndex = props.filters[0].fields.indexOf(field);
    }
   }
   let updatedFilters = {...props.filters[0]};
   
    if(existingIndex>-1){
        console.log(existingIndex);
      updatedFilters.values[existingIndex] = values;
    }else{
      updatedFilters.fields.push(field);
      updatedFilters.values.push(values);
    }
  
    // Apply the updated filters
    props.applyFilter([updatedFilters]);
  };
  
  
  
  

  useEffect(()=>{
    const {newBands,longTenures,tenures} = props;
    setBands(newBands);
    setLongTenures(longTenures);
    setTenures(tenures);

  },[props]);
  return (
    <>
   <div className="col-auto" style={{marginRight:10, width:150}}>
      <div className="text-label">
        Current Band
      </div>
        <ReactSelect
      options={newBands}
      value={selectedBand}
      onChange={handleBandChange}
      placeholder="Select"
    />
        </div>
   <div className="col-auto" style={{marginRight:10, width:150}}>
   <div className="text-label">
        Long Tenure
      </div>
   <ReactSelect
      options={longTenures}
      value={selectedLongTenures}
      onChange={handleLongTenureChange}
      style={{width:600}}
      placeholder="Select"
    />
   </div>
    
    <div className="col-auto" style={{width:150}}>
    <div className="text-label">
        Tenure
      </div>
    <ReactSelect
      options={tenures}
      value={selectedTenure}
      onChange={handleTenureChange}
      placeholder="Select"
    />
    </div>
    </>
   
    
  );
};

export default CurrentBandDropdown;