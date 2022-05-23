import { Calendar as Cal, Select, Radio, Col, Row } from "antd";

import "./Calendar.css";

const { Group, Button } = Radio;

const Calendar = ({ onSelectDate, heading }) => {
  //   function onPanelChange(value, mode) {
  //     console.log(value, mode);
  //   }
  function handleDateSelection(newDate) {
    console.log("calendar data", newDate);
    onSelectDate(newDate);
  }

  return (
    <div className="calendar">
      <Cal fullscreen={false} onSelect={handleDateSelection} />
    </div>
  );
};

export default Calendar;
