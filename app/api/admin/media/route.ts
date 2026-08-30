import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getPaginatedMediaAdmin, saveUploadedMedia } from '@/lib/media-storage';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminPermission('manage_media');
  if (errorResponse) return errorResponse;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '12', 10);
  const search = url.searchParams.get('search') || '';
  const filter = url.searchParams.get('filter') || 'all';

  try {
    const result = await getPaginatedMediaAdmin(page, limit, search, filter);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media library.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_media');
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await saveUploadedMedia(buffer, file.name, file.type, altText);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPLOAD_MEDIA',
          resource: `Media:${media.id}`,
          details: `Uploaded file: ${media.name} (${media.path})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Media upload failed.' },
      { status: 400 }
    );
  }
}
