import { NextRequest, NextResponse } from 'next/server';
import { createLeadPublic } from '@/lib/leads-db';
import { sendLeadNotifications } from '@/lib/email-notifications';
import prisma from '@/lib/prisma';

// Simple in-memory rate limiting store (IP -> timestamp[])
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];

  // Filter timestamps within current window
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, validTimestamps);
  return false;
}

/**
 * Strips HTML tags and dangerous script content from input strings
 */
function sanitizeInput(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/script/gi, '')
    .trim();
}

/**
 * Validates email string format
 */
function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, company, phone, email, projectType, budget, message, honeypot, source } = body;

    // 2. Honeypot Anti-Spam Check
    if (honeypot && typeof honeypot === 'string' && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: 'Inquiry received successfully.' });
    }

    // 3. Server-side Validation & Input Sanitization
    const cleanName = sanitizeInput(name);
    const cleanPhone = sanitizeInput(phone);
    const cleanCompany = sanitizeInput(company);
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanProjectType = sanitizeInput(projectType) || 'corporate-website';
    const cleanBudget = sanitizeInput(budget) || 'Unspecified';
    const cleanMessage = sanitizeInput(message);
    const cleanSource = sanitizeInput(source) || 'Website Form';

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!cleanPhone || cleanPhone.length < 5) {
      return NextResponse.json(
        { success: false, message: 'A valid phone number is required.' },
        { status: 400 }
      );
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 4. Duplicate Accidental Submission Prevention (Within 60s)
    const duplicateWindowTime = new Date(Date.now() - 60 * 1000);
    const existingRecentLead = await prisma.lead.findFirst({
      where: {
        phone: cleanPhone,
        createdAt: { gte: duplicateWindowTime },
      },
    });

    if (existingRecentLead) {
      return NextResponse.json({
        success: true,
        message: 'Inquiry received successfully.',
        leadId: existingRecentLead.id,
      });
    }

    // 5. Store Lead in PostgreSQL with status NEW
    const lead = await createLeadPublic({
      name: cleanName,
      company: cleanCompany || undefined,
      phone: cleanPhone,
      email: cleanEmail || 'no-email@elab.am',
      projectType: cleanProjectType,
      budget: cleanBudget,
      message: cleanMessage || 'Contact inquiry',
      source: cleanSource,
    });

    // 6. Send Email Notifications (Non-blocking: lead creation succeeds even if provider fails)
    sendLeadNotifications(lead).catch((err) => {
      console.warn('[Email Notification Dispatch Warning]:', err);
    });

    // 7. Optional Webhook Notification
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'LEAD_CREATED',
          leadId: lead.id,
          name: lead.name,
          company: lead.company,
          phone: lead.phone,
          email: lead.email,
          projectType: lead.projectType,
          budget: lead.budget,
          status: lead.status,
          createdAt: lead.createdAt,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully.',
      leadId: lead.id,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
