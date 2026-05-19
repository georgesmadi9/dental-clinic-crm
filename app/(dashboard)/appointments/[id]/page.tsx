"use client";

import LoadingComponent from "@/app/components/LoadingComponent";
import NavbarDashboards from "@/app/components/NavbarDashboards";
import PageTitleSetter from "@/app/components/PageTitleSetter";
import { AppointmentModal } from "@/app/components/AppointmentModal";
import { getInitials } from "@/app/lib/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Edit,
  Trash,
  ArrowLeft,
} from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface AppointmentDetail {
  id: string;
  title: string;
  description?: string;
  startTime: Date | string;
  endTime: Date | string;
  status: string;
  Patient?: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
  Case?: {
    id: string;
    title: string;
    intervention_date: Date | string;
  };
}

const AppointmentDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id as string;

  useEffect(() => {
    fetchAppointmentData();
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (!response.ok) throw new Error("Failed to fetch appointment");
      const data = await response.json();
      setAppointmentData(data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Failed to load appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete appointment");

      toast.success("Appointment deleted successfully");
      router.push("/appointments");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
      setDeleting(false);
    }
  };

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

  if (loading) {
    return <LoadingComponent what="appointment details" loading={loading} />;
  }

  if (!appointmentData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Appointment not found</p>
        <Link href="/appointments">
          <Button className="mt-4 bg-[#19287A] hover:bg-[#0C8F8F]">
            Back to Appointments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageTitleSetter title={`Appointment ${appointmentId}`} />

      <NavbarDashboards
        search={""}
        setSearch={() => {}}
        filter={""}
        setFilter={() => {}}
        sortingDirection={"desc"}
        setSortingDirection={() => {}}
        title={`Appointment Details: ${appointmentId}`}
      />

      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Link href="/appointments">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>
        </Link>

        {/* Main Info Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{appointmentData.title}</CardTitle>
              <Badge className={getStatusColor(appointmentData.status)}>
                {appointmentData.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-[#19287A] hover:bg-[#0C8F8F]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            {appointmentData.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </h3>
                <p className="text-gray-600">{appointmentData.description}</p>
              </div>
            )}

            {/* Time Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#19287A] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Start Time
                  </p>
                  <p className="text-gray-600">
                    {moment(appointmentData.startTime).format(
                      "MMMM Do, YYYY [at] h:mm A"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#0C8F8F] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    End Time
                  </p>
                  <p className="text-gray-600">
                    {moment(appointmentData.endTime).format(
                      "MMMM Do, YYYY [at] h:mm A"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="text-sm text-gray-500">
                Duration:{" "}
                {moment
                  .duration(
                    moment(appointmentData.endTime).diff(
                      moment(appointmentData.startTime)
                    )
                  )
                  .humanize()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Patient Card */}
        {appointmentData.Patient && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarImage
                    src={appointmentData.Patient.avatar}
                    alt={`${appointmentData.Patient.name}'s Avatar`}
                  />
                  <AvatarFallback className="rounded-lg bg-[#19287A] text-white">
                    {getInitials(appointmentData.Patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link href={`/patients/${appointmentData.Patient.id}`}>
                    <h3 className="font-semibold text-lg hover:text-[#19287A] transition-colors">
                      {appointmentData.Patient.name}
                    </h3>
                  </Link>
                  {appointmentData.Patient.email && (
                    <p className="text-sm text-gray-600">
                      {appointmentData.Patient.email}
                    </p>
                  )}
                  {appointmentData.Patient.phone && (
                    <p className="text-sm text-gray-600">
                      {appointmentData.Patient.phone}
                    </p>
                  )}
                </div>
                <Link href={`/patients/${appointmentData.Patient.id}`}>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    View Patient
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Case Card */}
        {appointmentData.Case && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Related Case</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/cases/${appointmentData.Case.id}`}>
                    <h3 className="font-semibold hover:text-[#19287A] transition-colors">
                      {appointmentData.Case.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">
                    Intervention Date:{" "}
                    {moment(appointmentData.Case.intervention_date).format(
                      "MMMM Do, YYYY"
                    )}
                  </p>
                </div>
                <Link href={`/cases/${appointmentData.Case.id}`}>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Case
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment ID */}
        <p className="text-xs text-gray-500 text-center">
          Appointment ID: {appointmentData.id}
        </p>
      </div>

      {/* Edit Modal */}
      <AppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        appointmentId={appointmentId}
        onSuccess={() => {
          fetchAppointmentData();
        }}
      />
    </>
  );
};

export default AppointmentDetailPage;
