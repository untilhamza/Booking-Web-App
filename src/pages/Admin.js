import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import useHttp from "../hooks/useHttp";
import moment from "moment";
import { httpGetBookings } from "../hooks/request";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import TrackingCode from "../components/TrackingCode";

const Admin = () => {
  const history = useHistory();
  const [date, setDate] = useState(moment());
  //console.log(date);
  const { status, data: bookings, error, sendRequest } = useHttp(httpGetBookings, true);

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
    setDate(newDate);
  };

  const handleOnView = (id) => {
    history.push(`/appointment/${id}`);
  };

  useEffect(() => {
    // sendRequest(date.format("DD-MM-YYYY"));
    sendRequest(date);
  }, [date, sendRequest]);

  if (error) {
    modalError(error);
  }

  return (
    <div>
      <TrackingCode />
      <Dashboard date={date} onSelectDate={handleSelectDate} bookings={bookings} onView={handleOnView} status={status} />
    </div>
  );
};

export default Admin;
