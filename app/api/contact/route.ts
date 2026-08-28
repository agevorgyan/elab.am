import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, projectType, budget, message } = body;

    // Server-Side Input Validation
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

    // In a real production setup, send email via Resend/SendGrid/SMTP or log lead into CRM
    console.log('[eLab Lead Submission Received]:', {
      timestamp: new Date().toISOString(),
      name,
      company: company || 'N/A',
      phone,
      email: email || 'N/A',
      projectType,
      budget,
      message: message || 'N/A',
    });

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
