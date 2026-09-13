import { NextResponse } from 'next/server';
import { MailConfigError, sendMail } from '@/lib/mailer';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { enquirySchema, fieldErrors } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const limit = rateLimit(`enquiry:${clientIp(request)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many messages from this connection. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const { name, phone, email, service, message, company } = parsed.data;

  // Honeypot tripped: accept silently so the bot sees success and moves on.
  if (company) return NextResponse.json({ ok: true });

  try {
    await sendMail({
      subject: `New enquiry — ${name}`,
      replyTo: email,
      fields: [
        ['Name', name],
        ['Phone', phone],
        ['Email', email],
        ['Service', service || 'Not specified'],
        ['Message', message || 'No message'],
      ],
    });
  } catch (error) {
    if (error instanceof MailConfigError) {
      console.error('[enquiry] mail not configured:', error.message);
      return NextResponse.json(
        { error: 'The contact form is not configured yet. Please call or WhatsApp us.' },
        { status: 503 },
      );
    }
    console.error('[enquiry] send failed:', error);
    return NextResponse.json(
      { error: 'Could not send right now. Please try again, or contact us on WhatsApp.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
