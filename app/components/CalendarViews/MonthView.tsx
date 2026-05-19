"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getMonthGrid,
  formatMonthYear,
  isToday,
  getAppointmentsForDay,
} from "@/app/lib/calendarUtils";
import moment from "moment";

interface MonthViewProps {
  currentDate: Date;
  appointments: any[];
  onDateClick: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  appointments,
  onDateClick,
  onPreviousMonth,
  onNextMonth,
}) => {
  const monthGrid = getMonthGrid(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      case "No-show":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {formatMonthYear(currentDate)}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousMonth}
            className="hover:bg-[#19287A] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextMonth}
            className="hover:bg-[#19287A] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday Headers */}
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {monthGrid.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, dayIndex) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className="min-h-[100px] bg-gray-50 rounded-lg"
                  />
                );
              }

              const dayAppointments = getAppointmentsForDay(appointments, date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => onDateClick(date)}
                  className={`
                    min-h-[100px] p-2 rounded-lg border-2 cursor-pointer
                    transition-all duration-200 hover:shadow-md hover:border-[#19287A]
                    ${isTodayDate ? "border-[#19287A] bg-blue-50" : "border-gray-200 bg-white"}
                  `}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-sm font-semibold
                        ${isTodayDate ? "text-[#19287A]" : "text-gray-700"}
                      `}
                    >
                      {date.getDate()}
                    </span>
                    {dayAppointments.length === 0 && (
                      <Plus className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Appointments */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        className="text-xs p-1 rounded truncate bg-gradient-to-r from-[#19287A] to-[#0C8F8F] text-white hover:opacity-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/appointments/${apt.id}`;
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(
                              apt.status
                            )}`}
                          />
                          <span className="truncate">
                            {moment(apt.startTime).format("h:mm A")} {apt.title}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-center text-gray-500 font-medium">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-xs flex-wrap">
        <span className="font-semibold text-gray-600">Status:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Cancelled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>No-show</span>
        </div>
      </div>
    </div>
  );
};

export default MonthView;
