import React, { useEffect, useCallback } from "react";
import { SLOTS } from "../../data";
import "./TimeSelector.css";

import Button from "react-bootstrap/Button";

const TimeSelector = ({ choosenDate, onChange, time, slots }) => {
  //console.log("sent time", time);
  // const [userTime, setUserTime] = useState(time);
  // const [day, setDay] = useState(choosenDate.format("dddd DD-MM-YYYY"));
  // const day = choosenDate.format("dddd DD-MM-YYYY");
  //console.log("time is ", choosenDate);

  function checkAvailability(slot) {
    const time = slot.time;
    //console.log(slots?.some((obj) => obj.time === time));
    return slots?.some((obj) => obj.isBooked && obj.time === time);
  }

  const handleTimeChange = useCallback(
    (time) => {
      // setUserTime(time);
      onChange(time);
    },
    [onChange]
  );

  useEffect(() => {
    //handleTimeChange("");
  }, [choosenDate]);

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
            : checkAvailability(slot)
            ? "secondary"
            : "primary"
        }`}
        disabled={checkAvailability(slot)} //if teh slot is in the slots array we got!!
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
      <div className="time-container">{buttons}</div>
    </>
  );
};

export default TimeSelector;
