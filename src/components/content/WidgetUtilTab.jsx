import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";

const TabPicker = () => {
  const tabs = [
    { title: <FaRegCalendarAlt size={20} />, key: "date" },
    { title: "30 D", key: "30days" },
    { title: "1 Qtr", key: "first-quarter" },
    { title: "1 Y", key: "year" },
    { title: "All", key: "all" },
  ];

  const [endDate, setEndDate] = useState(null);
  const [activeTab, setActive] = useState(tabs[0].key);
  const [pickerOpen, openDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const changeTab = ({ key }) => {
    if (key === "date") {
      openDatePicker(true);
    }
    setActive(key);
  };

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
   
    if (!end) return;
    openDatePicker(false);
  };

  return (
    <div className="widget-tab">
      <div className="widget-util-tab my-3 latto-regular">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => changeTab(tab)}
            className={activeTab === tab.key ? `active` : ""}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div
        className="date-picker-ui"
        style={{ margingTop: "-100px !important", position: "absolute" }}
      >
        <DatePicker
          selectsRange
          open={pickerOpen}
          endDate={endDate}
          startDate={startDate}
          selected={startDate}
          onChange={handleChange}
          onClickOutside={() => openDatePicker(false)}
        />
      </div>
    </div>
  );
};

export default TabPicker;
