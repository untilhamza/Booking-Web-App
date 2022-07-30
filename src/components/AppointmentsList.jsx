import React from "react";
import Appointment from "./Appointment/Appointment";

const AppointmentsList = ({ appointments, onCancel }) => {
  return (
    <>
      {appointments?.map((data) => (
        <Appointment appointmentData={data} hideDone={true} onCancel={onCancel} key={data.id} />
      ))}
    </>
  );
};

export default AppointmentsList;
