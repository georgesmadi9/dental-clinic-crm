import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
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
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
