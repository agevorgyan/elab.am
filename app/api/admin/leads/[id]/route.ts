import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getLeadByIdAdmin,
  updateLeadStatusAdmin,
  assignLeadAdmin,
  addLeadNoteAdmin,
  deleteLeadAdmin,
} from '@/lib/leads-db';
import prisma from '@/lib/prisma';
import { LeadStatus } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdminPermission('manage_leads');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const lead = await getLeadByIdAdmin(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lead details.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_leads');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();

    let updatedLead;

    if (body.status && Object.values(LeadStatus).includes(body.status)) {
      updatedLead = await updateLeadStatusAdmin(id, body.status);
    }

    if (body.assignedTo !== undefined) {
      updatedLead = await assignLeadAdmin(id, body.assignedTo);
    }

    if (body.note && typeof body.note === 'string' && body.note.trim()) {
      await addLeadNoteAdmin(id, user?.id || null, body.note);
      updatedLead = await getLeadByIdAdmin(id);
    }

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_LEAD',
          resource: `Lead:${id}`,
          details: `Updated lead ID ${id} (${body.status || 'notes/assignment'})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update lead.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_leads');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    await deleteLeadAdmin(id);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'DELETE_LEAD',
          resource: `Lead:${id}`,
          details: `Deleted lead ID: ${id}`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete lead.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
