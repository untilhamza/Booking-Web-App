const combineDateTimeMoment = (dateMoment, timeMoment) => {
  return dateMoment
    .set({
      hour: timeMoment.get("hour"),
      minute: timeMoment.get("minute"),
      second: 0,
    })
    .clone()
}

export { combineDateTimeMoment }
