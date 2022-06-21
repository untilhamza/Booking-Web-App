import moment from "moment"
const combineDateTimeMoment = (dateMoment, timeMoment) => {
  return dateMoment
    .set({
      hour: timeMoment.get("hour"),
      minute: timeMoment.get("minute"),
      second: 0,
    })
    .clone()
}

const compareTimes = (start, end) => {
  var beginningTime = moment(start, "h:mma")
  var endTime = moment(end, "h:mma")
  return beginningTime.isBefore(endTime)
}

const setStatus = (status) => {
  if (status === "confirmed") return "success" // return "bg-success"
  if (status === "completed") return "primary" //return "bg-primary"
  if (status === "cancelled") return "danger" //return "bg-danger"
}
export { combineDateTimeMoment, setStatus, compareTimes }
