export const getTimeUntilEvent = (eventDate) => {
  // Current date and time
  const now = new Date();

  // Parse event date and time
  const event = new Date(eventDate);

  // Check if the parsed date is valid
  if (isNaN(event.getTime())) {
    return 'Invalid event date format';
  }

  // Check if the time difference is negative (event is in the past)
  if (event - now < 0) {
    return 'Event date is in the past';
  }

  // Calculate days, hours, minutes, and seconds
  const timeDifference = event - now;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Improved formatting function
  function formatTime(time, unit) {
    return time > 0 ? `${time}${unit}` : '';
  }

  const formattedDuration = `${formatTime(days, 'd')} : ${formatTime(hours, 'h')} : ${formatTime(minutes, 'm')} : ${formatTime(seconds, 's')}`;

  return formattedDuration;
};