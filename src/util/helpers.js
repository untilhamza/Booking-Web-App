import moment from "moment";
import { v4 as uuidv4 } from "uuid";
const combineDateTimeMoment = (dateMoment, timeMoment) => {
  return dateMoment
    .set({
      hour: timeMoment.get("hour"),
      minute: timeMoment.get("minute"),
      second: 0,
    })
    .clone();
};

const compareTimes = (start, end) => {
  var beginningTime = moment(start, "h:mma");
  var endTime = moment(end, "h:mma");
  return beginningTime.isBefore(endTime);
};

const makeSlots = (start, end, slotSize) => {
  const timeSlots = [];

  var startTime = moment(start, "h:mma");
  var endTime = moment(end, "h:mma");

  while (startTime <= endTime) {
    timeSlots.push({ time: startTime.clone().format("LT"), id: uuidv4() }); // clone to add new object
    startTime.add(slotSize, "minutes");
  }
  //console.log(timeSlots)
  return timeSlots;
};

const setStatus = (status) => {
  if (status === "confirmed") return "success"; // return "bg-success"
  if (status === "completed") return "primary"; //return "bg-primary"
  if (status === "cancelled") return "danger"; //return "bg-danger"
};
export { combineDateTimeMoment, setStatus, compareTimes, makeSlots };
