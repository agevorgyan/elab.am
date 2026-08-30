import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
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

export const FORBIDDEN_EXTENSIONS = [
  '.php', '.phtml', '.php3', '.php4', '.php5', '.phps', '.phar',
  '.exe', '.sh', '.bash', '.cmd', '.bat',
  '.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx',
  '.html', '.htm', '.xhtml', '.shtml', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py',
  '.env', '.htaccess', '.config',
];

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
 * Inspects binary magic bytes of Buffer content to determine true MIME type
 */
export function detectMimeTypeFromBuffer(buffer: Buffer): { mimeType: string; extension: string } {
  if (!buffer || buffer.length < 4) {
    throw new Error('File content is empty or too short to determine file type.');
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: '.jpg' };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mimeType: 'image/png', extension: '.png' };
  }

  // 3. WEBP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  ) {
    return { mimeType: 'image/webp', extension: '.webp' };
  }

  // 4. GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 && // G
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x38 // 8
  ) {
    return { mimeType: 'image/gif', extension: '.gif' };
  }

  // 5. AVIF: ftypavif or ftypmif1
  if (
    buffer.length >= 12 &&
    buffer[4] === 0x66 && // f
    buffer[5] === 0x74 && // t
    buffer[6] === 0x79 && // y
    buffer[7] === 0x70 // p
  ) {
    const brand = buffer.subarray(8, 12).toString('ascii');
    if (brand.includes('avif') || brand.includes('mif1')) {
      return { mimeType: 'image/avif', extension: '.avif' };
    }
  }

  // 6. SVG: Text content check
  const headStr = buffer.subarray(0, 1024).toString('utf-8').trim().toLowerCase();
  if (headStr.includes('<svg') || (headStr.includes('<?xml') && headStr.includes('<svg'))) {
    // Check that it doesn't contain HTML script/body elements disguised as SVG
    if (!headStr.includes('<html') && !headStr.includes('<body') && !headStr.includes('<script')) {
      return { mimeType: 'image/svg+xml', extension: '.svg' };
    }
  }

  throw new Error('Invalid image content. Binary magic bytes do not match any allowed image format.');
}

/**
 * Sanitizes input filename, strips directory traversal, and blocks executable extensions / double extensions
 */
export function sanitizeFilename(filename: string): { safeOriginalName: string; extension: string } {
  // Strip path traversal prefixes (../, ..\, /etc/passwd)
  const baseNameOnly = path.basename(filename).replace(/[\0\r\n]/g, '');
  const lowerName = baseNameOnly.toLowerCase();

  // Check for forbidden extensions anywhere in the filename (e.g., shell.php.jpg)
  for (const forbidden of FORBIDDEN_EXTENSIONS) {
    if (lowerName.includes(forbidden)) {
      throw new Error(`Forbidden filename. Contains prohibited executable pattern '${forbidden}'.`);
    }
  }

  const ext = path.extname(baseNameOnly).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported extension '${ext}'. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  const nameWithoutExt = path.basename(baseNameOnly, ext);
  const cleanBasename = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');

  const safeOriginalName = `${cleanBasename || 'media'}${ext}`;
  return { safeOriginalName, extension: ext };
}

/**
 * Comprehensive SVG Sanitizer: Strips scripts, event handlers, foreignObjects, external entities, and unsafe URLs
 */
export function sanitizeSvgContent(content: string): string {
  if (!content) return '';

  return content
    // 1. Strip XML External Entities (XXE Defense)
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!ENTITY[\s\S]*?>/gi, '')
    // 2. Strip Script & ForeignObject tags
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, '')
    // 3. Strip inline event handlers (onload, onerror, onclick, etc.)
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // 4. Strip unsafe javascript: / vbscript: / data: URLs
    .replace(/(href|xlink:href|src)\s*=\s*["']\s*(javascript|vbscript|data:(?!image\/)):[^"']*["']/gi, '$1="#"');
}

/**
 * Extracts image dimensions (width & height) from binary headers
 */
