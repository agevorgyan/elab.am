# Media Backup & Disaster Recovery Guide for eLab.am

This document outlines the backup, restore, and storage management procedures for eLab.am media assets.

---

## 1. Architecture & Storage Separation

eLab.am maintains strict separation between **database metadata** and **physical binary assets**:
- **Database Records**: Stored in PostgreSQL (`Media` table) containing metadata (`id`, `name`, `mimeType`, `sizeBytes`, `path`, `url`, `alt`, `createdAt`).
- **Physical Binary Files**: Stored in `/public/uploads/` (or custom directory specified via `UPLOAD_DIR` env variable) using unguessable 32-hex random filenames (e.g. `a1b2c3d4e5f67890a1b2c3d4e5f67890.webp`).

---

## 2. Media Storage Configuration (`.env`)

Media storage is fully configurable via environment variables:

```env
# Local Storage Driver (Default for cPanel & Local VPS)
MEDIA_STORAGE_DRIVER=local
UPLOAD_DIR=/home/elab/public_html/public/uploads

# S3-Compatible Cloud Storage Driver (Optional for AWS S3 / Cloudflare R2 / MinIO)
# MEDIA_STORAGE_DRIVER=s3
# S3_BUCKET_NAME=elab-media-bucket
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=your_access_key
# S3_SECRET_ACCESS_KEY=your_secret_key
# S3_CDN_URL=https://media.elab.am
```

---

## 3. Automated Local Backup Procedure (cPanel / Linux Cron)

### Step 1: PostgreSQL Database Dump
```bash
pg_dump -U elab_user -d elab_db --table="\"Media\"" -F c -f /home/elab/backups/media_db_$(date +%Y%m%d_%H%M%S).dump
```

### Step 2: Physical Media Files Archive
```bash
tar -czf /home/elab/backups/media_files_$(date +%Y%m%d_%H%M%S).tar.gz -C /home/elab/public_html/public uploads
```

### Step 3: Combined Cron Job Example (`crontab -e`)
```cron
# Run daily media backup at 2:00 AM
0 2 * * * pg_dump -U elab_user -d elab_db -F c -f /home/elab/backups/elab_db_$(date +\%Y\%m\%d).dump && tar -czf /home/elab/backups/elab_media_$(date +\%Y\%m\%d).tar.gz -C /home/elab/public_html/public uploads
```

---

## 4. Disaster Recovery & Restore Procedure

### Restoring Physical Files:
```bash
tar -xzf /home/elab/backups/elab_media_20260831.tar.gz -C /home/elab/public_html/public/
```

### Restoring Database Metadata:
```bash
pg_restore -U elab_user -d elab_db --clean --if-exists /home/elab/backups/elab_db_20260831.dump
```

---

## 5. Orphaned File Cleanup & Audit

To inspect and safely delete orphaned files (physical files on disk with no database record):

```bash
# Dry run audit (Inspects files without deleting)
npx tsx scripts/cleanup-orphaned-media.ts

# Delete orphaned files
npx tsx scripts/cleanup-orphaned-media.ts --delete
```
