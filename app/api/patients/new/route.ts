import { prisma } from "@/prisma";
import { supabase } from "@/supabase";
import { NextRequest, NextResponse } from "next/server";
// import your upload utility, e.g. import { uploadToBucket } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string | null;
    const phone = formData.get("phone") as string | null;
    const dateOfBirth = formData.get("dateOfBirth") as string | null;
    const gender = formData.get("gender") as string | null;
    const avatarFile = formData.get("avatar") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const today = new Date().getFullYear()
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    const avatarFileName = avatarFile ? `P-${today}-${randomId}-avatar` : null;

    const patientData = {
      id: `P-${today}-${randomId}`,
      name,
      avatar: avatarFileName,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
    };

    const savePatient = await prisma.patient.create({
      data: patientData,
    });

    // Upload avatar file to the bucket if present
    if (avatarFile && avatarFileName) {
      try {
        const {  error } = await supabase.storage
          .from("patients.avatars")
          .upload(avatarFileName, avatarFile, {
            contentType: avatarFile.type || "application/octet-stream",
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          throw new Error(error.message || String(error));
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to upload avatar to Supabase");
      }
    }

    return NextResponse.json(savePatient, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to create patient", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
