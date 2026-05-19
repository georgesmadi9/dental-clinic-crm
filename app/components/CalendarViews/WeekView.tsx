"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getWeekDates,
  getTimeSlots,
  getAppointmentsForTimeSlot,
  formatDayMonthDate,
  isToday,
} from "@/app/lib/calendarUtils";
import moment from "moment";

interface WeekViewProps {
  currentDate: Date;
  appointments: any[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  appointments,
  onTimeSlotClick,
  onPreviousWeek,
  onNextWeek,
}) => {
  const weekDates = getWeekDates(currentDate);
  const timeSlots = getTimeSlots(8, 18); // 8 AM to 6 PM

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {moment(weekDates[0]).format("MMM D")} -{" "}
          {moment(weekDates[6]).format("MMM D, YYYY")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousWeek}
            className="hover:bg-[#19287A] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextWeek}
            className="hover:bg-[#19287A] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-sm font-semibold text-gray-600"></div>
            {weekDates.map((date) => (
              <div
                key={date.toISOString()}
                className={`text-center p-2 rounded ${
                  isToday(date) ? "bg-[#19287A] text-white" : "text-gray-700"
                }`}
              >
                <div className="text-xs font-semibold">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-lg">{date.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((slot, slotIndex) => (
            <div key={slot} className="grid grid-cols-8 gap-2 mb-1">
              <div className="text-xs text-gray-600 pr-2 text-right py-2">
                {slot}
              </div>
              {weekDates.map((date) => {
                const hour = 8 + slotIndex;
                const slotAppointments = getAppointmentsForTimeSlot(
                  appointments,
                  date,
                  hour
                );

                return (
                  <div
                    key={`${date.toISOString()}-${hour}`}
                    onClick={() => onTimeSlotClick(date, hour)}
                    className={`
                      min-h-[60px] p-1 rounded border cursor-pointer
                      transition-all hover:bg-blue-50 hover:border-[#19287A]
                      ${slotAppointments.length > 0 ? "bg-gradient-to-r from-[#19287A] to-[#0C8F8F]" : "border-gray-200"}
                    `}
                  >
                    {slotAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="text-xs p-1 bg-white rounded truncate shadow-sm mb-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/appointments/${apt.id}`;
                        }}
                      >
                        <div className="font-semibold truncate">{apt.title}</div>
                        <div className="text-gray-600 truncate">
                          {apt.Patient?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
