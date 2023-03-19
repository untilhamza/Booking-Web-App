import React, { useEffect } from "react";
import BookingForm from "../components/BookingForm/BookingForm";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpSubmitBooking, httpGetSlots, httpGetSettings } from "../http/serverInterface";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import moment from "moment";
import Swal from "sweetalert2";
import GoogleAnalytics from "../components/GoogleAnalytics";

const NewBooking = () => {
  //when it is loaded for the first time, we should fetch slots for the current date..
  const history = useHistory();
  const { status: getSettingsStatus, data: settings, error: getSettingsErrorMessage, sendRequest: getSettings } = useHttp(httpGetSettings);

  const { status: submitBookingStatus, data: response, error: submitBookingsError, sendRequest } = useHttp(httpSubmitBooking);

  const { status: slotStatus, data: slotsArray, sendRequest: sendRequestSlots } = useHttp(httpGetSlots);

  function handleGetSlots(date) {
    sendRequestSlots(date);
  }

  function handleCancel() {
    history.goBack();
  }

  async function handleConfirm(bookingData) {
    sendRequest({ ...bookingData });
  }

  useEffect(() => {
    //TODO: fetch for the date today or the provided date when modifying date
    //make sure these fire at the same time...
    Promise.all([getSettings(), handleGetSlots(moment())]);
  }, []);

  useEffect(() => {
    if (submitBookingStatus === STATUS_COMPLETED && !submitBookingsError) {
      //navigate to the see appointment page with the made appointment..
      //may be show some status of the appointment..
      history.push(`/appointment/${response}`);
    }
  }, [submitBookingStatus, response, history, submitBookingsError]);

  useEffect(() => {
    function modalError(message) {
      Modal.error({
        title: "Oops...!!",
        content: message ? message : "An error occurred. Please try again later",
        onOk: () => {
          history.push("/");
        },
      });
    }

    if (submitBookingsError && submitBookingsError.includes("Looks like you have already booked today")) {
      Swal.fire({
        title: `Oops!`,
        html: `<p>Looks like you have already booked on this day. Please cancel your previous appointment to make a new one.</p>
          `,
        icon: `info`,
        confirmButtonText: "Okay",
      }).then((result) => {
        //TODO: fetch user appointments and navigate to the appointment page..
        history.push("/check-appointment");
      });
    } else if (submitBookingsError || getSettingsErrorMessage) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      }).then((result) => {
        history.push("/");
      });
    }
  }, [submitBookingsError, getSettingsErrorMessage, history]);

  return (
    <div>
      <GoogleAnalytics />
      <SimpleBackdrop loading={submitBookingStatus === STATUS_PENDING} />
      <SimpleBackdrop loading={getSettingsStatus === STATUS_PENDING} />
      {getSettingsStatus === STATUS_COMPLETED && (
        <BookingForm onConfirm={handleConfirm} onCancel={handleCancel} onGetSlots={handleGetSlots} slots={slotsArray} slotStatus={slotStatus} settings={settings} />
      )}
    </div>
  );
};

export default NewBooking;
