import { Calendar as Cal } from "antd";

import "./Calendar.css";

const Calendar = ({ onSelectDate, heading }) => {
  //   function onPanelChange(value, mode) {
  //     console.log(value, mode);
  //   }
  function handleDateSelection(newDate) {
    onSelectDate(newDate);
  }

  return (
    <div className="calendar">
      <Cal fullscreen={false} onSelect={handleDateSelection} />
    </div>
  );
};

export default Calendar;
