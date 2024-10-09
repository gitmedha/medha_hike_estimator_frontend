import { useState } from "react";
import PropTypes from "prop-types";

const TabPicker = ({ moduleName,options, setActiveTab = () => {} }) => {
  const [activeTab, setActive] = useState(options[0].key);
  const tabClass = moduleName === "Students" ? "topnav":"top_nav_for_other"
  const isFewOptions = options.length < 3;
  const additionalClass = isFewOptions ? "few-options" : "";



  const changeTab = (tab) => {
    
    setActive(tab.key);
    setActiveTab(tab);
  };

  return (
    <div className={`${tabClass} ${additionalClass} my-3 latto-regular`}>
      {options.length == 1 ? ((
        options.map((tab) => (
          <div
            key={tab.key}
            onClick={() => changeTab(tab)}
            className={ `active` }
          >
            {tab.title}
          </div>
        ))
      )) : (
        options.map((tab) => (
          <div
            key={tab.key}
            onClick={() => changeTab(tab)}
            className={activeTab === tab.key ? `active` : ""}
          >
            {tab.title}
          </div>
        ))
      )}
    </div>
  );
};

TabPicker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default TabPicker;
