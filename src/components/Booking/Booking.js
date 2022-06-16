import React from "react"
import Button from "react-bootstrap/esm/Button"
import { Chip } from "@mui/material"
import "./Booking.css"

const Booking = ({ booking, onView }) => {
  const { name, time, status, id } = booking
  // console.log(name, time, status);
  // const name = "customer name";
  // const status = "upcoming";
  // const time = "11:30";

  function handleView() {
    onView(id)
  }

  const setStatus = (status) => {
    if (status === "confirmed") return "success" // return "bg-success"
    if (status === "completed") return "" //return "bg-primary"
    if (status === "cancelled") return "error" //return "bg-danger"
  }

  return (
    <tr>
      <td className="text-center py-2 booking-time table-body-text">{time}</td>
      <td className="text-start py-2 customer-name table-body-text">{name}</td>
      <td className="text-center py-2 table-body-text">
        <Chip label={status} color={`${setStatus(status)}`} size="small" />
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
  )
}

export default Booking
