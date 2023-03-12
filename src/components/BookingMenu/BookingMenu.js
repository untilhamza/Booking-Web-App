import React from "react";
import Button from "react-bootstrap/Button";
import Map from "../Map/Map";
import "./BookingMenu.css";
const BookingMenu = ({ onMakeAppointment, onModifyAppointment, onBack }) => {
  return (
    <div className="d-flex flex-column px-3 pt-5 pt-md-0 justify-content-md-center booking-page">
      {/* <h2>Booking Menu</h2> */}
      <div className="d-flex flex-column ">
        <div className="text-capitalize fs-1 text-success big-text mb-4 text-left text-md-left">A good look reflects your story and your spirit</div>
        <div className="text-danger fs-5 small-text text-muted text-left text-md-left mb-3 d-flex flex-column">Need to look fabulous fast? Book your next hair cut today!</div>
      </div>

      {/* testing about */}
      <div className="mt-4">
        <div className="d-flex flex-column  buttons">
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
            <div className="">
              <a aria-label="Chat on WhatsApp" href="https://wa.me/821095399012">
                <img alt="Chat on WhatsApp" src="assets/images/whatsapp/WhatsAppButtonGreenLarge.svg" />
              </a>
            </div>
            <Map/>
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
    </div>
  );
};

export default BookingMenu;
