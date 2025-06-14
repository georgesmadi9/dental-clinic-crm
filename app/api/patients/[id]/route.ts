import { Patient, PatientWithLastCase } from "@/app/types/Patient";
import { prisma } from "@/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const patientId = (await params).id;

  const { searchParams } = new URL(_req.url);
  const getLastCase: boolean = searchParams.get("last-case") === "true";

  const patientData = await prisma.patient.findUnique({
    where: { id: String(patientId) },
  });

  if (!patientData) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  let lastCase: Date | null = null;
  if (getLastCase) {
    const q = await prisma.case.findFirst({
      where: {
        patientId: String(patientId),
      },
      orderBy: {
        intervention_date: "asc",
      },
      select: {
        intervention_date: true,
      },
    });

    console.log(lastCase);

    lastCase = q?.intervention_date ?? null;
  }

  console.log(patientData);

  const mappedPatient: Patient | PatientWithLastCase = {
    id: patientData.id,
    name: patientData.name,
    avatar: patientData.avatar ?? "",
    gender:
      patientData.gender === "Male" || patientData.gender === "Female"
        ? patientData.gender
        : "Male",
    date_of_birth: moment(
      patientData.dateOfBirth ? patientData.dateOfBirth : ""
    ).format("MMM Do YY"),
    phone_number: patientData?.phone ?? "",
    email: patientData.email ?? "",
    last_intervention: lastCase ? lastCase : new Date(),
  };

  return NextResponse.json(mappedPatient, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const patientId = (await params).id;

  try {
    const response = await prisma.patient.delete({
      where: { id: String(patientId) },
    });
    return NextResponse.json(
      { message: "Patient deleted successfully", deletedPatient: response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete patient", details: error },
      { status: 500 }
    );
  }
}
