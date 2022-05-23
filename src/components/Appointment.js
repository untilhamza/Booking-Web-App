import React from "react";
import Button from "react-bootstrap/Button";
import useModal from "../hooks/useModal";
import "./Appointment.css";

const Appointment = ({ appointmentData, onBack, onCancel }) => {
  const handleCancel = () => {
    onCancel();
  };
  const handleModify = () => {
    console.log("Modifying...");
  };

  const { modal, handleShow } = useModal(
    "Confirmation",
    "Are you sure you want to delete this appointment?",
    handleCancel
  );
  return (
    <>
      {modal}
      <div className="container">
        <div className="appointment-card card mx-auto">
          <div className="card-body d-flex flex-column">
            <h5>Appointment details</h5>
            <div className="card-text">
              For : <span className="fw-bolder"> {appointmentData.name}</span>
            </div>
            <div className="card-text">
              Phone number :{" "}
              <span className="fw-bolder booking-data">
                {" "}
                {appointmentData.phone}
              </span>
            </div>
            <div className="card-text">
              Date : <span className="fw-bolder"> {appointmentData.date}</span>
            </div>
            <div className="card-text">
              Time : <span className="fw-bolder"> {appointmentData.time}</span>
            </div>
            {appointmentData.status && (
              <div className="card-text">
                Status :{" "}
                <span
                  className={`fw-bolder text-capitalize ${
                    appointmentData.status === "cancelled" ? "text-danger" : ""
                  }`}
                >
                  {" "}
                  {appointmentData.status}
                </span>
              </div>
            )}

            <div className="d-flex justify-content-around mt-3 ">
              {/* <Button
                variant="success"
                type="button"
                className="w-100 me-1"
                onClick={() => {
                  handleModify();
                }}
              >
                Modify
              </Button> */}
              {appointmentData.status !== "cancelled" && (
                <Button
                  variant="danger"
                  type="button"
                  className="w-100 ms-1"
                  onClick={() => {
                    handleShow();
                  }}
                >
                  Cancel Appointment
                </Button>
              )}
            </div>

            {/* <div className="mb-2 mt-3">
              <Button onClick={onBack} className="btn-secondary">
                Home
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
