import React from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import useModal from "../../hooks/useModal";
import { setStatus } from "../../utils/helpers";
import { Card } from "antd";
import "./Appointment.css";

const Appointment = ({ appointmentData, onDone, onCancel, onBack, isAdmin, hideDone }) => {
  const handleCancel = () => {
    onCancel(appointmentData.id);
  };
  // const handleModify = () => {
  //   console.log("Modifying...");
  // };

  const { modal, handleShow } = useModal("Confirmation", "Are you sure you want to delete this appointment?", handleCancel);

  const content =
    !appointmentData.isPast || isAdmin ? (
      <>
        <h5 className="text-primary">Appointment Details</h5>
        <div className="card-row">
          <span> For :</span> <span className="fw-bolder"> {appointmentData.name}</span>
        </div>
        <div className="card-row">
          Phone number : <span className="fw-bolder booking-data"> {appointmentData.phone}</span>
        </div>
        <div className="card-row">
          Date : <span className="fw-bolder"> {appointmentData.date}</span>
        </div>
        <div className="card-row">
          Time : <span className="fw-bolder"> {appointmentData.time}</span>
        </div>
        {appointmentData.status && (
          <div className="card-row">
            Status :{" "}
            <Badge pill bg={`${setStatus(appointmentData.status)}`} className="py-2">
              {appointmentData.status}
            </Badge>
          </div>
        )}
      </>
    ) : (
      <>
        <h4>Oops...!</h4>
        <h5 className="text-primary">No recent appointments found. Please make an appointment first </h5>
      </>
    );

  return (
    <>
      {modal}

      <Card
        style={{
          width: 350,
          borderRadius: "20px",
        }}
        className="mx-auto mt-3"
      >
        {content}
        {/* buttons */}
        <div className="d-flex flex-column justify-content-around mt-3 ">
          {!hideDone && (
            <Button
              variant="success"
              type="button"
              className="w-100 me-1"
              onClick={() => {
                if (isAdmin) {
                  onBack();
                } else {
                  onDone();
                }
              }}
            >
              Done
            </Button>
          )}

          {(appointmentData.status === "confirmed" || (appointmentData.status === "completed" && isAdmin)) && (
            <Button
              variant="outline-danger"
              type="button"
              className="w-100 mt-1"
              onClick={() => {
                handleShow();
              }}
            >
              Cancel Appointment
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default Appointment;
