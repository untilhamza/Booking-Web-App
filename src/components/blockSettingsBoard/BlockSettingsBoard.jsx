//import Calendar from "../Calendar/Calendar";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { v4 as uuidv4 } from "uuid";
import { CheckboxGroup, Checkbox, Calendar, useDateFormatter, Button, Grid, View, Heading, Flex, Content, ProgressCircle } from "@adobe/react-spectrum";
import { STATUS_PENDING } from "../../hooks/useHttp";
import styled from "styled-components";

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
  const [selected, setSelected] = useState(getDisabledSlots());
  const [dateValue, setDateValue] = useState(today(getLocalTimeZone()));
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  //TODO: find the best way to pass these disabled slots-0
  function getDisabledSlots() {
    if (slots) return slots.map((item) => item.time);
    else return [];
  }

  console.log("slots", slots);
  const handleGetSlots = () => {
    let choosenDate = moment(formatter.format(dateValue.toDate(getLocalTimeZone())));
    onGetSlots(choosenDate);
  };

  const handleSave = () => {
    onConfirm(dateValue, selected);
  };

  //TODO: bring these back
  // useEffect(() => {
  //   if (slotStatus === STATUS_PENDING) setIsLoadingSlots(true);
  //   else setIsLoadingSlots(false);
  // }, [slotStatus]);

  useEffect(() => {
    //TODO: fetch new slots
    handleGetSlots();
  }, [dateValue]);

  function checkAvailability(slot) {
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
        height="size-400"
        value={boxData.time}
        isDisabled={isTaken} //if teh slot is in the slots array we got!!
        key={boxData.id}
      >
        <TimeText isDisabled={isTaken}>{boxData.time}</TimeText>
      </Checkbox>
    );
  };
  const makeSlots = (start, end, slotSize) => {
    const timeSlots = [];

    const startTime = moment(start, "h:mma");
    const endTime = moment(end, "h:mma");

    while (startTime <= endTime) {
      const boxData = { time: startTime.clone().format("LT"), id: uuidv4() };
      timeSlots.push(makeBox(boxData)); // clone to add new object
      startTime.add(slotSize, "minutes");
    }
    return timeSlots;
  };

  let boxes = [];

  // useEffect(() => {
  //   boxes = makeSlots(boxes, startTime, endTime, slotSize);
  // }, [slots]);

  let formatter = useDateFormatter({ dateStyle: "full" });
  const handleSelectDate = (newDate) => {
    console.log("new set date is", newDate);
    setDateValue(newDate);
  };

  return (
    <Flex justifyContent={"center"}>
      <Grid
        marginTop={"size-300"}
        width={{ M: "calc(100% - size-3000)", L: "" }}
        areas={{
          base: ["calendar", "slots"],
          M: ["calendar slots"],
        }}
        gap="size-200"
        columns={{
          base: ["1fr"],
          M: ["1fr", "1fr"],
        }}
      >
        <Flex gridArea="calendar" direction={"column"} gap="size-200">
          <View padding="size-300" borderWidth="thin" borderColor="dark" borderRadius="medium">
            <Heading level={4}>
              <Content>
                <span style={{ fontSize: "32px" }}>Block Slots for:</span>{" "}
              </Content>
              {dateValue && formatter.format(dateValue.toDate(getLocalTimeZone()))}
            </Heading>
            <Flex direction="row" justifyContent="space-between">
              <Button variant="cta" onPress={handleSave}>
                Save
              </Button>
              <Button
                variant="negative"
                onPress={() => {
                  console.log("cancelled");
                }}
              >
                Cancel
              </Button>
            </Flex>
          </View>
          <View padding="size-300" borderWidth="thin" borderColor="dark" borderRadius="medium">
            <Flex justifyContent={"center"}>
              <Calendar
                minValue={today(getLocalTimeZone())}
                // onChange={handleSelectDate}
                value={dateValue}
                onChange={handleSelectDate}
              />
            </Flex>
          </View>
        </Flex>
        <View gridArea="slots" padding="size-300" color={"green-400"} borderWidth="thin" borderColor="dark" borderRadius="medium">
          {isLoadingSlots ? (
            <Flex justifyContent={"center"}>
              <ProgressCircle aria-label="Loading…" isIndeterminate />
            </Flex>
          ) : (
            <CheckboxGroup aria-label="time-slots" value={selected} onChange={setSelected}>
              <Grid
                gap="size-100"
                columns={{
                  base: ["1fr", "1fr"],
                  L: ["1fr", "1fr", "1fr"],
                }}
              >
                {makeSlots(startTime, endTime, slotSize)}
              </Grid>
            </CheckboxGroup>
          )}
        </View>
      </Grid>
    </Flex>
  );
};

export default BlockSettingsBoard;

const TimeText = styled.span`
  color: ${(props) => props.isDisabled || "#267feb"};
`;
