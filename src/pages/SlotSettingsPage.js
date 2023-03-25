import { useEffect, useState, useCallback } from "react";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import Swal from "sweetalert2";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { httpSubmitBlockedSlots, httpGetSlots, httpGetSettings } from "../http/serverInterface";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import BlockSettingsBoard from "../components/blockSettingsBoard/BlockSettingsBoard";
import TrackingCode from "../components/TrackingCode";
import GoogleAnalytics from "../components/GoogleAnalytics";

const SlotSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chosenDate, setChosenDate] = useState(moment());
  const history = useHistory();

  const { status: getSettingsStatus, data: settings, error: getSettingsErrorMessage, sendRequest: getSettings } = useHttp(httpGetSettings);

  //TODO: get submit blocked slots instead
  //TODO: it takes an array of slots to block and the date for which they belong

  const { status: submitBlockedSlotsStatus, data: responseOnSubmitSlots, error: submitSlotsErrorMessage, sendRequest: sendRequestSubmitSlots } = useHttp(httpSubmitBlockedSlots);

  const { status: getSlotsStatus, data: remoteSlotsArray, sendRequest: sendRequestSlots, error: getSlotsErrorMessage } = useHttp(httpGetSlots);

  const handleGetSlots = useCallback(function (date) {
    sendRequestSlots(date);
  }, []);

  function handleSetCalendarDate(momentDate) {
    handleGetSlots(momentDate);
    setChosenDate(momentDate);
  }

  function handleSubmitBlockedSlots(timesArray) {
    if (timesArray) {
      sendRequestSubmitSlots(chosenDate, timesArray);
    }
  }

  function handleCancel() {
    history.goBack();
  }

  useEffect(() => {
    Promise.all([getSettings(), handleGetSlots(chosenDate)]);
  }, []);

  useEffect(() => {
    if (getSlotsErrorMessage)
      Swal.fire({
        icon: "error",
        title: "Error 😔",
        text: getSlotsErrorMessage || "There was an error",
        confirmButtonText: "Go Home",
        allowOutsideClick: false,
      }).then(() => {
        //TODO: record this error with sentry
        history.push("/");
      });
  }, [getSlotsErrorMessage, history]);

  useEffect(() => {
    if (getSettingsStatus === STATUS_PENDING) setIsLoading(true);
    if (getSettingsStatus === STATUS_COMPLETED) {
      setIsLoading(false);
      if (getSettingsErrorMessage) {
        Swal.fire({
          icon: "error",
          title: "Error 😔",
          text: getSettingsErrorMessage || "There was an error",
          confirmButtonText: "Go Home",
          allowOutsideClick: false,
        }).then(() => {
          //TODO: record this error with sentry
          history.push("/");
        });
      }
    }
  }, [getSettingsStatus, getSettingsErrorMessage, history]);

  useEffect(() => {
    if (getSlotsStatus === STATUS_PENDING) setIsLoading(true);
    else setIsLoading(false);
  }, [getSlotsStatus]);

  useEffect(() => {
    if (submitBlockedSlotsStatus === STATUS_PENDING) setIsLoading(true);
    if (submitBlockedSlotsStatus === STATUS_COMPLETED) {
      setIsLoading(false);
      if (submitSlotsErrorMessage) {
        Swal.fire({
          icon: "error",
          title: "Error 😔",
          text: submitSlotsErrorMessage || "There was an error",
          confirmButtonText: "Go Home",
          allowOutsideClick: false,
        }).then(() => {
          //TODO: record this error with sentry
          history.push("/");
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success 😅",
          text: "Your changes have been saved",
          confirmButtonText: "Okay",
          allowOutsideClick: false,
        }).then(() => {
          handleGetSlots(chosenDate);
          //setDaySlots(responseOnSubmitSlots);
        });
      }
    }
  }, [submitBlockedSlotsStatus, responseOnSubmitSlots, submitSlotsErrorMessage, handleGetSlots, chosenDate, history]);

  return (
    <>
      <TrackingCode />
      <GoogleAnalytics />
      <SimpleBackdrop loading={isLoading} />
      {getSettingsStatus === STATUS_COMPLETED && getSlotsStatus === STATUS_COMPLETED && (
        <BlockSettingsBoard
          onConfirm={handleSubmitBlockedSlots}
          selectedDate={chosenDate}
          onSelectDate={handleSetCalendarDate}
          onCancel={handleCancel}
          slots={remoteSlotsArray}
          slotStatus={getSlotsStatus}
          settings={settings}
        />
      )}
    </>
  );
};

export default SlotSettingsPage;
