import { PatientLight } from "@/app/types/Patient";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const patientsData = await prisma.patient.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const patientsList: PatientLight[] = patientsData.map((patient) => ({
    id: patient.id,
    name: patient.name,
  })); 

  return NextResponse.json(patientsList);
}
