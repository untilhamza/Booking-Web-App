import React, { useEffect, useState } from "react";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import Swal from "sweetalert2";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { httpSubmitBlockedSlots, httpGetSlots, httpGetSettings } from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import BlockSettingsBoard from "../components/blockSettingsBoard/BlockSettingsBoard";
const SlotSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const { status: getSettingsStatus, data: settings, error: getSettingsErrorMessage, sendRequest: getSettings } = useHttp(httpGetSettings);

  //TODO: get submit blocked slots instead
  //TODO: it takes an array of slots to block and the date for which they belong

  const { status: submitBlockedSlots, data: responseOnSubmitSlots, error: submitSlotsErrorMessage, sendRequestSubmitSlots } = useHttp(httpSubmitBlockedSlots);

  const { status: getSlotsStatus, data: slotsArray, sendRequest: sendRequestSlots, error: getSlotsError } = useHttp(httpGetSlots);

  useEffect(() => {
    const message = getSettingsErrorMessage || getSlotsError || submitSlotsErrorMessage;
    if (message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message || "Something went wrong!",
        confirmButtonText: "Go Home",
        allowOutsideClick: false,
      }).then(() => {
        history.push("/");
      });
    }
  }, [getSettingsErrorMessage, getSlotsError, submitSlotsErrorMessage]);

  function handleGetSlots(date) {
    return sendRequestSlots(date);
  }

  function handleConfirm(date, timesArray) {
    console.log("date", date);
    console.log("slots", timesArray);
  }

  function handleCancel() {
    history.goBack();
  }

  useEffect(() => {
    //TODO: fetch for the date today or the provided date when modifying date
    //make sure these fire at the same time...
    Promise.all([getSettings(), handleGetSlots(moment())]);
  }, []);

  useEffect(() => {
    if (getSettingsStatus === STATUS_PENDING) setIsLoading(true);
    else setIsLoading(false);
  }, [getSettingsStatus]);

  return (
    <>
      <SimpleBackdrop loading={isLoading} />
      {getSettingsStatus === STATUS_COMPLETED && (
        <BlockSettingsBoard onConfirm={handleConfirm} onCancel={handleCancel} onGetSlots={handleGetSlots} slots={slotsArray} slotStatus={getSlotsStatus} settings={settings} />
      )}
    </>
  );
};

export default SlotSettingsPage;
