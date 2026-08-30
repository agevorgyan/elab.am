import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, projectType, budget, message, honeypot } = body;

    // Rule #24: Spam Protection Honeypot
    if (honeypot && honeypot.length > 0) {
      // Quietly reject bot submissions
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    // Rule #21 & #22: Input Validation
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

    // Rule #23: Form Destination Configuration via Environment Variables
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    const notificationEmail = process.env.CONTACT_EMAIL || 'info@elab.am';

    const leadPayload = {
      timestamp: new Date().toISOString(),
      name: name.trim(),
      company: (company || 'N/A').trim(),
      phone: phone.trim(),
      email: (email || 'N/A').trim(),
      projectType,
      budget,
      message: (message || 'N/A').trim(),
      destinationEmail: notificationEmail,
    };

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
        });
      } catch (webhookErr) {
        console.warn('Webhook dispatch failed:', webhookErr);
      }
    }

    console.log('[eLab Lead Submitted Successfully]:', leadPayload);

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing contact submission:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
