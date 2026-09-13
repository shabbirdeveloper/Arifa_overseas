import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * SMTP delivery for the contact and careers forms.
 *
 * Credentials come from environment variables only — nothing reaches the
 * browser bundle. With Gmail, SMTP_PASS must be an App Password (a normal
 * account password is rejected by Google).
 */

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface MailInput {
  subject: string;
  /** Ordered label/value pairs rendered as a table in the email body. */
  fields: Array<[label: string, value: string]>;
  replyTo?: string;
  attachments?: MailAttachment[];
}

class MailConfigError extends Error {}

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
}

function readConfig(): MailConfig {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_TO,
    EMAIL_FROM,
  } = process.env;

  const missing = Object.entries({
    SMTP_HOST,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_TO,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new MailConfigError(
      `Email is not configured — missing ${missing.join(', ')}. See .env.example.`,
    );
  }

  const port = Number(SMTP_PORT ?? 465);

  return {
    host: SMTP_HOST as string,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465,
    user: SMTP_USER as string,
    pass: SMTP_PASS as string,
    to: EMAIL_TO as string,
    from: EMAIL_FROM ?? (SMTP_USER as string),
  };
}

let cached: Transporter | null = null;

function getTransport(config: MailConfig): Transporter {
  cached ??= nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  return cached;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function renderHtml(fields: MailInput['fields']): string {
  const rows = fields
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:10px 14px;border:1px solid #e2e8f0;">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" style="border-collapse:collapse;width:100%;max-width:640px;margin:0 auto;background:#ffffff;">
    <tbody>${rows}</tbody>
  </table>
  <p style="max-width:640px;margin:16px auto 0;font-size:12px;color:#64748b;">Sent from the arifaoverseas.com website.</p>
</body></html>`;
}

const renderText = (fields: MailInput['fields']) =>
  fields.map(([label, value]) => `${label}: ${value}`).join('\n');

export async function sendMail({
  subject,
  fields,
  replyTo,
  attachments,
}: MailInput): Promise<void> {
  const config = readConfig();

  await getTransport(config).sendMail({
    from: `"Arifa Overseas Website" <${config.from}>`,
    to: config.to,
    replyTo,
    subject,
    text: renderText(fields),
    html: renderHtml(fields),
    attachments,
  });
}

export { MailConfigError };
