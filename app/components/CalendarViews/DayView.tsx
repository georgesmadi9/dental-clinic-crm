"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getTimeSlots,
  getAppointmentsForTimeSlot,
  formatDayMonthDate,
  isToday,
} from "@/app/lib/calendarUtils";
import { AppointmentWithRelations } from "@/app/types/Appointment";
import moment from "moment";

interface DayViewProps {
  currentDate: Date;
  appointments: AppointmentWithRelations[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  appointments,
  onTimeSlotClick,
  onPreviousDay,
  onNextDay,
}) => {
  const timeSlots = getTimeSlots(8, 18); // 8 AM to 6 PM

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDayMonthDate(currentDate)}
          </h2>
          {isToday(currentDate) && (
            <span className="text-sm text-[#19287A] font-semibold">Today</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousDay}
            className="hover:bg-[#19287A] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextDay}
            className="hover:bg-[#19287A] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        {timeSlots.map((slot, slotIndex) => {
          const hour = 8 + slotIndex;
          const slotAppointments = getAppointmentsForTimeSlot(
            appointments,
            currentDate,
            hour
          );

          return (
            <div key={slot} className="flex gap-4">
              {/* Time Label */}
              <div className="w-24 text-sm text-gray-600 font-medium pt-2">
                {slot}
              </div>

              {/* Time Slot Content */}
              <div
                onClick={() => onTimeSlotClick(currentDate, hour)}
                className={`
                  flex-1 min-h-[80px] p-3 rounded-lg border-2 cursor-pointer
                  transition-all hover:bg-blue-50 hover:border-[#19287A]
                  ${
                    slotAppointments.length > 0
                      ? "bg-gradient-to-r from-[#19287A] to-[#0C8F8F] border-transparent"
                      : "border-gray-200"
                  }
                `}
              >
                {slotAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {slotAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/appointments/${apt.id}`;
                        }}
                      >
                        <div className="font-semibold text-gray-900">
                          {apt.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {apt.Patient?.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {moment(apt.startTime).format("h:mm A")} -{" "}
                          {moment(apt.endTime).format("h:mm A")}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              apt.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : apt.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Click to schedule
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
