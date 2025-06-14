"use client";

import PageTitleSetter from "@/app/components/PageTitleSetter";
import React, { useEffect, useState } from "react";
import PatientCard from "@/app/components/DashboardCards/PatientCard";
import { motion } from "framer-motion";
import LoadingComponent from "@/app/components/LoadingComponent";
import AddCard from "@/app/components/DashboardCards/AddCard";
import NavbarDashboards from "@/app/components/NavbarDashboards";
import { Patient } from "@/app/types/Patient";

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLastCases, setLoadingLastCases] = useState(true);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("name");
  const [sortingDirection, setSortingDirection] = React.useState<
    "asc" | "desc"
  >("desc");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setLoadingLastCases(true);

      try {
        const res = await fetch("/api/patients", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      }
      setLoadingLastCases(false);
    };
    fetchPatients();
  }, []);

  return (
    <>
      <PageTitleSetter title="Patients" />

      <NavbarDashboards
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        sortingDirection={sortingDirection}
        setSortingDirection={setSortingDirection}
        title="Patient"
      />

      {loading ? (
        <LoadingComponent what="patients" loading={loading} />
      ) : patients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AddCard props={{ what: "patient" }} />
          </motion.div>
          {patients.map((patient, idx) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <PatientCard
                key={patient.id}
                data={{ ...patient, last_intervention: (patient as Patient).last_intervention ?? null }}
                loadingCaseDate={loadingLastCases}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p>No patients found.</p>
        </div>
      )}
    </>
  );
};

export default PatientsPage;
