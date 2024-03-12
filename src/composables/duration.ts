export const getTimeUntilEvent = (eventDate) => {
  // Current date and time
  const now = new Date()

  // Parse event date and time
  const event = new Date(eventDate)

  // Check if the parsed date is valid
  if (isNaN(event.getTime())) {
    // throw new Error('Invalid date format')
    // console.error('Invalid date format')
  }

  // Calculate the time difference in milliseconds
  const timeDifference = event - now

  // Check if the time difference is negative (event is in the past)
  if (timeDifference < 0) {
    // throw new Error('Event date is in the past')
    // console.error('Event date is in the past')
  }

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

  const duration = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`

  return duration
}
