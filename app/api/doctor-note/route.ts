import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma'; // Adjust the import path as needed

export async function POST(req: NextRequest) {
    try {
        const { note, caseId } = await req.json();

        if (typeof note !== 'string' || !note.trim()) {
            return NextResponse.json({ error: 'Invalid note' }, { status: 400 });
        }

        await prisma.case.update({
            where: {id: caseId},
            data: {
                doctor_note: note,
            }
        })

        return NextResponse.json({ status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
    }
}