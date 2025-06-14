import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { CaseWithPatient } from "@/app/types/Case";

import React from "react";
import Link from "next/link";
import { Eye, Trash } from "lucide-react";
import { getInitials } from "@/app/lib/helpers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CaseCard = ({ data }: { data: CaseWithPatient }) => {
  async function deleteCase() {
    await fetch(`/api/cases/${data.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete patient");
        }
        // Optionally, trigger a refresh or callback here
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete patient.");
      });
  }

  return (
    <Card className="relative pb-0 rounded-b-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full group">
      <Button
        className="absolute top-0 right-0 opacity-0 rounded-br-none rounded-tl-none group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-700 hover:cursor-pointer"
        title="Delete Case"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          deleteCase();
        }}
      >
        <Trash />
      </Button>

      <CardHeader className="flex align-middle items-center gap-1">
        <Avatar className="h-12 w-12 rounded-lg me-4">
          <AvatarImage
            src={data.patient_avatar}
            alt={`${data.patient_avatar}'s Avatar`}
          />
          <AvatarFallback className="rounded-lg bg-[#19287A] text-white">
            {getInitials(data.patient_name)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium mb-2">{data.case_name}</span>
          <span className="text-muted-foreground italic truncate text-xs">
            Case ID: {data.id} <br />
          </span>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 my-0">
        <p className="mb-2">
          Patient: {data.patient_name}{" "}
          <span className="text-foreground-muted font-bold">
            ({data.patient_id})
          </span>
        </p>
        <p className="italic text-muted-foreground">
          Intervention Date:{" "}
          {new Date(data.intervention_date).toLocaleDateString()}
        </p>
      </CardContent>
      <Link href={`/cases/${data.id}`} className="mt-auto">
        <CardFooter className="bg-[#19287A] text-white py-2 rounded-b-lg flex items-center justify-center hover:bg-[#0C8F8F] transition-colors">
          <Eye className="me-2" size={24} />
          View Details
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CaseCard;
