import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

type CaseWithPatientDb = {
  id: string;
  title: string;
  case_report_link: string | null;
  doctor_note: string | null;
  intervention_date: Date;
  Patient: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
};

export async function GET() {
  const res = prisma.case.findMany({
    include: {
      Patient: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  const cases = await res;

  const mapped = cases.map((c: CaseWithPatientDb) => ({
    id: c.id,
    case_name: c.title,
    case_report: c.case_report_link || '',
    doctor_note: c.doctor_note || '',
    intervention_date: c.intervention_date,
    patient_id: c.Patient?.id || '',
    patient_name: c.Patient?.name || '',
    patient_avatar: c.Patient?.avatar || '',
  }));

  return NextResponse.json(mapped, { status: 200 });
}
