import React, { useEffect } from "react";
import BookingForm from "../components/BookingForm";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpSubmitBooking } from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop";

const NewBooking = () => {
  const history = useHistory();
  const {
    status,
    data: response,
    error,
    sendRequest,
  } = useHttp(httpSubmitBooking);

  useEffect(() => {
    if (status === STATUS_COMPLETED) {
      //navigate to the see appointment page with the made appointment..
      //may be show some status of the appointment..
      history.push(`/appointment/${response}`);
    }
  }, [status, response, history]);

  function modalError(message) {
    Modal.error({
      title: "An Error occurred",
      content: message ? message : "There was an error",
      onOk: () => {
        history.push("/");
      },
    });
  }

  function handleCancel() {
    history.goBack();
  }

  async function handleConfirm(bookingData) {
    sendRequest(bookingData);
  }

  if (error) {
    modalError(error);
  }

  return (
    <div>
      <SimpleBackdrop loading={status === STATUS_PENDING} />
      <BookingForm onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};

export default NewBooking;
