import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Eye, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { getInitials } from "@/app/lib/helpers";
import { PatientWithLastCase } from "@/app/types/Patient";
import moment from "moment";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

const PatientCard = ({
  data,
  loadingCaseDate,
}: {
  data: PatientWithLastCase;
  loadingCaseDate: boolean;
}) => {
  async function deletePatient() {
    await fetch(`/api/patients/${data.id}`, {
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
    <>
      <Card className="relative pb-0 rounded-b-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full group">
        <Button
          className="absolute top-0 right-0 opacity-0 rounded-br-none rounded-tl-none group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-700 hover:cursor-pointer"
          title="Delete Patient"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deletePatient();
          }}
        >
          <Trash />
        </Button>

        <CardHeader className="flex align-middle items-center gap-1 relative">
          <Avatar className="h-12 w-12 rounded-lg me-4">
            <AvatarImage src={data.avatar} alt={`${data.name}'s Avatar`} />
            <AvatarFallback className="rounded-lg bg-[#19287A] text-white">
              {getInitials(data.name)}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium mb-2">{data.name}</span>
            <span className="text-muted-foreground italic truncate text-xs">
              Patient ID: {data.id} <br />
            </span>
          </div>
        </CardHeader>

        <CardContent className="text-sm text-gray-600 my-0 flex-1">
          <span className="italic text-muted-foreground flex gap-3">
            Last Intervention Date:{" "}
            {loadingCaseDate ? (
              <Skeleton className="h-[20px] w-[120px] rounded-full bg-[#19287A60]" />
            ) : (
              <>
                {moment(data.last_intervention).format("MMMM Do YYYY, h:mm A")}
              </>
            )}
          </span>
        </CardContent>

        <Link href={`/patients/${data.id}`} className="block">
          <CardFooter className="bg-[#19287A] text-white py-2 rounded-b-lg flex items-center justify-center hover:bg-[#0C8F8F] transition-colors">
            <Eye className="me-2" size={24} />
            View Details
          </CardFooter>
        </Link>
      </Card>
      <Toaster richColors={true} />
    </>
  );
};

export default PatientCard;
