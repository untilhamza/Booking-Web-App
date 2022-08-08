import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { v4 as uuidv4 } from "uuid";
import { CheckboxGroup, Checkbox, Calendar, useDateFormatter, Button, Grid, View, Heading, Flex, Content } from "@adobe/react-spectrum";
import styled from "styled-components";
// import { combineDateTimeMoment } from "../../util/helpers";

const BlockSettingsBoard = ({ onConfirm, onCancel, selectedDate, onSelectDate, slots, settings }) => {
  const { startTime, endTime, slotSize } = settings;
  const [selected, setSelected] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);

  function markBookedSlots(slots) {
    const alreadyBlocked = [];
    if (slots) {
      for (let remoteSlot of slots) {
        if (remoteSlot.isBlocked) alreadyBlocked.push(remoteSlot.time);
      }
    }
    return alreadyBlocked;
  }

  useEffect(() => {
    setSelected(markBookedSlots(slots));
  }, [slots]);

  function convertInternationalDateToMoment(date) {
    return moment(date.toDate(getLocalTimeZone()).toISOString());
  }

  function convertMomentDateToInternationDate(date) {
    return parseDate(date.format("YYYY-MM-DD"));
  }

  function handleSelectDate(intDate) {
    onSelectDate(convertInternationalDateToMoment(intDate));
  }

  const handleSave = () => {
    onConfirm(selected);
  };

  const checkAvailability = useCallback(function (slot) {
    if (!slots || slots.length === 0) return false; //not taken

    return slots.some((remoteSlot) => remoteSlot.isBooked && remoteSlot.time === slot.time); //|| isPast;
  }, []);

  const makeBox = useCallback((boxData) => {
    const isTaken = checkAvailability(boxData);

    return (
      <Checkbox height="size-400" value={boxData.time} isDisabled={isTaken} key={boxData.id}>
        <TimeText isDisabled={isTaken}>{boxData.time}</TimeText>
      </Checkbox>
    );
  }, []);

  const makeSlots = useCallback((start, end, slotSize) => {
    const timeSlots = [];
    const startTime = moment(start, "h:mma");
    const endTime = moment(end, "h:mma");

    while (startTime <= endTime) {
      const boxData = { time: startTime.clone().format("LT"), id: uuidv4() };
      timeSlots.push(makeBox(boxData));
      startTime.add(slotSize, "minutes");
    }
    return timeSlots;
  }, []);

  useEffect(() => {
    setTimeOptions(makeSlots(startTime, endTime, slotSize));
  }, [slots, makeSlots, startTime, endTime, slotSize]);

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
              <DateText> {selectedDate && formatter.format(convertMomentDateToInternationDate(selectedDate).toDate(getLocalTimeZone()))}</DateText>
            </Heading>
            <Flex direction="row" justifyContent="space-between">
              <Button variant="cta" onPress={handleSave}>
                Save
              </Button>
              <Button variant="negative" onPress={onCancel}>
                Back
              </Button>
            </Flex>
          </View>
          <View padding="size-300" borderWidth="thin" borderColor="dark" borderRadius="medium">
            <Flex justifyContent={"center"}>
              <Calendar onChange={handleSelectDate} minValue={today(getLocalTimeZone())} value={convertMomentDateToInternationDate(selectedDate)} />
            </Flex>
          </View>
        </Flex>
        <View gridArea="slots" padding="size-300" color={"green-400"} borderWidth="thin" borderColor="dark" borderRadius="medium">
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
