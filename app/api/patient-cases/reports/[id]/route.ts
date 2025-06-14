import { CaseReport } from "@/app/types/Case";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const patientId = (await params).id

    const q = await prisma.case.findMany({
        where: {
            patientId: patientId
        },
        select: {
            id: true,
            case_report_link: true
        }
    })

    const reports : CaseReport[] = q.map((report) => ({
        id: report.id,
        report_link: report.case_report_link ?? ""
    }))

    return NextResponse.json(reports, {status: 200})
}
