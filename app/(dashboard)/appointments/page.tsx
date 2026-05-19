"use client";

import PageTitleSetter from "@/app/components/PageTitleSetter";
import React, { useEffect, useState } from "react";
import AppointmentCard from "@/app/components/DashboardCards/AppointmentCard";
import { motion } from "framer-motion";
import LoadingComponent from "@/app/components/LoadingComponent";
import NavbarDashboards from "@/app/components/NavbarDashboards";
import { AppointmentModal } from "@/app/components/AppointmentModal";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

interface Appointment {
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
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("title");
  const [sortingDirection, setSortingDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

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
    fetchAppointments(); // Refresh appointments after create/update
  };

  return (
    <>
      <PageTitleSetter title="Appointments" />

      <NavbarDashboards
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        sortingDirection={sortingDirection}
        setSortingDirection={setSortingDirection}
        title="Appointment"
      />

      {loading ? (
        <LoadingComponent what="appointments" loading={loading} />
      ) : (
        <>
          <div className="p-4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                All Appointments
              </h2>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-[#19287A] hover:bg-[#0C8F8F] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </div>

            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {appointments.map((appointment, idx) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                  >
                    <AppointmentCard
                      data={appointment}
                      onDelete={fetchAppointments}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-20 space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-gray-300" />
                <p className="text-lg">No appointments found.</p>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-[#19287A] hover:bg-[#0C8F8F]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Appointment
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <AppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default AppointmentsPage;
