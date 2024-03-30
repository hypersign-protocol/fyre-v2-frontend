import { images as actionImages } from '@/data/event/Images.ts'

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

export const getImage = (type) => {
  const segments = type.split('_')
  // Get the last segment
  const lastSegment = segments[segments.length - 1]
  const searchStringLower = lastSegment.toLowerCase()

  const matchingKey = Object.keys(actionImages).find((key) =>
    searchStringLower.includes(key.toLowerCase())
  )

  if (matchingKey) {
    return actionImages[matchingKey]
  } else {
    return null
  }
}
