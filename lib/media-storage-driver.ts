import fs from 'fs/promises';
import path from 'path';

export interface StorageDriver {
  saveFile(buffer: Buffer, storageFilename: string): Promise<string>;
  deleteFile(storageFilename: string): Promise<void>;
  fileExists(storageFilename: string): Promise<boolean>;
  listAllFiles(): Promise<string[]>;
}

function getUploadDir(): string {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }
  return path.join(process.cwd(), 'public', 'uploads');
}

/**
 * Local Filesystem Media Storage Driver (Supports cPanel & local deployments)
 */
export class LocalStorageDriver implements StorageDriver {
  private uploadDir: string;

  constructor() {
    this.uploadDir = getUploadDir();
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  async saveFile(buffer: Buffer, storageFilename: string): Promise<string> {
    await this.ensureDir();
    const targetPath = path.join(this.uploadDir, path.basename(storageFilename));
    
    // Bounds check to prevent path traversal
    if (!targetPath.startsWith(this.uploadDir)) {
      throw new Error('Invalid storage path filename.');
    }

    await fs.writeFile(targetPath, buffer);
    return `/uploads/${path.basename(storageFilename)}`;
  }

  async deleteFile(storageFilename: string): Promise<void> {
    const targetPath = path.join(this.uploadDir, path.basename(storageFilename));
    if (targetPath.startsWith(this.uploadDir)) {
      await fs.unlink(targetPath).catch(() => {});
    }
  }

  async fileExists(storageFilename: string): Promise<boolean> {
    try {
      const targetPath = path.join(this.uploadDir, path.basename(storageFilename));
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  async listAllFiles(): Promise<string[]> {
    try {
      await this.ensureDir();
      const files = await fs.readdir(this.uploadDir);
      return files.filter((f) => !f.startsWith('.'));
    } catch {
      return [];
    }
  }
}

/**
 * S3-compatible Media Storage Driver Interface (Placeholder for AWS S3 / Cloudflare R2 / MinIO)
 */
export class S3StorageDriver implements StorageDriver {
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME || 'elab-media';
  }

  async saveFile(buffer: Buffer, storageFilename: string): Promise<string> {
    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      throw new Error('S3 credentials not configured. Falling back to local storage.');
    }
    // S3 putObject implementation hook
    const cdnUrl = process.env.S3_CDN_URL || `https://${this.bucket}.s3.amazonaws.com`;
    return `${cdnUrl}/${path.basename(storageFilename)}`;
  }

  async deleteFile(storageFilename: string): Promise<void> {
    // S3 deleteObject implementation hook
  }

  async fileExists(): Promise<boolean> {
    return true;
  }

  async listAllFiles(): Promise<string[]> {
    return [];
  }
}

/**
 * Gets active media storage driver based on MEDIA_STORAGE_DRIVER env variable
 */
export function getStorageDriver(): StorageDriver {
  const driverName = (process.env.MEDIA_STORAGE_DRIVER || 'local').toLowerCase();
  if (driverName === 's3') {
    return new S3StorageDriver();
  }
  return new LocalStorageDriver();
}
