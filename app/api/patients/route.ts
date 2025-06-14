import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const patientsWithLastCase = await prisma.patient.findMany({
      include: {
        cases: {
          orderBy: {
            intervention_date: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(patientsWithLastCase, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
