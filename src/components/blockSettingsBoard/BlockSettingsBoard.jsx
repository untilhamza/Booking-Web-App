//import Calendar from "../Calendar/Calendar";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { getLocalTimeZone, today } from "@internationalized/date";
import { v4 as uuidv4 } from "uuid";
import { CheckboxGroup, Checkbox, Calendar, useDateFormatter, Button, Grid, View, Heading, Flex, Content, ProgressCircle } from "@adobe/react-spectrum";
import { STATUS_PENDING } from "../../hooks/useHttp";
import styled from "styled-components";
import { combineDateTimeMoment } from "../../util/helpers";

const BlockSettingsBoard = ({ onConfirm, onCancel, onGetSlots, status, slots, slotStatus, settings }) => {
  const { startTime, endTime, slotSize } = settings;
  const [selected, setSelected] = useState([]);
  const [dateValue, setDateValue] = useState(today(getLocalTimeZone()));
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    if (slotStatus === STATUS_PENDING) setIsLoadingSlots(true);
    else setIsLoadingSlots(false);
  }, [slotStatus]);

  function markBookedSlots(slots) {
    if (slots) return slots.map((item) => item.time);
    else return [];
  }

  useEffect(() => {
    setSelected(markBookedSlots(slots));
  }, [slots]);

  const handleGetSlots = () => {
    let choosenDate = moment(formatter.format(dateValue.toDate(getLocalTimeZone())));
    onGetSlots(choosenDate);
  };

  const handleSave = () => {
    onConfirm(dateValue, selected);
  };

  useEffect(() => {
    handleGetSlots();
  }, [dateValue]);

  function checkAvailability(slot) {
    if (!slots || slots.length === 0) {
      return false;
    }
    //return slots.some((obj) => obj.time === slot.time);

    //TODO: disable slots for days of the past.
    // const time = slot.time;
    // const slotMoment = combineDateTimeMoment(dateValue, moment(slot.time, "h:mm a"));
    // const isPast = slotMoment < moment();

    // //TODO: checked if it was not blocked too
    return slots.some((obj) => obj.time === slot.time); //|| isPast;
  }
  const makeBox = (boxData) => {
    const isTaken = checkAvailability(boxData);
    //TODO: The disabled should be added to the selected here...
    return (
      <Checkbox height="size-400" value={boxData.time} isDisabled={isTaken} key={boxData.id}>
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
      timeSlots.push(makeBox(boxData));
      startTime.add(slotSize, "minutes");
    }
    return timeSlots;
  };

  useEffect(() => {
    setTimeOptions(makeSlots(startTime, endTime, slotSize));
  }, [slots]);

  const handleSelectDate = (newDate) => {
    handleGetSlots();
    setDateValue(newDate);
  };
  let formatter = useDateFormatter({ dateStyle: "full" });

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
                <span>Block Slots for:</span>{" "}
              </Content>
              <DateText> {dateValue && formatter.format(dateValue.toDate(getLocalTimeZone()))}</DateText>
            </Heading>
            <Flex direction="row" justifyContent="space-between">
              <Button variant="cta" onPress={handleSave}>
                Save
              </Button>
              <Button variant="negative" onPress={onCancel}>
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
                {timeOptions}
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
const DateText = styled.span`
  color: #267feb;
`;
