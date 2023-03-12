import React, { useEffect } from "react";
import BookingForm from "../components/BookingForm/BookingForm";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpSubmitBooking, httpGetSlots, httpGetSettings } from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import moment from "moment";
import Swal from "sweetalert2";
import GoogleAnalytics from "../components/GoogleAnalytics";

const NewBooking = () => {
  //when it is loaded for the first time, we should fetch slots for the current date..
  const history = useHistory();
  const { status: getSettingsStatus, data: settings, error: getSettingsErrorMessage, sendRequest: getSettings } = useHttp(httpGetSettings);

  const { status: submitBookingStatus, data: response, error, sendRequest } = useHttp(httpSubmitBooking);

  const { status: slotStatus, data: slotsArray, sendRequest: sendRequestSlots } = useHttp(httpGetSlots);

  function handleGetSlots(date) {
    sendRequestSlots(date);
  }

  function handleCancel() {
    history.goBack();
  }

  async function handleConfirm(bookingData) {
    // sendRequest(bookingData);
    console.log(bookingData);
  }

  // useEffect(() => {
  //   Swal.fire({
  //     title: `Welcome! Incase there are no
  //     slots`,
  //     html: `<p>Please contact the owner on WhatsApp (+82 10-9539-9012) and he will help you make an appointment.</p>  <a aria-label="Chat on WhatsApp" href="https://wa.me/821095399012">
  //       <img alt="Chat on WhatsApp" src="assets/images/whatsapp/WhatsAppButtonGreenLarge.svg" />
  //     </a>`,
  //     icon: `info`,
  //     iconHtml: `<span>&#128522;</span>`,
  //     confirmButtonText: "Okay",
  //     customClass: {
  //       icon: "no-border",
  //     },
  //   });
  // }, []);

  useEffect(() => {
    //TODO: fetch for the date today or the provided date when modifying date
    //make sure these fire at the same time...
    Promise.all([getSettings(), handleGetSlots(moment())]);
  }, []);

  useEffect(() => {
    if (submitBookingStatus === STATUS_COMPLETED) {
      //navigate to the see appointment page with the made appointment..
      //may be show some status of the appointment..
      history.push(`/appointment/${response}`);
    }
  }, [submitBookingStatus, response, history]);

  function modalError(message) {
    Modal.error({
      title: "Oops...!!",
      content: message ? message : "An error occurred. Please try again later",
      onOk: () => {
        history.push("/");
      },
    });
  }

  if (error) {
    modalError(error);
  }
  if (getSettingsErrorMessage) {
    modalError(getSettingsErrorMessage);
  }

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
