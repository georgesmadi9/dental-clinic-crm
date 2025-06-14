"use client";

import PreviousInterventionsCard from "@/app/components/CaseDetailsCards/PreviousInterventionsCard";
import LoadingComponent from "@/app/components/LoadingComponent";
import NavbarDashboards from "@/app/components/NavbarDashboards";
import PageTitleSetter from "@/app/components/PageTitleSetter";
import ReportButton from "@/app/components/ReportButton";
import { getInitials } from "@/app/lib/helpers";
import { CaseLight, CaseReport } from "@/app/types/Case";
import { PatientWithLastCase } from "@/app/types/Patient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PatientsPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingPatientReports, setLoadingPatientReports] = useState(true);
  const [loadingPatientCases, setLoadingPatientCases] = useState(true);

  const [patientData, setPatientData] = useState<PatientWithLastCase | null>();
  const [patientReports, setPatientReports] = useState<CaseReport[] | null>();
  const [patientCases, setPatientCases] = useState<CaseLight[] | null>();

  const params = useParams();
  const patientId = params?.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingPatientCases(true);
      setLoadingPatientReports(true);

      try {
        const req1 = await fetch(`/api/patients/${patientId}`);
        if (!req1) throw new Error("Failed to fetch patient data");
        const res1 = await req1.json();
        console.log(res1);
        setPatientData(res1);
        setLoading(false);

        const req2 = await fetch(`/api/patient-cases/reports/${patientId}`);
        if (!req2) throw new Error("Failed to fetch case reports");
        const res2 = await req2.json();
        setPatientReports(res2);
        setLoadingPatientReports(false);

        const req3 = await fetch(`/api/patient-cases/${patientId}`);
        if (!req3) throw new Error("Failed to fetch cases data");
        const res3 = await req3.json();
        setPatientCases(res3);
        setLoadingPatientCases(false);
      } catch {
        setLoading(false);
        setLoadingPatientReports(false);
        setLoadingPatientCases(false);
      }
    };

    fetchData();
  }, [patientId]);

  return (
    <>
      <PageTitleSetter title={`Patient ${patientId} Details`} />

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
        title={`Patient Details: ${patientId }`}
      />

      {/* Info Card */}
      <Card className="mx-4 my-4 p-4 shadow-lg">
        <CardContent className="flex align-middle">
          {loading ? (
            <Skeleton className="bg-[#19287A60] me-8">
              <Avatar className="h-40 w-40 rounded-lg" />
            </Skeleton>
          ) : (
            <Avatar className="h-40 w-40 rounded-lg me-8 my-4">
              <AvatarImage
                src={patientData?.avatar}
                alt={`${patientData?.name}'s Avatar`}
              />
              <AvatarFallback className="rounded-lg bg-[#19287A] text-white">
                {getInitials(patientData?.name || "")}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            {loading ? (
              <Skeleton className="bg-[#19287A60] w-[400px] h-[20px] mb-2" />
            ) : (
              <h1 className="text-2xl font-bold mb-2">
                {patientData?.name} ({patientData?.id})
              </h1>
            )}
            <ul className="space-y-2 text-base">
              {[
                { label: "Gender", value: patientData?.gender },
                { label: "Date of Birth", value: patientData?.date_of_birth },
                { label: "Phone Number", value: patientData?.phone_number },
                { label: "Email", value: patientData?.email },
                {
                  label: "Last Intervention",
                  value: patientData?.last_intervention
                    ? moment(patientData.last_intervention).format(
                        "MMMM Do YYYY, h:mm A"
                      )
                    : "-",
                },
              ].map(({ label, value }) => (
                <li className="flex items-center gap-2" key={label}>
                  <span className="font-semibold">{label}:</span>{" "}
                  {loading ? (
                    <Skeleton className="bg-[#19287A60] w-[200px] h-[16px]" />
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Reports Card */}
      <Card className="mx-4 my-4 pt-0 shadow-lg">
        <CardHeader className="text-xl bg-[#19287A] text-white rounded-t-lg pt-1">
          Related Reports
        </CardHeader>

        <CardContent className="">
          {loadingPatientReports ? (
            <LoadingComponent
              what="reports"
              loading={loadingPatientReports}
              speed={50}
            />
          ) : patientReports?.length != 0 ? (
            <>
              {patientReports?.map((report) => (
                <ReportButton key={report.id} case_id={report.id} report_url={report.report_link} />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p>No reports found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cases Card */}
      <PreviousInterventionsCard
        interventions={patientCases ?? []}
        loading={loadingPatientCases}
      />
    </>
  );
};

export default PatientsPage;
