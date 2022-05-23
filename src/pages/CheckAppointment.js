import React, { useEffect } from "react";
import CheckingForm from "../components/CheckingForm";
import Appointment from "../components/Appointment";
import { useHistory } from "react-router-dom";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpCheckBooking } from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop";
import { Modal } from "antd";

const CheckAppointment = () => {
  const history = useHistory();
  const {
    status,
    data: response,
    error,
    sendRequest,
  } = useHttp(httpCheckBooking);

  function handleChecking(userEmail) {
    sendRequest(userEmail.email);
  }

  function handleCancel() {
    history.goBack();
  }

  function modalError(message) {
    Modal.error({
      title: "An Error occurred",
      content: message ? message : "There was an error",
    });
  }

  if (error) {
    console.log(error);
    modalError(error);
  }

  useEffect(() => {
    if (status === STATUS_COMPLETED) {
      //navigate away

      return history.push(`/appointment/${response.id}`);
    }
  }, [status, response, history]);

  return (
    <div>
      <SimpleBackdrop loading={status === STATUS_PENDING} />
      <CheckingForm onConfirm={handleChecking} onCancel={handleCancel} />
    </div>
  );
};

export default CheckAppointment;