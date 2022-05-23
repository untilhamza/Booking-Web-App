import React, { useEffect } from "react";
import BookingForm from "../components/BookingForm";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpSubmitBooking, httpGetSlots } from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop";
import moment from "moment";

const NewBooking = () => {
  //when it is loaded for the first time, we should fetch slots for the current date..
  const history = useHistory();
  const {
    status,
    data: response,
    error,
    sendRequest,
  } = useHttp(httpSubmitBooking);

  const { data: slotsArray, sendRequest: sendRequestSlots } =
    useHttp(httpGetSlots);

  function handleGetSlots(date) {
    sendRequestSlots(date);
  }

  function handleCancel() {
    history.goBack();
  }

  async function handleConfirm(bookingData) {
    sendRequest(bookingData);
  }

  useEffect(() => {
    //TODO: fetch for the date today or the provided date when modifying date
    handleGetSlots(moment());
  }, []);

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

  if (error) {
    modalError(error);
  }

  return (
    <div>
      <SimpleBackdrop loading={status === STATUS_PENDING} />
      <BookingForm
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onGetSlots={handleGetSlots}
        slots={slotsArray}
      />
    </div>
  );
};

export default NewBooking;
