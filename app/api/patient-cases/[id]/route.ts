import { CaseLight } from "@/app/types/Case";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const patientId = (await params).id;

  const patientCases = await prisma.case.findMany({
    where: {
      patientId: patientId,
    },
    select: {
      id: true,
      title: true,
      intervention_date: true,
    },
  });

  if (!patientCases) {
    return NextResponse.json(
      { error: "Patient has no cases" },
      { status: 404 }
    );
  }

  const cases: CaseLight[] = patientCases.map((c) => ({
    id: c.id,
    case_name: c.title,
    intervention_date: c.intervention_date,
  }));

  return NextResponse.json(cases, { status: 200 });
}
