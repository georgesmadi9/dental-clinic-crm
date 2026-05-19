import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const status = formData.get("status") as string || "Scheduled";
    const patientId = formData.get("patientId") as string;
    const caseId = formData.get("caseId") as string | null;
    const recurrenceRule = formData.get("recurrenceRule") as string | null;

    // Generate custom ID format: A-{YEAR}-{RANDOM6}
    const year = new Date().getFullYear();
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    const customId = `A-${year}-${randomId}`;

    const appointment = await prisma.appointment.create({
      data: {
        id: customId,
        title,
        description: description || undefined,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status,
        patientId,
        caseId: caseId || undefined,
        recurrenceRule: recurrenceRule || undefined,
      },
      include: {
        Patient: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        Case: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
