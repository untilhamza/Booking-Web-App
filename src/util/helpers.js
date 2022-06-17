const combineDateTimeMoment = (dateMoment, timeMoment) => {
  return dateMoment
    .set({
      hour: timeMoment.get("hour"),
      minute: timeMoment.get("minute"),
      second: 0,
    })
    .clone()
}
const setStatus = (status) => {
  if (status === "confirmed") return "success" // return "bg-success"
  if (status === "completed") return "primary" //return "bg-primary"
  if (status === "cancelled") return "danger" //return "bg-danger"
}
export { combineDateTimeMoment, setStatus }
