import { useEffect, useContext } from "react";
import Appointment from "../components/Appointment/Appointment";
import { useHistory, useParams } from "react-router-dom";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import { httpGetBooking, httpCancelBooking } from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import { Modal } from "antd";
import AuthContext from "../store/auth-context";

const ViewAppointment = () => {
  const authCtx = useContext(AuthContext);
  //only try to fetch if there is an id..
  const history = useHistory();

  const { id } = useParams();

  if (!id) {
    history.goBack("/");
  }

  //if id is not a string we go back
  if (typeof id !== "string" || id instanceof String) history.push("/");

  const { status, data: response, error: getBookingError, sendRequest } = useHttp(httpGetBooking, true);

  const { error: cancelBookingError, sendRequest: cancelRequest } = useHttp(httpCancelBooking, true);

  useEffect(() => {
    //if no id, just go to the home page
    if (!id) {
      history.push("/");
    }

    sendRequest(id);
  }, [id, history, sendRequest]);

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

  const handleHome = () => {
    history.push("/");
  };

  const handleBack = () => {
    if (authCtx.isLoggedIn) history.goBack();
    else history.push("/");
  };

  if (cancelBookingError) {
    // errorModal("Failed to cancel the booking, please try again later.");
    return;
    // return <div>{error} didnot find the appointment</div>;
  }

  if (getBookingError) {
    errorModal("No booking found, please try again later.");
    return;
  }

  return (
    <div>
      <SimpleBackdrop loading={status === STATUS_PENDING} />
      {status === STATUS_COMPLETED && <Appointment onEdit={() => {}} onCancel={handleCancel} onDone={handleHome} onBack={handleBack} appointmentData={response} isAdmin={authCtx.isLoggedIn} />}
    </div>
  );
};

export default ViewAppointment;
