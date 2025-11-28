// src/utils/timeFormatter.js

// Convert 24-hour format to 12-hour format with AM/PM
export const formatTimeToAMPM = (timeString) => {
  if (!timeString) return "";
  
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':');
  let hour = parseInt(hours, 10);
  const minute = minutes || '00';
  
// Determine AM/PM
  const ampm = hour >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;
  
  return `${hour}:${minute} ${ampm}`;
};

// Format consulting timings for display with AM/PM
// Format consulting timings for display with AM/PM
export const formatConsultingTimings = (timings) => {
  if (!timings || !timings.startTime || !timings.endTime) {
    return "Not specified";
  }
  
  // Check if times already contain AM/PM
  const hasAMPM = /AM|PM/i.test(timings.startTime) || /AM|PM/i.test(timings.endTime);
  
  if (hasAMPM) {
    // Times already in AM/PM format, return as is
    return `${timings.startTime} - ${timings.endTime}`;
  } else {
    // Convert from 24-hour to 12-hour format
    const startTime = formatTimeToAMPM(timings.startTime);
    const endTime = formatTimeToAMPM(timings.endTime);
    return `${startTime} - ${endTime}`;
  }
};

// Format consulting days for doctor card (shows "Weekdays" when applicable)
export const formatConsultingDaysForCard = (days) => {
  if (!days || days.length === 0) return "Not specified";
  if (days.length === 7) return "All days";
  if (days.length === 5 && 
      days.includes("Monday") && 
      days.includes("Tuesday") &&
      days.includes("Wednesday") &&
      days.includes("Thursday") &&
      days.includes("Friday") && 
      !days.includes("Saturday") && 
      !days.includes("Sunday")) {
    return "Weekdays";
  }
  return days.join(", ");
};

// Format consulting days for dashboard (shows all days individually)
export const formatConsultingDaysForDashboard = (days) => {
  if (!days || days.length === 0) return "Not specified";
  if (days.length === 7) return "All days";
  return days.join(", ");
};