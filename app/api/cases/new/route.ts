import { prisma } from "@/prisma";
import { supabase } from "@/supabase";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let caseData: {
      case_name: string;
      intervention_date: string;
      patient_id: string;
      doctor_note: string;
      report: File | null;
    };

    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      caseData = {
        case_name: formData.get("case_name") as string,
        intervention_date: formData.get("intervention_date") as string,
        patient_id: formData.get("patient_id") as string,
        doctor_note: formData.get("doctor_note") as string,
        report: formData.get("report") as File | null,
      };
    } else {
      const body = await req.json();
      caseData = {
        case_name: body.case_name,
        intervention_date: body.intervention_date,
        patient_id: body.patient_id,
        doctor_note: body.doctor_note,
        report: null, // No file in JSON body
      };
    }

    const fileDate = new Date(caseData.intervention_date).getFullYear();
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();

    const file = caseData.report;
    // Generate a random id (e.g., 8 hex characters)
    const generatedId = Math.random().toString(16).slice(2, 10);
    const filePath = `${moment().format("DD_MM_YYYY")}_${
      file?.name
    }_${randomId}_${generatedId}`;

    const caseCreated = await prisma.case.create({
      data: {
        id: `C-${fileDate}-${randomId}`,
        title: caseData.case_name,
        case_report_link: filePath,
        doctor_note: caseData.doctor_note,
        intervention_date: new Date(caseData.intervention_date),
        patientId: caseData.patient_id,
      },
    });

    if (!caseCreated) {
      throw new Error("Failed to create case in the database");
    }

    if (file) {
      try {
        const { error } = await supabase.storage
          .from("reports")
          .upload(filePath, file, {
            contentType: file.type || "application/octet-stream",
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          throw new Error(error.message || String(error));
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to upload report to Supabase");
      }
    }

    return NextResponse.json(
      { message: "Case created successfully", id: caseCreated.id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
