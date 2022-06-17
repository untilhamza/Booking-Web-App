import React from "react"
import Button from "react-bootstrap/Button"
import Badge from "react-bootstrap/Badge"
import useModal from "../../hooks/useModal"
import { Chip } from "@mui/material"
import { setStatus } from "../../util/helpers"
import "./Appointment.css"

const Appointment = ({
  appointmentData,
  onDone,
  onCancel,
  onBack,
  isAdmin,
}) => {
  const handleCancel = () => {
    onCancel()
  }
  // const handleModify = () => {
  //   console.log("Modifying...");
  // };

  const { modal, handleShow } = useModal(
    "Confirmation",
    "Are you sure you want to delete this appointment?",
    handleCancel
  )
  return (
    <>
      {modal}
      <div className="container">
        <div className="appointment-card card mx-auto">
          <div className="card-body d-flex flex-column">
            <h5>Appointment details</h5>
            <div className="card-text card-row">
              <span> For :</span>{" "}
              <span className="fw-bolder"> {appointmentData.name}</span>
            </div>
            <div className="card-text card-row">
              Phone number :{" "}
              <span className="fw-bolder booking-data">
                {" "}
                {appointmentData.phone}
              </span>
            </div>
            <div className="card-text card-row">
              Date : <span className="fw-bolder"> {appointmentData.date}</span>
            </div>
            <div className="card-text card-row">
              Time : <span className="fw-bolder"> {appointmentData.time}</span>
            </div>
            {appointmentData.status && (
              <div className="card-text card-row">
                Status :{" "}
                <Badge
                  pill
                  bg={`${setStatus(appointmentData.status)}`}
                  className="py-2"
                >
                  {appointmentData.status}
                </Badge>
              </div>
            )}

            <div className="d-flex flex-column justify-content-around mt-3 ">
              <Button
                variant="success"
                type="button"
                className="w-100 me-1"
                onClick={() => {
                  if (isAdmin) {
                    onBack()
                  } else {
                    onDone()
                  }
                }}
              >
                Done
              </Button>
              {appointmentData.status === "confirmed" && (
                <Button
                  variant="outline-danger"
                  type="button"
                  className="w-100 mt-1"
                  onClick={() => {
                    handleShow()
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
  )
}

export default Appointment
