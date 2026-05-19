"use client";

import React, { useState } from "react";
import { Calendar, Clock, User, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getUpcomingAppointments, getPastAppointments } from "@/app/lib/calendarUtils";
import { AppointmentWithRelations } from "@/app/types/Appointment";
import moment from "moment";
import Link from "next/link";

interface ListViewProps {
  appointments: AppointmentWithRelations[];
}

const ListView: React.FC<ListViewProps> = ({ appointments }) => {
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  const upcomingAppointments = getUpcomingAppointments(appointments);
  const pastAppointments = getPastAppointments(appointments);

  const filteredAppointments =
    filter === "upcoming"
      ? upcomingAppointments
      : filter === "past"
      ? pastAppointments
      : appointments.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "No-show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Appointments List
        </h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("upcoming")}
            className={
              filter === "upcoming"
                ? "bg-[#19287A] hover:bg-[#0C8F8F]"
                : ""
            }
          >
            Upcoming ({upcomingAppointments.length})
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("past")}
            className={
              filter === "past"
                ? "bg-[#19287A] hover:bg-[#0C8F8F]"
                : ""
            }
          >
            Past ({pastAppointments.length})
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "bg-[#19287A] hover:bg-[#0C8F8F]"
                : ""
            }
          >
            All ({appointments.length})
          </Button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <Card
              key={apt.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/appointments/${apt.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title and Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {apt.title}
                      </h3>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>

                    {/* Patient Info */}
                    {apt.Patient && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4 text-[#19287A]" />
                        <span>{apt.Patient.name}</span>
                      </div>
                    )}

                    {/* Date and Time */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#0C8F8F]" />
                        <span>
                          {moment(apt.startTime).format("MMM Do, YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#0C8F8F]" />
                        <span>
                          {moment(apt.startTime).format("h:mm A")} -{" "}
                          {moment(apt.endTime).format("h:mm A")}
                        </span>
                      </div>
                    </div>

                    {/* Case Info */}
                    {apt.Case && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">
                          Related Case: {apt.Case.title}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {apt.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {apt.description}
                      </p>
                    )}
                  </div>

                  {/* View Button */}
                  <Link href={`/appointments/${apt.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-[#19287A] hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">
              No {filter === "upcoming" ? "upcoming" : filter === "past" ? "past" : ""}{" "}
              appointments found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
