import nodemailer from "nodemailer"
import fetch from "node-fetch"

/**
 * Helpers to send emails either through SMTP (nodemailer) or Resend.
 *
 * Required env vars:
 * - EMAIL_FROM (sender email)
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  (for nodemailer)
 * - RESEND_API_KEY (if you prefer Resend)
 *
 * sendReportEmail({ to, subject, text, attachments })
 *
 * attachments: [{ filename, content (Buffer or string), contentType }]
 */

type Attachment = { filename: string; content: Buffer | string; contentType?: string }

export async function sendReportEmail({ to, subject, text, attachments }: { to: string; subject: string; text?: string; attachments?: Attachment[] }) {
  // prefer SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return sendWithNodemailer({ to, subject, text, attachments })
  }

  // fallback to Resend if key provided
  if (process.env.RESEND_API_KEY) {
    return sendWithResend({ to, subject, text, attachments })
  }

  throw new Error("No email provider configured. Set SMTP_* or RESEND_API_KEY in env.")
}

async function sendWithNodemailer({ to, subject, text, attachments = [] }: { to: string; subject: string; text?: string; attachments?: Attachment[] }) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || "587")
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM || user

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  } as any)

  const mailOptions: any = {
    from,
    to,
    subject,
    text,
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
      contentType: a.contentType,
    })),
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

async function sendWithResend({ to, subject, text, attachments = [] }: { to: string; subject: string; text?: string; attachments?: Attachment[] }) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!key || !from) throw new Error("RESEND_API_KEY and EMAIL_FROM must be set for Resend")

  // Resend expects base64 attachments in JSON
  const attachmentsPayload = attachments.map((a) => {
    const data = typeof a.content === "string" ? Buffer.from(a.content).toString("base64") : a.content.toString("base64")
    return { name: a.filename, data }
  })

  const body = {
    from,
    to,
    subject,
    html: text || "<div>Report attached</div>",
    attachments: attachmentsPayload,
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Resend error: ${res.status} ${txt}`)
  }
  return res.json()
}
