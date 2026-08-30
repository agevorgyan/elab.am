import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin, destroyAdminSession } from '@/lib/auth';
import { logAuditAction } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentAdmin();
    if (user) {
      logAuditAction({
        req,
        userId: user.id,
        action: 'LOGOUT',
        entityType: 'User',
        entityId: user.id,
        resource: `User:${user.id}`,
        details: `User ${user.email} logged out.`,
      }).catch(() => {});
    }

    await destroyAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
