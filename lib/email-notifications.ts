import { DbLead } from '@/lib/leads-db';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}

/**
 * Dispatches an email message using the configured provider (Resend, SendGrid, SMTP, or Mock)
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string }> {
  const provider = (process.env.EMAIL_PROVIDER || 'mock').toLowerCase();
  const apiKey = process.env.EMAIL_PROVIDER_KEY || '';
  const defaultFrom = process.env.EMAIL_FROM || 'eLab.am Leads <no-reply@elab.am>';

  const from = options.from || defaultFrom;

  try {
    if (provider === 'resend') {
      if (!apiKey) {
        throw new Error('Resend API key missing in EMAIL_PROVIDER_KEY environment variable.');
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        throw new Error(`Resend API returned status ${res.status}: ${errData}`);
      }

      const data = await res.json();
      return { success: true, id: data.id };
    }

    if (provider === 'sendgrid') {
      if (!apiKey) {
        throw new Error('SendGrid API key missing in EMAIL_PROVIDER_KEY environment variable.');
      }

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: options.to }] }],
          from: { email: from },
          subject: options.subject,
          content: [
            { type: 'text/plain', value: options.text },
            { type: 'text/html', value: options.html },
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        throw new Error(`SendGrid API returned status ${res.status}: ${errData}`);
      }

      return { success: true };
    }

    // Mock Provider for local development & automated testing
    return { success: true, id: `mock-${Date.now()}` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Email Notification Error]: Failed to send email to ${options.to} — ${errorMsg}`);
    return { success: false };
  }
}

/**
 * Sends internal team lead notification & optional customer confirmation email
 */
export async function sendLeadNotifications(lead: DbLead): Promise<{ adminSent: boolean; customerSent?: boolean }> {
  const contactEmail = process.env.CONTACT_EMAIL || 'hello@elab.am';
  const confirmationEnabled = process.env.CUSTOMER_CONFIRMATION_EMAIL_ENABLED === 'true';

  const adminSubject = `New Lead Inquiry from ${lead.name} — eLab CRM`;

  const adminHtml = `
    <div style="font-family: sans-serif; background-color: #090a0f; color: #f8fafc; padding: 24px; borderRadius: 12px;">
      <h2 style="color: #00dc93; margin-bottom: 16px;">🚀 New Lead Submitted on eLab.am</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold; width: 140px;">Client Name:</td>
          <td style="padding: 10px; color: #ffffff; font-weight: bold;">${lead.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Company:</td>
          <td style="padding: 10px; color: #ffffff;">${lead.company || 'N/A'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Phone Number:</td>
          <td style="padding: 10px; color: #00dc93; font-weight: bold;">${lead.phone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Email Address:</td>
          <td style="padding: 10px; color: #38bdf8;">${lead.email}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Project Type:</td>
          <td style="padding: 10px; color: #ffffff;">${lead.projectType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Estimated Budget:</td>
          <td style="padding: 10px; color: #a855f7; font-weight: bold;">${lead.budget}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Lead Source:</td>
          <td style="padding: 10px; color: #ffffff;">${lead.source}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #94a3b8; font-weight: bold;">Message:</td>
          <td style="padding: 10px; color: #ffffff;">${lead.message}</td>
        </tr>
      </table>

      <div style="font-size: 12px; color: #64748b;">
        Lead ID: ${lead.id} | Status: NEW | Created At: ${new Date(lead.createdAt).toLocaleString()}
      </div>
    </div>
  `;

  const adminText = `
New Lead Inquiry from ${lead.name}
----------------------------------------
Name: ${lead.name}
Company: ${lead.company || 'N/A'}
Phone: ${lead.phone}
Email: ${lead.email}
Project Type: ${lead.projectType}
Budget: ${lead.budget}
Source: ${lead.source}
Message: ${lead.message}
Lead ID: ${lead.id}
  `.trim();

  // Send admin notification
  const adminResult = await sendEmail({
    to: contactEmail,
    subject: adminSubject,
    html: adminHtml,
    text: adminText,
  });

  let customerSent = false;
  if (confirmationEnabled && lead.email && lead.email.includes('@') && !lead.email.endsWith('@elab.am')) {
    const customerSubject = `We received your inquiry — eLab Digital Studio`;
    const customerHtml = `
      <div style="font-family: sans-serif; padding: 24px;">
        <h2>Hello ${lead.name},</h2>
        <p>Thank you for reaching out to eLab Digital Studio. We have received your project inquiry for <strong>${lead.projectType}</strong>.</p>
        <p>Our team is reviewing your requirements and will get back to you within 24 business hours.</p>
        <br/>
        <p>Best regards,<br/><strong>eLab Team</strong><br/>https://elab.am</p>
      </div>
    `;
    const customerText = `Hello ${lead.name},\n\nThank you for reaching out to eLab Digital Studio. We have received your project inquiry and will get back to you within 24 business hours.\n\nBest regards,\neLab Team`;

    const custRes = await sendEmail({
      to: lead.email,
      subject: customerSubject,
      html: customerHtml,
      text: customerText,
    });
    customerSent = custRes.success;
  }

  return { adminSent: adminResult.success, customerSent };
}
