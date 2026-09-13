import { NextResponse } from 'next/server';
import { MailConfigError, sendMail, type MailAttachment } from '@/lib/mailer';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import {
  applicationSchema,
  fieldErrors,
  RESUME_MAX_BYTES,
  RESUME_MIME_TYPES,
  safeFilename,
  sniffDocumentType,
} from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXTENSION_BY_KIND = { pdf: 'pdf', docx: 'docx', doc: 'doc' } as const;
const MIME_BY_KIND = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

export async function POST(request: Request) {
  const limit = rateLimit(`apply:${clientIp(request)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many applications from this connection. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const value = (key: string) => {
    const raw = form.get(key);
    return typeof raw === 'string' ? raw : '';
  };

  const parsed = applicationSchema.safeParse({
    name: value('name'),
    phone: value('phone'),
    email: value('email'),
    position: value('position'),
    experience: value('experience'),
    about: value('about'),
    company: value('company'),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const { name, phone, email, position, experience, about, company } = parsed.data;

  // Honeypot tripped: accept silently.
  if (company) return NextResponse.json({ ok: true });

  // ── Optional CV ───────────────────────────────────────────────────────────
  const attachments: MailAttachment[] = [];
  const resume = form.get('resume');

  if (resume instanceof File && resume.size > 0) {
    if (resume.size > RESUME_MAX_BYTES) {
      return NextResponse.json(
        { error: 'Your CV is larger than 5MB.', fields: { resume: 'Maximum file size is 5MB.' } },
        { status: 413 },
      );
    }

    const bytes = new Uint8Array(await resume.arrayBuffer());
    const kind = sniffDocumentType(bytes);

    // Trust the file's own bytes, not the declared Content-Type.
    if (!kind || !RESUME_MIME_TYPES.includes(MIME_BY_KIND[kind])) {
      return NextResponse.json(
        {
          error: 'That file type is not accepted.',
          fields: { resume: 'Please upload a PDF or Word document.' },
        },
        { status: 415 },
      );
    }

    const fallback = `${name.replace(/\s+/g, '-')}-CV.${EXTENSION_BY_KIND[kind]}`;
    attachments.push({
      filename: safeFilename(resume.name, fallback),
      content: Buffer.from(bytes),
      contentType: MIME_BY_KIND[kind],
    });
  }

  try {
    await sendMail({
      subject: `Job application — ${position} — ${name}`,
      replyTo: email,
      fields: [
        ['Position', position],
        ['Name', name],
        ['Phone', phone],
        ['Email', email],
        ['Experience', experience || 'Not specified'],
        ['About', about || 'No message'],
        ['CV attached', attachments.length > 0 ? 'Yes' : 'No'],
      ],
      attachments,
    });
  } catch (error) {
    if (error instanceof MailConfigError) {
      console.error('[apply] mail not configured:', error.message);
      return NextResponse.json(
        { error: 'Applications are not configured yet. Please WhatsApp us your CV.' },
        { status: 503 },
      );
    }
    console.error('[apply] send failed:', error);
    return NextResponse.json(
      { error: 'Could not send right now. Please try again, or contact us on WhatsApp.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
