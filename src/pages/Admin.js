import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import moment from "moment";
import { httpGetBookings } from "../hooks/request";
import { Modal } from "antd";

const Admin = () => {
  const [date, setDate] = useState(moment());
  //console.log(date);
  const {
    status,
    data: bookings,
    error,
    sendRequest,
  } = useHttp(httpGetBookings, true);

  function modalError(message) {
    Modal.error({
      title: "An Error occurred",
      content: message ? message : "There was an error",
      // onOk: () => {
      //   history.push("/");
      // },
    });
  }
  const handleSelectDate = (newDate) => {
    console.log("incoming date", newDate);
    setDate(newDate);
  };

  useEffect(() => {
    console.log("selected date effect", date);
  }, [date]);

  useEffect(() => {
    // sendRequest(date.format("DD-MM-YYYY"));
    sendRequest(date);
  }, [date, sendRequest]);

  if (error) {
    modalError(error);
  }

  return (
    <div>
      <Dashboard
        date={date}
        onSelectDate={handleSelectDate}
        bookings={bookings}
        status={status}
      />
    </div>
  );
};

export default Admin;
