import fs from 'fs/promises';
import path from 'path';
import prisma from '../lib/prisma';

async function cleanupOrphanedMedia() {
  console.log('🚀 RUNNING ORPHANED MEDIA CLEANUP AUDIT...\n');

  try {
    const uploadDir = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), 'public', 'uploads');

    // 1. Fetch all media paths registered in PostgreSQL database
    const dbRecords = await prisma.media.findMany({ select: { id: true, path: true, name: true } });
    const registeredBasenames = new Set(
      dbRecords.map((r) => path.basename(r.path)).filter(Boolean)
    );

    console.log(`📊 Found ${dbRecords.length} registered media records in PostgreSQL database.`);

    // 2. Read physical files in upload directory
    let filesOnDisk: string[] = [];
    try {
      filesOnDisk = (await fs.readdir(uploadDir)).filter((f) => !f.startsWith('.'));
    } catch {
      console.log('⚠️ Upload directory does not exist or cannot be read.');
      return;
    }

    console.log(`📁 Found ${filesOnDisk.length} physical media files in ${uploadDir}.\n`);

    // 3. Detect Orphaned Files (on disk, not in database)
    const orphanedFiles: string[] = [];
    for (const file of filesOnDisk) {
      if (!registeredBasenames.has(file)) {
        orphanedFiles.push(file);
      }
    }

    console.log(`🔍 Detected ${orphanedFiles.length} orphaned files on disk with no database record:`);
    for (const orphan of orphanedFiles) {
      console.log(`   - ${orphan}`);
      if (process.argv.includes('--delete')) {
        const orphanPath = path.join(uploadDir, orphan);
        await fs.unlink(orphanPath).catch(() => {});
        console.log(`     🗑️ Deleted orphaned file: ${orphan}`);
      }
    }

    if (orphanedFiles.length > 0 && !process.argv.includes('--delete')) {
      console.log('\n💡 Tip: Run `npx tsx scripts/cleanup-orphaned-media.ts --delete` to remove orphaned files.');
    }

    // 4. Detect Broken Database Records (in database, missing from disk)
    const diskFileSet = new Set(filesOnDisk);
    const brokenRecords = dbRecords.filter((r) => !diskFileSet.has(path.basename(r.path)));

    console.log(`\n🔍 Detected ${brokenRecords.length} broken database records with missing files:`);
    for (const broken of brokenRecords) {
      console.log(`   - ID: ${broken.id} | Name: "${broken.name}" | Path: ${broken.path}`);
    }

    console.log('\n🎉 ORPHANED MEDIA AUDIT COMPLETE!');
  } catch (err) {
    console.error('\n❌ AUDIT FAILURE:', err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedMedia();