export function extractImageDimensions(buffer: Buffer, mimeType: string): { width: number | null; height: number | null } {
  try {
    if (mimeType === 'image/png' && buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    if (mimeType === 'image/gif' && buffer.length >= 10) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }

    if (mimeType === 'image/jpeg') {
      let offset = 2;
      while (offset < buffer.length) {
        const marker = buffer.readUInt16BE(offset);
        if (marker === 0xffc0 || marker === 0xffc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }
  } catch {}

  return { width: null, height: null };
}

/**
 * Validates uploaded file MIME type, magic bytes, extension, size, and security
 */
export function validateMediaUpload(buffer: Buffer, filename: string, _clientMimeType: string) {
  if (buffer.length === 0) {
    throw new Error('Uploaded file is empty (0 bytes).');
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds 10MB limit (uploaded: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB).`);
  }

  // 1. Filename & Extension Sanitization
  const { extension } = sanitizeFilename(filename);

  // 2. Binary Content Magic Bytes Detection
  const detected = detectMimeTypeFromBuffer(buffer);

  // 3. Verify that detected MIME type is in allowed list
  if (!ALLOWED_MIME_TYPES.includes(detected.mimeType)) {
    throw new Error(`Unsupported MIME type '${detected.mimeType}'.`);
  }

  // 4. Verify extension matches detected MIME type
  if (extension !== detected.extension && !(extension === '.jpeg' && detected.extension === '.jpg')) {
    throw new Error(`File extension '${extension}' does not match actual file content type '${detected.mimeType}'.`);
  }

  return detected;
}

/**
 * Gets local upload directory path safely
 */
function getUploadDir(): string {
  return path.join(process.cwd(), 'public', 'uploads');
}

/**
 * Saves uploaded file to disk with unguessable filename and records metadata in PostgreSQL
 */
export async function saveUploadedMedia(
  fileBuffer: Buffer,
  originalFilename: string,
  clientMimeType: string,
  altText?: string
): Promise<MediaRecord> {
  // 1. Strict Server-Side Validation (Magic Bytes, Extension, Size)
  const detected = validateMediaUpload(fileBuffer, originalFilename, clientMimeType);

  let processedBuffer = fileBuffer;

  // 2. SVG Security Sanitization
  if (detected.mimeType === 'image/svg+xml') {
    const rawSvg = fileBuffer.toString('utf-8');
    const safeSvg = sanitizeSvgContent(rawSvg);
    processedBuffer = Buffer.from(safeSvg, 'utf-8');
  }

  // 3. Generate Unguessable Safe Storage Filename
  const randomToken = crypto.randomBytes(16).toString('hex');
  const safeStorageFilename = `${randomToken}${detected.extension}`;
  const uploadDir = getUploadDir();

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const absolutePath = path.join(uploadDir, safeStorageFilename);
  const normalizedPath = path.normalize(absolutePath);

  // Path Traversal Security Assertion
  if (!normalizedPath.startsWith(uploadDir)) {
    throw new Error('Path traversal attempt detected. Upload blocked.');
  }

  const relativeUrl = `/uploads/${safeStorageFilename}`;

  // 4. Write File to Disk
  await fs.writeFile(normalizedPath, processedBuffer);

  // 5. Extract Image Dimensions
  const { width, height } = extractImageDimensions(processedBuffer, detected.mimeType);
  const { safeOriginalName } = sanitizeFilename(originalFilename);

  // 6. Store Metadata in PostgreSQL via Prisma
  const media = await prisma.media.create({
    data: {
      name: safeOriginalName,
      path: relativeUrl,
      url: relativeUrl,
      mimeType: detected.mimeType,
      sizeBytes: processedBuffer.length,
      width,
      height,
      alt: altText || safeOriginalName,
    },
  });

  return media;
}

/**
 * Replaces an existing media file safely
 */
export async function replaceMediaFile(
  id: string,
  fileBuffer: Buffer,
  originalFilename: string,
  clientMimeType: string
): Promise<MediaRecord> {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Media record not found.');
  }

  const detected = validateMediaUpload(fileBuffer, originalFilename, clientMimeType);

  let processedBuffer = fileBuffer;
  if (detected.mimeType === 'image/svg+xml') {
    const rawSvg = fileBuffer.toString('utf-8');
    const safeSvg = sanitizeSvgContent(rawSvg);
    processedBuffer = Buffer.from(safeSvg, 'utf-8');
  }

  // Remove old file if it exists on disk
  const uploadDir = getUploadDir();
  if (existing.path) {
    const oldAbsolute = path.join(uploadDir, path.basename(existing.path));
    await fs.unlink(oldAbsolute).catch(() => {});
  }

  const randomToken = crypto.randomBytes(16).toString('hex');
  const safeStorageFilename = `${randomToken}${detected.extension}`;
  const absolutePath = path.join(uploadDir, safeStorageFilename);

  await fs.writeFile(absolutePath, processedBuffer);

  const relativeUrl = `/uploads/${safeStorageFilename}`;
  const { width, height } = extractImageDimensions(processedBuffer, detected.mimeType);
  const { safeOriginalName } = sanitizeFilename(originalFilename);

  return await prisma.media.update({
    where: { id },
    data: {
      name: safeOriginalName,
      path: relativeUrl,
      url: relativeUrl,
      mimeType: detected.mimeType,
      sizeBytes: processedBuffer.length,
      width,
      height,
    },
  });
}

/**
 * Deletes a media record and its associated file on disk
 */
export async function deleteMediaRecord(id: string): Promise<void> {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) return;

  const uploadDir = getUploadDir();
  if (existing.path) {
    const absolutePath = path.join(uploadDir, path.basename(existing.path));
    await fs.unlink(absolutePath).catch(() => {});
  }

  await prisma.media.delete({ where: { id } });
}

/**
 * Updates alt text for a media record
 */
export async function updateMediaAltText(id: string, altText: string): Promise<MediaRecord> {
  return await prisma.media.update({
    where: { id },
    data: { alt: altText.trim() },
  });
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
}
