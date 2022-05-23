import React from "react";
import Booking from "./Booking";
import { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
//import { BOOKINGS } from "../data";
import "./Booking.css";
import { Skeleton } from "antd";

const BookingTable = ({ date, bookings, status }) => {
  console.log("testing date", date);
  let content = "";
  if (status === STATUS_PENDING) {
    content = (
      <tr>
        <td colSpan={4}>
          <Skeleton paragraph active />
        </td>
      </tr>
    );
  }
  if (status === STATUS_COMPLETED) {
    if (bookings.length) {
      content = bookings?.map((booking) => (
        <Booking key={booking.id} booking={booking} />
      ));
    } else {
      content = (
        <tr>
          <td className="text-center">No bookings found!</td>
        </tr>
      );
    }
  }
  return (
    <table className="table table-sm table-bordered table-striped rounded-4 mt-3 mt-md-0">
      <thead className="thead-dark">
        <tr className="table-success text-center text-capitalize text-danger fs-4">
          <th scope="row" colSpan={4}>
            Bookings for : {date.format("dddd DD/MM/YYYY")}
          </th>
        </tr>
        <tr className="table-row">
          <th scope="col">Time</th>
          <th scope="col">Customer Name</th>
          <th scope="col">Status</th>
          <th scope="col">Modify</th>
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  );
};

export default BookingTable;
