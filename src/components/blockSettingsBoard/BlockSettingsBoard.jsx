//import Calendar from "../Calendar/Calendar";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { v4 as uuidv4 } from "uuid";
import {
  CheckboxGroup,
  Checkbox,
  Calendar,
  useDateFormatter,
  Button,
  repeat,
  Grid,
  View,
  Heading,
  Flex,
  Content,
} from "@adobe/react-spectrum";

/*
 slots={slots}

*/
const BlockSettingsBoard = ({
  //   date,
  onConfirm,
  onCancel,
  onGetSlots,
  status,
  slots,
  slotStatus,
  settings,
}) => {
  const { startTime, endTime, slotSize } = settings;
  const disabledSlots = slots.map((item) => item.time);
  let [selected, setSelected] = useState(disabledSlots);
  let [dateValue, setDateValue] = useState(today(getLocalTimeZone()));

  useEffect(() => {
    //TODO: fetch new slots
    //onGetSlots
  }, [dateValue]);

  function checkAvailability(slot) {
    console.log(
      slot.time,
      "is ",
      slots.some((obj) => obj.time === slot.time)
    );
    return slots.some((obj) => obj.time === slot.time);

    //TODO: disable slots for days of the past.
    // const time = slot.time;
    // const slotMoment = combineDateTimeMoment(
    //   choosenDate,
    //   moment(slot.time, "h:mm a")
    // );
    // const isPast = slotMoment < moment();

    // //TODO: checked if it was not blocked too
    // return slots?.some((obj) => obj.time === time && obj.isBooked) || isPast;
  }
  const makeBox = (boxData) => {
    const isTaken = checkAvailability(boxData);
    return (
      <Checkbox
        value={boxData.time}
        isDisabled={isTaken} //if teh slot is in the slots array we got!!
        key={boxData.id}
      >
        {boxData.time}
      </Checkbox>
    );
  };
  const makeSlots = (timeSlots, start, end, slotSize) => {
    // const timeSlots = []

    var startTime = moment(start, "h:mma");
    var endTime = moment(end, "h:mma");

    while (startTime <= endTime) {
      const boxData = { time: startTime.clone().format("LT"), id: uuidv4() };
      timeSlots.push(makeBox(boxData)); // clone to add new object
      startTime.add(slotSize, "minutes");
    }
    return timeSlots;
  };

  let boxes = [];
  boxes = makeSlots(boxes, startTime, endTime, slotSize);

  console.log("slots", slots);
  console.log("slotStatus", slotStatus);
  console.log("settings", settings);
  let formatter = useDateFormatter({ dateStyle: "full" });
  //console.log(bookings);
  //console.log(date);
  const handleSelectDate = (newDate) => {
    console.log("new set date is", newDate);
    setDateValue(newDate);
  };
  return (
    <div className="container p-3">
      <div className="d-flex gap-3 flex-column flex-md-row">
        <div className="col">
          <Calendar
            minValue={today(getLocalTimeZone())}
            // onChange={handleSelectDate}
            value={dateValue}
            onChange={handleSelectDate}
          />
        </div>
        <div className="col">
          {/* <BookingTable
            date={date}
            bookings={bookings}
            status={status}
            onView={onView}
          /> */}
          <div>
            <View backgroundColor="positive" padding="size-300">
              <Heading level={4} variant="cta">
                {" "}
                <Content>Block Slots for: </Content>
                {dateValue &&
                  formatter.format(dateValue.toDate(getLocalTimeZone()))}
              </Heading>{" "}
              <Flex>
                <Button
                  variant="overBackground"
                  justifySelf="stretch"
                  onPress={() => {
                    console.log(selected);
                  }}
                >
                  Save
                </Button>
              </Flex>
            </View>
          </div>
          <CheckboxGroup
            aria-label="time-slots"
            value={selected}
            onChange={setSelected}
          >
            <Grid
              columns={repeat("auto-fill", "150px")}
              gap="size-100"
              justifyContent="space-between"
            >
              {boxes}
            </Grid>
          </CheckboxGroup>
        </div>
      </div>
    </div>
  );
};

export default BlockSettingsBoard;
