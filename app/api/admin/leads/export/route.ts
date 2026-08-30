import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { exportLeadsCsvAdmin } from '@/lib/leads-db';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_leads');
  if (errorResponse) return errorResponse;

  try {
    const csvContent = await exportLeadsCsvAdmin();

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="elab-crm-leads-export.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to export CSV.' }, { status: 500 });
  }
}
