import React, { useCallback, useContext, useEffect } from "react"
// import { SLOTS as UISLOTS } from "../../util/data"

import { v4 as uuidv4 } from "uuid"
import "./TimeSelector.css"
import LinearProgress from "@mui/material/LinearProgress"

import { combineDateTimeMoment } from "../../util/helpers"
import { STATUS_COMPLETED, STATUS_PENDING } from "../../hooks/useHttp"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"

import moment from "moment"

import Button from "react-bootstrap/Button"

const TimeSelector = ({
  choosenDate,
  onChange,
  time: selectedTime,
  slots,
  loading,
  settings,
}) => {
  const { startTime, endTime, slotSize } = settings

  function checkAvailability(slot) {
    const time = slot.time
    const slotMoment = combineDateTimeMoment(
      choosenDate,
      moment(slot.time, "h:mm a")
    )
    const isPast = slotMoment < moment()

    //TODO: checked if it was not blocked too
    return slots?.some((obj) => obj.time === time && obj.isBooked) || isPast
  }

  const makeButton = (buttonData) => {
    return (
      <Button
        variant={`${
          buttonData.time === selectedTime
            ? "success"
            : checkAvailability(buttonData)
            ? "secondary"
            : "primary"
        }`}
        disabled={checkAvailability(buttonData)} //if teh slot is in the slots array we got!!
        key={buttonData.id}
        onClick={() => handleTimeChange(buttonData.time)}
      >
        {buttonData.time}
      </Button>
    )
  }

  const makeSlots = (timeSlots, start, end, slotSize) => {
    // const timeSlots = []

    var startTime = moment(start, "h:mma")
    var endTime = moment(end, "h:mma")

    while (startTime <= endTime) {
      const buttonData = { time: startTime.clone().format("LT"), id: uuidv4() }
      timeSlots.push(makeButton(buttonData)) // clone to add new object
      startTime.add(slotSize, "minutes")
    }

    return timeSlots
  }

  // let buttons = UISLOTS.map((uiSlot) => (
  //   <Button
  //     variant={`${
  //       uiSlot.time === selectedTime
  //         ? "success"
  //         : checkAvailability(uiSlot)
  //         ? "secondary"
  //         : "primary"
  //     }`}
  //     disabled={checkAvailability(uiSlot)} //if teh slot is in the slots array we got!!
  //     key={uiSlot.id}
  //     onClick={() => handleTimeChange(uiSlot.time)}
  //   >
  //     {uiSlot.time}
  //   </Button>
  // ))
  let buttons = []
  buttons = makeSlots(buttons, startTime, endTime, slotSize)

  // useEffect(() => {
  //   buttons = makeSlots(buttons, startTime, endTime, slotSize)
  // }, [])

  const handleTimeChange = useCallback((time) => {
    if (loading === STATUS_PENDING) return
    onChange(time)
  }, [])

  return (
    <>
      <p className="fw-bold">
        Showing slots for : {"  "}
        <span className="text-primary  choosen-date">
          {choosenDate.format("dddd DD/MM/YYYY").toString()}
          {/* {console.log(choosenDate.calendar())} */}
        </span>
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
      <div className="mb-3 mt-2 h-25">
        {loading === STATUS_PENDING && <LinearProgress />}
      </div>
      {/* {dont show this time thing until you have loaded the} */}
      <div className="time-container"> {buttons}</div>
    </>
  )
}

export default TimeSelector
