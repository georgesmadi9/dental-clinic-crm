"use client";

import React, { useEffect, useState } from "react";
import PageTitleSetter from "@/app/components/PageTitleSetter";
import NavbarDashboards from "@/app/components/NavbarDashboards";
import { AppointmentModal } from "@/app/components/AppointmentModal";
import LoadingComponent from "@/app/components/LoadingComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import MonthView from "@/app/components/CalendarViews/MonthView";
import WeekView from "@/app/components/CalendarViews/WeekView";
import DayView from "@/app/components/CalendarViews/DayView";
import ListView from "@/app/components/CalendarViews/ListView";
import { AppointmentWithRelations } from "@/app/types/Appointment";

const CalendarPage = () => {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<
    "month" | "week" | "day" | "list"
  >("month");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleModalSuccess = () => {
    fetchAppointments();
    setSelectedDateTime(null);
  };

  const handleDateClick = (date: Date) => {
    const start = new Date(date);
    start.setHours(9, 0, 0, 0); // Default to 9 AM
    const end = new Date(date);
    end.setHours(10, 0, 0, 0); // Default to 10 AM
    setSelectedDateTime({ start, end });
    setModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(date);
    end.setHours(hour + 1, 0, 0, 0); // 1 hour appointment
    setSelectedDateTime({ start, end });
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedDateTime(null);
    setModalOpen(true);
  };

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handlePreviousWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const handlePreviousDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <>
      <PageTitleSetter title="Calendar" />

      <NavbarDashboards
        search={""}
        setSearch={() => {}}
        filter={""}
        setFilter={() => {}}
        sortingDirection={"asc"}
        setSortingDirection={() => {}}
        title="Calendar"
      />

      <div className="p-4">
        {loading ? (
          <LoadingComponent what="calendar" loading={loading} />
        ) : (
          <>
            {/* Header Actions */}
            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-[#19287A]" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Appointment Calendar
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleToday}
                  className="hover:bg-[#19287A] hover:text-white"
                >
                  Today
                </Button>
                <Button
                  onClick={handleOpenModal}
                  className="bg-[#19287A] hover:bg-[#0C8F8F] flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Appointment
                </Button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-semibold">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {
                    appointments.filter((apt) => apt.status === "Scheduled")
                      .length
                  }
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-semibold">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {
                    appointments.filter((apt) => apt.status === "Completed")
                      .length
                  }
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">Cancelled</p>
                <p className="text-2xl font-bold text-red-900">
                  {
                    appointments.filter((apt) => apt.status === "Cancelled")
                      .length
                  }
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
            </div>

            {/* View Tabs */}
            <Tabs
              value={activeView}
              onValueChange={(value: any) => setActiveView(value)}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>

              <TabsContent value="month" className="mt-0">
                <MonthView
                  currentDate={currentDate}
                  appointments={appointments}
                  onDateClick={handleDateClick}
                  onPreviousMonth={handlePreviousMonth}
                  onNextMonth={handleNextMonth}
                />
              </TabsContent>

              <TabsContent value="week" className="mt-0">
                <WeekView
                  currentDate={currentDate}
                  appointments={appointments}
                  onTimeSlotClick={handleTimeSlotClick}
                  onPreviousWeek={handlePreviousWeek}
                  onNextWeek={handleNextWeek}
                />
              </TabsContent>

              <TabsContent value="day" className="mt-0">
                <DayView
                  currentDate={currentDate}
                  appointments={appointments}
                  onTimeSlotClick={handleTimeSlotClick}
                  onPreviousDay={handlePreviousDay}
                  onNextDay={handleNextDay}
                />
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <ListView appointments={appointments} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedDateTime(null);
        }}
        defaultStartTime={selectedDateTime?.start}
        defaultEndTime={selectedDateTime?.end}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default CalendarPage;
