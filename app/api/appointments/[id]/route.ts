import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        Patient: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            phone: true,
          },
        },
        Case: {
          select: {
            id: true,
            title: true,
            intervention_date: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const startTime = formData.get("startTime") as string | null;
    const endTime = formData.get("endTime") as string | null;
    const status = formData.get("status") as string | null;
    const patientId = formData.get("patientId") as string | null;
    const caseId = formData.get("caseId") as string | null;
    const recurrenceRule = formData.get("recurrenceRule") as string | null;

    const updateData: {
      title?: string;
      description?: string;
      startTime?: Date;
      endTime?: Date;
      status?: string;
      patientId?: string;
      caseId?: string;
      recurrenceRule?: string;
    } = {};
    if (title) updateData.title = title;
    if (description !== null) updateData.description = description || undefined;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (status) updateData.status = status;
    if (patientId) updateData.patientId = patientId;
    if (caseId !== null) updateData.caseId = caseId || undefined;
    if (recurrenceRule !== null) updateData.recurrenceRule = recurrenceRule || undefined;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const deletedAppointment = await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Appointment deleted successfully",
        deletedAppointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
