import React from "react";
import Button from "react-bootstrap/Button";

import "./BookingMenu.css";
const BookingMenu = ({ onMakeAppointment, onModifyAppointment, onBack }) => {
  return (
    <div className="">
      {/* <h2>Booking Menu</h2> */}
      <div className="d-flex flex-column booking-menu">
        <div className="mb-2">
          <Button
            variant="success"
            className="d-block w-100"
            onClick={() => {
              onMakeAppointment();
            }}
          >
            Make new Appointment
          </Button>
        </div>
        <div className="mb-2">
          <Button
            variant="outline-success"
            className="d-block w-100"
            onClick={() => {
              onModifyAppointment();
            }}
          >
            View set Appointment
          </Button>
        </div>
        <div className="mb-2 mt-3">
          {/* <Button
            className="btn-secondary"
            onClick={() => {
              onBack();
            }}
          >
            Go Back
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default BookingMenu;
