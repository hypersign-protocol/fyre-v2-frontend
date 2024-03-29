export const isEventHappening = (startDate, endDate) => {
  const now = new Date().getTime()
  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()

  // Check if current time is between start and end time (inclusive)
  const eventStarted = now >= startTime

  // Check if current time is within the duration of the event
  const eventInProgress = now >= startTime && now <= endTime

  return {
    eventStarted: eventStarted,
    eventInProgress: eventInProgress
  }
}
