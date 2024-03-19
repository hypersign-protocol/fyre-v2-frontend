export const isEventHappening = (startDate, endDate) => {
  // Get the current date and time in milliseconds since epoch (Jan 1, 1970)
  const now = new Date().getTime()

  // Convert start and end dates to milliseconds since epoch
  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()

  // Check if current time is between start and end time (inclusive)
  return now >= startTime && now <= endTime
}
