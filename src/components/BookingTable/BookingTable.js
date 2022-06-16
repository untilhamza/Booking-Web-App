import Booking from "../Booking/Booking"
import { STATUS_COMPLETED, STATUS_PENDING } from "../../hooks/useHttp"

import "../Booking/Booking.css"
import { Skeleton } from "antd"
import Table from "react-bootstrap/Table"

const BookingTable = ({ date, bookings, status, onView }) => {
  let content = ""
  if (status === STATUS_PENDING) {
    content = (
      <tr>
        <td colSpan={4}>
          <Skeleton paragraph active />
        </td>
      </tr>
    )
  }
  if (status === STATUS_COMPLETED) {
    if (bookings.length) {
      content = bookings?.map((booking) => (
        <Booking key={booking.id} booking={booking} onView={onView} />
      ))
    } else {
      content = (
        <tr>
          <td className="text-center">No bookings found!</td>
        </tr>
      )
    }
  }
  return (
    <Table striped bordered hover size="sm" className="mt-3 mt-md-0">
      <thead>
        <tr className="table-success text-center text-capitalize text-danger fs-4">
          <th scope="row" colSpan={4}>
            Bookings for : {date.format("dddd DD/MM/YYYY")}
          </th>
        </tr>
        <tr>
          <th>Time</th>
          <th>Customer Name</th>
          <th>Status</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </Table>
  )
}

export default BookingTable
