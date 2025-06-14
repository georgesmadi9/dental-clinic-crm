"use client";

import CaseCreationForm from "@/app/components/CaseCreationForm";
import NavbarDashboards from "@/app/components/NavbarDashboards";
import PageTitleSetter from "@/app/components/PageTitleSetter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

const NewCase = () => {
  return (
    <>
      <PageTitleSetter title="Create New Case" />

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
        title={"New Case"}
      />

      <div className="flex justify-center py-10">
        <Card className="w-2xl pt-0 shadow-lg">
          <CardHeader className="text-xl bg-[#19287A] text-white rounded-t-lg pt-1 font-bold">
            New Case
          </CardHeader>
          <CardContent>
            <CaseCreationForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NewCase;
