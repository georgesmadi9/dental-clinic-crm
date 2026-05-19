"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Eye, Trash, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/app/lib/helpers";
import moment from "moment";

interface AppointmentCardProps {
  data: {
    id: string;
    title: string;
    startTime: Date | string;
    endTime: Date | string;
    status: string;
    Patient?: {
      id: string;
      name: string;
      avatar?: string;
    };
    Case?: {
      id: string;
      title: string;
    };
  };
  onDelete?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ data, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "No-show":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  async function deleteAppointment() {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${data.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      toast.success("Appointment deleted successfully");
      
      if (onDelete) {
        onDelete();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete appointment");
    }
  }

  return (
    <>
      <Card className="relative pb-0 rounded-b-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full group">
        <Button
          className="absolute top-0 right-0 opacity-0 rounded-br-none rounded-tl-none group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-700 hover:cursor-pointer z-10"
          title="Delete Appointment"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteAppointment();
          }}
        >
          <Trash />
        </Button>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {data.Patient && (
                <>
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage
                      src={data.Patient.avatar}
                      alt={`${data.Patient.name}'s Avatar`}
                    />
                    <AvatarFallback className="rounded-lg bg-[#19287A] text-white">
                      {getInitials(data.Patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {data.Patient.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      <User className="inline h-3 w-3 mr-1" />
                      Patient
                    </p>
                  </div>
                </>
              )}
            </div>
            <Badge className={getStatusColor(data.status)}>
              {data.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="text-sm text-gray-600 flex-1 space-y-2">
          <div>
            <p className="font-semibold text-gray-900 mb-1">{data.title}</p>
            {data.Case && (
              <p className="text-xs text-gray-500 mb-2">
                Related Case: {data.Case.title}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs flex items-center gap-2">
              <Calendar className="h-3 w-3 text-[#19287A]" />
              <span className="font-medium">Start:</span>
              {moment(data.startTime).format("MMM Do, YYYY")} at{" "}
              {moment(data.startTime).format("h:mm A")}
            </p>
            <p className="text-xs flex items-center gap-2">
              <Clock className="h-3 w-3 text-[#0C8F8F]" />
              <span className="font-medium">End:</span>
              {moment(data.endTime).format("MMM Do, YYYY")} at{" "}
              {moment(data.endTime).format("h:mm A")}
            </p>
          </div>

          <p className="text-xs text-muted-foreground italic pt-1">
            Appointment ID: {data.id}
          </p>
        </CardContent>

        <Link href={`/appointments/${data.id}`} className="block">
          <CardFooter className="bg-[#19287A] text-white py-2 rounded-b-lg flex items-center justify-center hover:bg-[#0C8F8F] transition-colors">
            <Eye className="me-2" size={20} />
            View Details
          </CardFooter>
        </Link>
      </Card>
      <Toaster richColors={true} />
    </>
  );
};

export default AppointmentCard;
