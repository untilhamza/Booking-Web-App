import { useEffect, useState, useCallback } from "react";
import CheckingForm from "../components/CheckingForm/CheckingForm";
import { useHistory } from "react-router-dom";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpCheckBooking, httpCancelBooking } from "../http/serverInterface";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import ErrorModal from "../components/ErrorModal/ErrorModal";
import { Modal } from "antd";
import AppointmentsList from "../components/AppointmentsList";
import useQuery from "../hooks/useQuery";
import * as yup from "yup";
import TrackingCode from "../components/TrackingCode";
import GoogleAnalytics from "../components/GoogleAnalytics";

const koreanPhoneRegex = /^((\+82))((10\d{7,8})|(2\d{8}))$/;

let schema = yup.object().shape({
  phoneNumber: yup.string().matches(koreanPhoneRegex, { message: "Must be a valid Korean phone number starting with +82" }).required("*Phone number is required!"),
});

const CheckAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  const history = useHistory();

  let query = useQuery();
  // let queryEmail = query.get("email") || "";
  let queryPhoneNumber = query.get("phone") || "";

  if (queryPhoneNumber !== "") {
    queryPhoneNumber = "+" + queryPhoneNumber.trim();
  }

  const { status: checkBookingStatus, data: response, error: errorMessage, sendRequest } = useHttp(httpCheckBooking);

  const { error: cancelBookingError, sendRequest: cancelRequest } = useHttp(httpCancelBooking, true);

  function handleChecking(userPhoneNumber) {
    //TODO: add the email to the query
    history.push({
      pathname: window.location.pathname,
      search: "?phone=" + userPhoneNumber,
    });
    sendRequest(userPhoneNumber);
  }

  useEffect(() => {
    const phoneNumber = queryPhoneNumber;
    console.log(phoneNumber);
    schema
      .isValid({
        phoneNumber: phoneNumber,
      })
      .then((valid) => {
        if (valid) {
          handleChecking(queryPhoneNumber);
        } else {
          //TODO: clear all params
          history.push({
            pathname: window.location.pathname,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (checkBookingStatus === STATUS_COMPLETED) {
      if (errorMessage) {
        ErrorModal({
          message: errorMessage,
          onOk: () => {
            history.push("/");
          },
        });
      } else {
        setAppointments(response);
      }
    }
  }, [checkBookingStatus, response, history, errorMessage]);

  function success() {
    Modal.success({
      content: "Appointment was cancelled!",
      onOk: () => history.go(0),
    });
  }

  function errorModal(message) {
    Modal.error({
      title: "Oops...!!",
      content: message ? message : "Something went wrong",
      onOk: () => history.push("/"),
    });
  }

  const handleCancel = (id) => {
    cancelRequest(id);
    success();
    //show that you have finished cancelling...
  };

  if (cancelBookingError) {
    errorModal("Failed to cancel the booking, please try again later.");
    return;
    // return <div>{error} didnot find the appointment</div>;
  }

  function handleBack() {
    history.push("/");
  }

  return (
    <div>
      <TrackingCode />
      <GoogleAnalytics />
      <SimpleBackdrop loading={checkBookingStatus === STATUS_PENDING} />
      <CheckingForm onConfirm={handleChecking} onCancel={handleBack} initialPhoneNumber={queryPhoneNumber} />
      {<AppointmentsList appointments={appointments} onCancel={handleCancel} />}
    </div>
  );
};

export default CheckAppointment;
