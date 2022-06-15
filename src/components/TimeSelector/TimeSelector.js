import React, { useCallback } from "react"
import { SLOTS as UISLOTS } from "../../data"
import "./TimeSelector.css"
import LinearProgress from "@mui/material/LinearProgress"
import Box from "@mui/material/Box"
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
}) => {
  function checkAvailability(slot) {
    const time = slot.time
    const slotMoment = combineDateTimeMoment(
      choosenDate,
      moment(slot.time, "h:mm a")
    )

    return slots?.some((obj) => obj.time === time) || slotMoment < moment()
  }

  let buttons = UISLOTS.map((uiSlot) => (
    <Button
      variant={`${
        uiSlot.time === selectedTime
          ? "success"
          : checkAvailability(uiSlot)
          ? "secondary"
          : "primary"
      }`}
      disabled={checkAvailability(uiSlot)} //if teh slot is in the slots array we got!!
      key={uiSlot.id}
      onClick={() => handleTimeChange(uiSlot.time)}
    >
      {uiSlot.time}
    </Button>
  ))

  const handleTimeChange = useCallback(
    (time) => {
      if (loading === STATUS_PENDING) return
      onChange(time)
    },
    [onChange]
  )

  return (
    <>
      <p className="fw-bolder">
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
      <div className="time-container"> {buttons}</div>
    </>
  )
}

export default TimeSelector
