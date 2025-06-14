"use client";

import { getInitials } from "@/app/lib/helpers";
import { Patient } from "@/app/types/Patient";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";
import moment from "moment";

const PatientInfoCard = ({
  patientInfo = {
    id: "",
    name: "",
    avatar: "",
    gender: "Male",
    date_of_birth: "",
    phone_number: "",
    email: "",
  } as Patient,
  isLoading,
}: {
  patientInfo?: Patient;
  isLoading: boolean;
}) => {
  return (
    <Card className="shadow-lg py-0 flex flex-col h-full">
      <CardHeader className="bg-[#19287A] text-white font-semibold rounded-t-lg text-center pt-1 text-2xl">
        Patient Info
      </CardHeader>
      <CardContent className="py-0 flex-1">
        <div className="flex align-middle items-center mb-4">
          {isLoading ? (
            <Skeleton className="bg-[#19287A60] h-16 w-16 mr-4 rounded-lg" />
          ) : (
            <Avatar className="h-16 w-16 mr-4 text-center flex items-center justify-center">
              <AvatarImage
                className="rounded-lg"
                src={patientInfo.avatar}
                alt={patientInfo.name}
                width={64}
                height={64}
              />
              <AvatarFallback className="rounded-lg">
                {getInitials(patientInfo.name)}
              </AvatarFallback>
            </Avatar>
          )}

          {isLoading ? (
            <Skeleton className="h-[20px] w-[120px] rounded-md bg-[#19287A40]" />
          ) : (
            <h3 className="text-lg font-semibold">{patientInfo.name}</h3>
          )}
        </div>
        <div className="space-y-2">
          {patientInfo &&
            Object.entries(patientInfo).map(([key, value]) =>
              key !== "avatar" && key !== "name" ? (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500 capitalize">
                    {key.replaceAll("_", " ")}:
                  </span>
                  {isLoading ? (
                    <Skeleton className="h-[20px] w-[120px] rounded-md bg-[#19287A40]" />
                  ) : (
                    <span className="font-medium">
                      {key != "last_intervention"
                        ? (value ? value : "-")
                        : moment(value).format("MMMM Do YYYY, h:mm A")}
                    </span>
                  )}
                </div>
              ) : null
            )}
        </div>
      </CardContent>
      <CardFooter className="bg-[#19287A] hover:bg-[#0C8F8F] transition-colors cursor-pointer text-white font-semibold rounded-b-lg py-2 justify-center align-middle">
        <Link href={patientInfo ? `/patients/${patientInfo.id}` : "#"}>
          <button
            type="button"
            className="flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
          >
            <Eye size={20} />
            <span>Additional Info</span>
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PatientInfoCard;
