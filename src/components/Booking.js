import React from "react";
import Button from "react-bootstrap/esm/Button";
import "./Booking.css";

const Booking = (props) => {
  const { name, time, status } = props.booking;
  // console.log(name, time, status);
  // const name = "customer name";
  // const status = "upcoming";
  // const time = "11:30";

  const setStatus = (status) => {
    if (status === "confirmed") return "bg-success";
    if (status === "completed") return "bg-primary";
    if (status === "cancelled") return "bg-danger";
  };

  return (
    <tr className="table-row">
      <td className="text-center">{time}</td>
      <td>{name}</td>
      <td className="text-center p-2">
        <span className={`badge rounded-pill px-2 ${setStatus(status)} w-100`}>
          {" "}
          {status}
        </span>
      </td>
      <td className="p-2">
        {<Button className="btn-sm btn-secondary w-100">View</Button>}
      </td>
      {}
    </tr>
  );
};

export default Booking;
