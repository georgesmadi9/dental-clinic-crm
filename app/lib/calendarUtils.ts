// Calendar utility functions for date manipulation and grid generation

/**
 * Get the days in a month as a 2D array (weeks x days)
 * Each week starts on Sunday
 */
export function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();
  
  const grid: (Date | null)[][] = [];
  let week: (Date | null)[] = [];
  
  // Fill in the days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    week.push(null);
  }
  
  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(new Date(year, month, day));
    
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  
  // Fill in the remaining days of the last week
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    grid.push(week);
  }
  
  return grid;
}

/**
 * Get the week dates for a given date (Sunday to Saturday)
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day; // Adjust to Sunday
  
  const sunday = new Date(date);
  sunday.setDate(diff);
  sunday.setHours(0, 0, 0, 0);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(sunday);
    currentDate.setDate(sunday.getDate() + i);
    weekDates.push(currentDate);
  }
  
  return weekDates;
}

/**
 * Get hourly time slots for a day (e.g., 8 AM to 6 PM)
 */
export function getTimeSlots(startHour: number = 8, endHour: number = 18): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    slots.push(`${displayHour}:00 ${period}`);
  }
  return slots;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Format a date as "Month Year" (e.g., "January 2026")
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Format a date as "Day, Month Date" (e.g., "Monday, Jan 5")
 */
export function formatDayMonthDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Get appointments for a specific day
 */
export function getAppointmentsForDay<T extends { startTime: Date | string }>(
  appointments: T[],
  date: Date
): T[] {
  return appointments.filter((apt) => {
    const aptDate = new Date(apt.startTime);
    return isSameDay(aptDate, date);
  });
}

/**
 * Get appointments for a specific time slot
 */
export function getAppointmentsForTimeSlot<T extends { startTime: Date | string; endTime: Date | string }>(
  appointments: T[],
  date: Date,
  hour: number
): T[] {
  return appointments.filter((apt) => {
    const aptStart = new Date(apt.startTime);
    const aptEnd = new Date(apt.endTime);
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    
    return (
      isSameDay(aptStart, date) &&
      ((aptStart >= slotStart && aptStart < slotEnd) ||
       (aptEnd > slotStart && aptEnd <= slotEnd) ||
       (aptStart <= slotStart && aptEnd >= slotEnd))
    );
  });
}

/**
 * Calculate position percentage for appointment in day view
 * Returns { top: number, height: number } in percentage
 */
export function calculateAppointmentPosition(
  startTime: Date,
  endTime: Date,
  dayStartHour: number = 8,
  dayEndHour: number = 18
): { top: number; height: number } {
  const totalMinutes = (dayEndHour - dayStartHour) * 60;
  
  const startHour = startTime.getHours();
  const startMinute = startTime.getMinutes();
  const startTotalMinutes = (startHour - dayStartHour) * 60 + startMinute;
  
  const endHour = endTime.getHours();
  const endMinute = endTime.getMinutes();
  const endTotalMinutes = (endHour - dayStartHour) * 60 + endMinute;
  
  const top = (startTotalMinutes / totalMinutes) * 100;
  const height = ((endTotalMinutes - startTotalMinutes) / totalMinutes) * 100;
  
  return {
    top: Math.max(0, Math.min(100, top)),
    height: Math.max(0, Math.min(100 - top, height)),
  };
}

/**
 * Get upcoming appointments (future from now)
 */
export function getUpcomingAppointments<T extends { startTime: Date | string }>(appointments: T[]): T[] {
  const now = new Date();
  return appointments
    .filter((apt) => new Date(apt.startTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

/**
 * Get past appointments
 */
export function getPastAppointments<T extends { startTime: Date | string; endTime: Date | string }>(appointments: T[]): T[] {
  const now = new Date();
  return appointments
    .filter((apt) => new Date(apt.endTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}
