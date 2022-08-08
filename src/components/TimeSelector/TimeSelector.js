import { v4 as uuidv4 } from "uuid";
import "./TimeSelector.css";
import LinearProgress from "@mui/material/LinearProgress";

import { combineDateTimeMoment } from "../../util/helpers";
import { STATUS_PENDING } from "../../hooks/useHttp";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import moment from "moment";

import Button from "react-bootstrap/Button";

const TimeSelector = ({ choosenDate, onChange, time: selectedTime, slots, loading: loadingBookedSlots, settings }) => {
  const { startTime, endTime, slotSize } = settings;

  function checkAvailability(slot) {
    const time = slot.time;
    const slotMoment = combineDateTimeMoment(choosenDate, moment(slot.time, "h:mm a"));
    const isPast = slotMoment < moment();

    //TODO: checked if it was not blocked too
    return slots?.some((obj) => obj.time === time && (obj.isBooked || obj.isBlocked)) || isPast;
  }

  const makeButton = (buttonData) => {
    return (
      <Button
        variant={`${buttonData.time === selectedTime ? "success" : checkAvailability(buttonData) ? "secondary" : "primary"}`}
        disabled={checkAvailability(buttonData)} //if teh slot is in the slots array we got!!
        key={buttonData.id}
        onClick={() => handleTimeChange(buttonData.time)}
      >
        {buttonData.time}
      </Button>
    );
  };

  const makeSlots = (timeSlots, start, end, slotSize) => {
    // const timeSlots = []

    var startTime = moment(start, "h:mma");
    var endTime = moment(end, "h:mma");

    while (startTime <= endTime) {
      const buttonData = { time: startTime.clone().format("LT"), id: uuidv4() };
      timeSlots.push(makeButton(buttonData));
      startTime.add(slotSize, "minutes");
    }

    return timeSlots;
  };

  let buttons = [];
  // these are props, so the component re-renders if they change
  buttons = makeSlots(buttons, startTime, endTime, slotSize);

  const handleTimeChange = (time) => {
    //prevent any
    if (loadingBookedSlots === STATUS_PENDING) return;
    onChange(time);
  };

  return (
    <>
      <p className="fw-bold">
        Showing slots for : {"  "}
        <span className="text-primary  choosen-date">{choosenDate.format("dddd DD/MM/YYYY").toString()}</span>
      </p>
      <div className="d-flex mt-2 text-capitalize text-bold gap-4">
        {" "}
        <span className="text-primary fw-bold">
          {" "}
          <FiberManualRecordIcon color="primary" /> Available{" "}
        </span>{" "}
        <span className="text-success fw-bold">
          {" "}
          <FiberManualRecordIcon color="success" /> Selected
        </span>
        <span className="text-secondary fw-bold">
          {" "}
          <FiberManualRecordIcon color="action" /> Unavailable
        </span>
      </div>
      <div className="mb-3 mt-2 h-25">{loadingBookedSlots === STATUS_PENDING && <LinearProgress />}</div>
      <div className="time-container"> {buttons}</div>
    </>
  );
};

export default TimeSelector;
