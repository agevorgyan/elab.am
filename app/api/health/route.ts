import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: 'healthy' | 'unhealthy';
  storage: 'healthy' | 'unhealthy';
  config: 'healthy' | 'unhealthy';
  timestamp: string;
}

export async function GET() {
  let databaseStatus: 'healthy' | 'unhealthy' = 'unhealthy';
  let storageStatus: 'healthy' | 'unhealthy' = 'unhealthy';
  let configStatus: 'healthy' | 'unhealthy' = 'unhealthy';

  // 1. PostgreSQL Database Connection Check
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'healthy';
  } catch {
    databaseStatus = 'unhealthy';
  }

  // 2. Storage Availability & Writable Access Check
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const testFile = path.join(uploadDir, `.health_check_${Date.now()}`);
    await fs.writeFile(testFile, 'ok');
    await fs.unlink(testFile);
    storageStatus = 'healthy';
  } catch {
    storageStatus = 'unhealthy';
  }

  // 3. Required Environment Configuration Check
  try {
    const hasDbUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
    const hasSecret = Boolean(
      (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.trim()) ||
      (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    );

    if (hasDbUrl && hasSecret) {
      configStatus = 'healthy';
    } else {
      configStatus = 'unhealthy';
    }
  } catch {
    configStatus = 'unhealthy';
  }

  // Determine overall status
  const isHealthy = databaseStatus === 'healthy' && storageStatus === 'healthy' && configStatus === 'healthy';
  const isDegraded = databaseStatus === 'healthy' && (storageStatus === 'unhealthy' || configStatus === 'unhealthy');

  const status: 'healthy' | 'degraded' | 'unhealthy' = isHealthy
    ? 'healthy'
    : isDegraded
    ? 'degraded'
    : 'unhealthy';

  const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  const payload: HealthCheckResponse = {
    status,
    database: databaseStatus,
    storage: storageStatus,
    config: configStatus,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
