"use client";

import PageTitleSetter from "@/app/components/PageTitleSetter";

import DoctorNoteCard from "@/app/components/CaseDetailsCards/DoctorNoteCard";
import InterventionReportCard from "@/app/components/CaseDetailsCards/InterventionReportCard";
import BasicCaseInfoCard from "@/app/components/CaseDetailsCards/BasicCaseInfoCard";
import PatientInfoCard from "@/app/components/CaseDetailsCards/PatientInfoCard";

import React, { useState, useEffect } from "react";
import PreviousInterventionsCard from "@/app/components/CaseDetailsCards/PreviousInterventionsCard";
import LoadingComponent from "@/app/components/LoadingComponent";
import { useParams } from "next/navigation";
import { Case, CaseLight } from "@/app/types/Case";
import { Patient } from "@/app/types/Patient";
import NavbarDashboards from "@/app/components/NavbarDashboards";

const CaseDetailsPage = () => {
  const [loadingCaseInfo, setLoadingCaseInfo] = useState(true);
  const [loadingPatientInfo, setLoadingPatientInfo] = useState(true);
  const [loadingPreviousInterventions, setLoadingPreviousInterventions] =
    useState(true);

  const [caseData, setCaseData] = useState<Case | null>();
  const [patientData, setPatientData] = useState<Patient | null>();
  const [previousInterventions, setPreviousInterventions] = useState<
    CaseLight[] | null
  >();

  const params = useParams();
  const caseId = params?.id;

  useEffect(() => {
    const fetchCase = async () => {
      setLoadingCaseInfo(true);
      setLoadingPatientInfo(true);
      setLoadingPreviousInterventions(true);
      try {
        const res = await fetch(`/api/cases/${caseId}`);

        if (!res.ok) throw new Error("Failed to fetch case data");

        const data = await res.json();

        setCaseData(data);
        setLoadingCaseInfo(false);

        const res2 = await fetch(
          `/api/patients/${data.patient_id}?last-case=true`
        );

        if (!res.ok) throw new Error("Failed to fetch patient data");

        const patient = await res2.json();

        setPatientData(patient);
        setLoadingPatientInfo(false);

        const res3 = await fetch(`/api/patient-cases/${data.patient_id}`);

        if (!res.ok)
          throw new Error("Failed to fetch previous interventions data");

        const prevCases = await res3.json();

        setPreviousInterventions(prevCases);
        setLoadingPreviousInterventions(false);
      } catch {
        setCaseData(null);
        setPatientData(null);
        setPreviousInterventions(null);
      }
    };

    fetchCase();
  }, [caseId]);

  return (
    <>
      <PageTitleSetter title={`Case ${caseId} Details`} />

      <NavbarDashboards
        search={""}
        setSearch={function (): void {
          throw new Error("Function not implemented.");
        }}
        filter={""}
        setFilter={function (): void {
          throw new Error("Function not implemented.");
        }}
        sortingDirection={"desc"}
        setSortingDirection={function (): void {
          throw new Error("Function not implemented.");
        }}
        title={`Case Details: ${caseId}`}
      />

      {loadingCaseInfo ? (
        <LoadingComponent
          what={`patient`}
          loading={loadingCaseInfo}
          speed={5}
        />
      ) : (
        <>
          <BasicCaseInfoCard
            props={{
              caseId: String(caseId),
              caseTitle: caseData?.case_name ?? "",
              caseDate: caseData?.intervention_date ?? new Date(),
            }}
          />

          <div className="grid grid-cols-[33%_24%_40%] gap-4 mx-4 mb-2">
            <PatientInfoCard
              isLoading={loadingPatientInfo}
              patientInfo={patientData!}
            />

            <InterventionReportCard report_url={caseData?.case_report ?? ""} />

            <DoctorNoteCard
              caseId={caseData?.id ?? ""}
              noteText={caseData?.doctor_note ?? ""}
            />
          </div>

          <PreviousInterventionsCard
            interventions={previousInterventions ?? []}
            loading={loadingPreviousInterventions}
          />
        </>
      )}
    </>
  );
};

export default CaseDetailsPage;
