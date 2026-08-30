import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/avif',
];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif'];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface MediaRecord {
  id: string;
  name: string;
  path: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  createdAt: Date;
}

/**
 * Sanitizes input filename to prevent directory traversal and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  const extension = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, extension);
  const cleanBasename = basename
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-');
  
  const timestamp = Date.now();
  return `${cleanBasename}-${timestamp}${extension}`;
}

/**
 * Sanitizes SVG file content to prevent XSS attacks or malicious script execution
 */
export function sanitizeSvgContent(content: string): string {
  return content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*".*?"/gi, '')
    .replace(/on\w+\s*=\s*'.*?'/gi, '')
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '');
}

/**
 * Validates uploaded file MIME type, extension, size, and security
 */
export function validateMediaUpload(filename: string, mimeType: string, sizeBytes: number) {
  const ext = path.extname(filename).toLowerCase();

  // Executable prevention
  const forbiddenExts = ['.php', '.exe', '.sh', '.js', '.py', '.html', '.htm', '.pl', '.cgi'];
  if (forbiddenExts.includes(ext)) {
    throw new Error('Forbidden file extension. Executable uploads are strictly blocked.');
  }

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported file extension '${ext}'. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported MIME type '${mimeType}'.`);
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds 10MB limit (uploaded: ${(sizeBytes / (1024 * 1024)).toFixed(2)}MB).`);
  }
}

/**
 * Gets local upload directory path
 */
function getUploadDir(): string {
  return path.join(process.cwd(), 'public', 'uploads');
}

/**
 * Saves uploaded file to disk and records metadata in PostgreSQL
 */
export async function saveUploadedMedia(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string,
  altText?: string
): Promise<MediaRecord> {
  validateMediaUpload(originalFilename, mimeType, fileBuffer.length);

  let processedBuffer = fileBuffer;

  // SVG Security Sanitization
  if (mimeType === 'image/svg+xml' || originalFilename.endsWith('.svg')) {
    const rawSvg = fileBuffer.toString('utf-8');
    const safeSvg = sanitizeSvgContent(rawSvg);
    processedBuffer = Buffer.from(safeSvg, 'utf-8');
  }

  const safeFilename = sanitizeFilename(originalFilename);
  const uploadDir = getUploadDir();

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const relativePath = `/uploads/${safeFilename}`;
  const absolutePath = path.join(uploadDir, safeFilename);

  // Write file to disk
  await fs.writeFile(absolutePath, processedBuffer);

  // Store in PostgreSQL via Prisma
  const media = await prisma.media.create({
    data: {
      name: originalFilename,
      path: relativePath,
      url: relativePath,
      mimeType,
      sizeBytes: processedBuffer.length,
      alt: altText || originalFilename,
    },
  });

  return media;
}

/**
 * Retrieves paginated media records from PostgreSQL
 */
export async function getPaginatedMediaAdmin(
  page = 1,
  limit = 12,
  search = '',
  mimeFilter = 'all'
): Promise<{ media: MediaRecord[]; total: number; totalPages: number; page: number }> {
  try {
    const where: Prisma.MediaWhereInput = {};

    if (search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (mimeFilter === 'svg') {
      where.mimeType = 'image/svg+xml';
    } else if (mimeFilter === 'image') {
      where.mimeType = { not: 'image/svg+xml' };
    }

    const skip = (page - 1) * limit;

    const [total, media] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      media,
      total,
      totalPages,
      page,
    };
  } catch {
    return { media: [], total: 0, totalPages: 1, page: 1 };
  }
}

/**
 * Retrieves all media records from PostgreSQL
 */
export async function getAllMediaAdmin(): Promise<MediaRecord[]> {
  try {
    return await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

/**
 * Updates alt text of a media record
 */
export async function updateMediaAltText(id: string, altText: string): Promise<MediaRecord> {
  return await prisma.media.update({
    where: { id },
    data: { alt: altText },
  });
}

/**
 * Replaces media file buffer and metadata
 */
export async function replaceMediaFile(
  id: string,
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<MediaRecord> {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Media record not found.');
  }

  validateMediaUpload(originalFilename, mimeType, fileBuffer.length);

  // Remove existing file from disk if it exists
  try {
    const oldAbsolutePath = path.join(process.cwd(), 'public', existing.path);
    await fs.unlink(oldAbsolutePath).catch(() => {});
  } catch {}

  let processedBuffer = fileBuffer;
  if (mimeType === 'image/svg+xml' || originalFilename.endsWith('.svg')) {
    const rawSvg = fileBuffer.toString('utf-8');
    processedBuffer = Buffer.from(sanitizeSvgContent(rawSvg), 'utf-8');
  }

  const safeFilename = sanitizeFilename(originalFilename);
  const relativePath = `/uploads/${safeFilename}`;
  const absolutePath = path.join(getUploadDir(), safeFilename);

  await fs.mkdir(getUploadDir(), { recursive: true });
  await fs.writeFile(absolutePath, processedBuffer);

  return await prisma.media.update({
    where: { id },
    data: {
      name: originalFilename,
      path: relativePath,
      url: relativePath,
      mimeType,
      sizeBytes: processedBuffer.length,
    },
  });
}

/**
 * Deletes media file from storage disk and PostgreSQL
 */
export async function deleteMediaRecord(id: string): Promise<void> {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Media record not found.');
  }

  try {
    const absolutePath = path.join(process.cwd(), 'public', existing.path);
    await fs.unlink(absolutePath).catch(() => {});
  } catch {}

  await prisma.media.delete({ where: { id } });
}
