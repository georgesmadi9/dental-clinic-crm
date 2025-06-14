"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import PageTitleSetter from "@/app/components/PageTitleSetter";
import CaseCard from "@/app/components/DashboardCards/CaseCard";
import AddCard from "@/app/components/DashboardCards/AddCard";
import LoadingComponent from "@/app/components/LoadingComponent";
import { CaseWithPatient } from "@/app/types/Case";
import { filterData } from "@/app/lib/helpers";
import NavbarDashboards from "@/app/components/NavbarDashboards";

const CasesPage = () => {
  const [casesData, setCasesData] = useState<CaseWithPatient[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"date" | "name" | "case_name">(
    "case_name"
  );
  const [sortingDirection, setSortingDirection] = useState<"asc" | "desc">(
    "desc"
  );

  useEffect(() => {
    setLoading(true);
    fetch("/api/cases")
      .then((response) => response.json())
      .then((data) => {
        setCasesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cases:", error);
        setLoading(false);
      });
  }, []);

  // not working whatever ig
  const filteredCases = useMemo(
    () => filterData(casesData, search, filter, sortingDirection),
    [casesData, search, filter, sortingDirection]
  );

  return (
    <>
      <PageTitleSetter title="Cases" />

      <NavbarDashboards
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        sortingDirection={sortingDirection}
        setSortingDirection={setSortingDirection}
        title="Cases"
      />

      {loading ? (
        <LoadingComponent what="cases" loading={loading} speed={60} />
      ) : filteredCases.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No cases found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AddCard props={{ what: "case" }} />
          </motion.div>
          {filteredCases.map((caseData, idx) => (
            <motion.div
              key={caseData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <CaseCard data={caseData} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default CasesPage;
