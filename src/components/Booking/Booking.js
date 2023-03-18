import React from "react";
import Button from "react-bootstrap/esm/Button";
import Badge from "react-bootstrap/Badge";
import "./Booking.css";
import { setStatus } from "../../util/helpers";

const Booking = ({ booking, onView }) => {
  // console.log("booking", booking);
  const { name, time, status, id, phone } = booking;

  function handleView() {
    onView(id);
  }

  return (
    <tr>
      <td className="text-center py-2 booking-time table-body-text">{time}</td>
      <td className="text-start py-2 customer-name table-body-text">{`${name}\n ${phone}`}</td>
      <td className="text-center py-2 table-body-text">
        <Badge pill bg={`${setStatus(status)}`} className="py-2 px-2 px-sm-3">
          {status}
        </Badge>
      </td>
      <td className="text-center py-2 table-body-text">
        {
          <Button className="btn-sm btn-secondary w-100 " onClick={handleView}>
            View
          </Button>
        }
      </td>
      {}
    </tr>
  );
};

export default Booking;
