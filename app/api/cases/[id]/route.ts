import { prisma } from "@/prisma";
import { Case } from "@/app/types/Case";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caseId = (await params).id;

  const caseData = await prisma.case.findUnique({ where: { id: String(caseId) } });

  if (!caseData) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const mappedCase: Case = {
    id: caseData.id,
    case_name: caseData.title,
    patient_id: caseData?.patientId ?? "",
    case_report: caseData?.case_report_link ?? "",
    doctor_note: caseData?.doctor_note ?? "",
    intervention_date: new Date(caseData.intervention_date),
  };

  return NextResponse.json(mappedCase, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params:  Promise<{ id: string }>  }) {
  const caseId = (await params).id;

  const response = await prisma.case.delete({ where: { id: String(caseId) } });

  if (!response) {
    return NextResponse.json({ error: "Case does not exist" }, { status: 500 });
  }

  return NextResponse.json({ message: "Case deleted successfully", deletedCase: response }, { status: 200 });
}