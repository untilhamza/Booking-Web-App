import React, { useState, useEffect, useCallback } from "react";
import { SLOTS } from "../data";
import "./TimeSelector.css";

import Button from "react-bootstrap/Button";

const TimeSelector = ({ choosenDate, onChange, time }) => {
  //console.log("sent time", time);
  // const [userTime, setUserTime] = useState(time);
  const [day, setDay] = useState(choosenDate.format("dddd DD-MM-YYYY"));
  //console.log("time is ", choosenDate);
  const handleTimeChange = useCallback(
    (time) => {
      // setUserTime(time);
      onChange(time);
    },
    [onChange]
  );

  useEffect(() => {
    console.log("fetch slot data for ", choosenDate.format("dddd DD-MM-YYYY"));
    setDay(choosenDate.format("dddd DD-MM-YYYY"));
    handleTimeChange("");
  }, [choosenDate, handleTimeChange]);

  //console.log(choosenDate.toDate());

  //can put this in useEffect for choose time to pull slots for choosen date from the db
  //const timeSlots = useTime(props.choosenDate);

  const buttons = [];
  SLOTS.forEach((slot) =>
    buttons.push(
      <Button
        variant={`${
          slot.time === time
            ? "success"
            : slot.isBooked
            ? "secondary"
            : "primary"
        }`}
        disabled={slot.isBooked}
        key={slot.id}
        onClick={() => handleTimeChange(slot.time)}
      >
        {slot.time} hrs
      </Button>
    )
  );

  return (
    <>
      <p className="">
        Select time slot for : {"  "}
        <span className="text-primary font-weight-bold choosen-date">
          {choosenDate.format("dddd DD/MM/YYYY").toString()}
        </span>
      </p>
      <div>{day}</div>
      <div className="time-container">{buttons}</div>
    </>
  );
};

export default TimeSelector;
