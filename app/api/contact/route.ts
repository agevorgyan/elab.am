import { NextResponse } from 'next/server';
import { createLeadPublic } from '@/lib/leads-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, projectType, budget, message, honeypot } = body;

    // Spam Protection Honeypot
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    // Save lead into PostgreSQL
    const lead = await createLeadPublic({
      name: name.trim(),
      company: (company || '').trim(),
      phone: phone.trim(),
      email: (email || 'info@elab.am').trim(),
      projectType: projectType || 'custom',
      budget: budget || 'Unspecified',
      message: (message || 'No message content').trim(),
      source: 'Website Contact Form',
    });

    // Webhook dispatch if configured
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
      } catch (webhookErr) {
        console.warn('Webhook dispatch failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully.',
      leadId: lead.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error processing contact submission:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
