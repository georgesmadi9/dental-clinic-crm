"use client";

import NavbarDashboards from "@/app/components/NavbarDashboards";
import PageTitleSetter from "@/app/components/PageTitleSetter";
import PatientCreationForm from "@/app/components/PatientCreationForm";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";

const NewPatient = () => {
  return (
    <>
      <PageTitleSetter title="Create New Patient" />

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
        title={`New Case`}
      />

      <div className="flex justify-center py-10">
        <Card className="w-2xl pt-0 shadow-lg">
          <CardHeader className="text-xl bg-[#19287A] text-white rounded-t-lg pt-1 font-bold">
            New Patient
          </CardHeader>
          <CardContent>
            <PatientCreationForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NewPatient;
