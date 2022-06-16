import { v4 as uuidv4 } from "uuid"
import moment from "moment"

//the slots data is also for a given data => today!!!

const timeSlots = []

var startHour = 10
var startMinute = 30
var duration = 30

var endHour = 19
var endMinute = 30

var startTime = moment().hour(startHour).minute(startMinute).second(0)
var endTime = moment().hour(endHour).minute(endMinute).second(0)

while (startTime <= endTime) {
  timeSlots.push({ time: startTime.clone().format("LT"), id: uuidv4() }) // clone to add new object
  startTime.add(duration, "minutes")
}

//console.log("time slots ", timeSlots)

export { timeSlots as SLOTS }
