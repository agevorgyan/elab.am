import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { updateMediaAltText, replaceMediaFile, deleteMediaRecord } from '@/lib/media-storage';
import prisma from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdminPermission('manage_media');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const altText = formData.get('alt') as string | null;

      let updatedMedia;
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        updatedMedia = await replaceMediaFile(id, buffer, file.name, file.type);
      }

      if (altText !== null) {
        updatedMedia = await updateMediaAltText(id, altText);
      }

      return NextResponse.json({ success: true, media: updatedMedia });
    } else {
      const body = await req.json();
      const updatedMedia = await updateMediaAltText(id, body.alt || '');
      return NextResponse.json({ success: true, media: updatedMedia });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update media.';
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
  const { user, errorResponse } = await requireAdminPermission('manage_media');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    await deleteMediaRecord(id);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'DELETE_MEDIA',
          resource: `Media:${id}`,
          details: `Deleted media ID: ${id}`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete media.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
