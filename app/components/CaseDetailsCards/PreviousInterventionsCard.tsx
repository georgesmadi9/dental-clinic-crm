import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { InterventionsTable } from "./InterventionsTable";
import { CaseLight } from "@/app/types/Case";
import LoadingComponent from "../LoadingComponent";

const PreviousInterventionsCard = ({
  interventions,
  loading,
}: {
  interventions: CaseLight[];
  loading: boolean;
}) => {
  return (
    <Card className="mx-4 my-4 py-0 shadow-lg">
      <CardHeader className="bg-[#19287A] text-white font-semibold rounded-t-lg text-center pt-1 text-2xl">
        Previous Interventions
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingComponent what="previous interventions" loading={loading} />
        ) : (
          <InterventionsTable casesData={interventions} />
        )}
      </CardContent>
    </Card>
  );
};

export default PreviousInterventionsCard;
