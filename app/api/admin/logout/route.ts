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
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.redirect(new URL('/admin/login', req.url), 303);
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url), 303);
  }
}
