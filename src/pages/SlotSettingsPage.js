import React, { useEffect } from "react";
import useHttp, { STATUS_COMPLETED, STATUS_PENDING } from "../hooks/useHttp";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
  httpSubmitBooking,
  httpGetSlots,
  httpGetSettings,
} from "../hooks/request";
import SimpleBackdrop from "../components/BackDrop/BackDrop";
import BlockSettingsBoard from "../components/blockSettingsBoard/BlockSettingsBoard";
const SlotSettingsPage = () => {
  const history = useHistory();
  const {
    status: getSettingsStatus,
    data: settings,
    error: getSettingsErrorMessage,
    sendRequest: getSettings,
  } = useHttp(httpGetSettings);

  //TODO: get submit blocked slots instead
  //TODO: it takes an array of slots to block and the date for which they belong

  const {
    status: submitBookingStatus,
    data: response,
    error,
    sendRequest,
  } = useHttp(httpSubmitBooking);

  const {
    status: slotStatus,
    data: slotsArray,
    sendRequest: sendRequestSlots,
  } = useHttp(httpGetSlots);

  function handleGetSlots(date) {
    return sendRequestSlots(date);
  }
  function handleConfirm(timesArray, date) {}

  function handleCancel() {
    function handleCancel() {
      history.goBack();
    }
  }

  useEffect(() => {
    //TODO: fetch for the date today or the provided date when modifying date
    //make sure these fire at the same time...
    Promise.all([getSettings(), handleGetSlots(moment())]);
  }, []);

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  return (
    <>
      <SimpleBackdrop loading={submitBookingStatus === STATUS_PENDING} />
      <SimpleBackdrop loading={getSettingsStatus === STATUS_PENDING} />
      {getSettingsStatus === STATUS_COMPLETED && (
        <BlockSettingsBoard
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onGetSlots={handleGetSlots}
          slots={slotsArray}
          slotStatus={slotStatus}
          settings={settings}
        />
      )}
    </>
  );
};

export default SlotSettingsPage;
