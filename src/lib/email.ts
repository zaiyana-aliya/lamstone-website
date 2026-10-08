import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "mail@lamstonehealthcare.com";
const TEAM = process.env.RESEND_TEAM_EMAIL ?? "mail@lamstonehealthcare.com";

// ─── Helper ───────────────────────────────────────────────────────────────────
async function send(to: string | string[], subject: string, html: string) {
  try {
    const { error } = await resend.emails.send({
      from: `Lamstone HealthCare <${FROM}>`,
      to,
      subject,
      html,
    });
    if (error) console.error("[Resend error]", error);
  } catch (err) {
    // Never throw — email failure should not break form submission
    console.error("[Resend exception]", err);
  }
}

// ─── Branded wrapper HTML ─────────────────────────────────────────────────────
function branded(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(11,42,74,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0B2A4A 0%,#143d6b 100%);padding:28px 40px 24px">
            <div style="display:flex;align-items:center;gap:12px">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#fff;letter-spacing:-0.3px">Lamstone <span style="color:#E2C785">HealthCare</span></span>
            </div>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px 28px">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fafbfd;border-top:1px solid #e8eaed;padding:20px 40px;text-align:center">
            <p style="margin:0;font-size:12px;color:#9ca3af">
              Lamstone HealthCare Pvt Ltd · Z Avenue, NH 66, Mangalapuram, Kerala 695317<br>
              <a href="mailto:mail@lamstonehealthcare.com" style="color:#b00f23;text-decoration:none">mail@lamstonehealthcare.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const h2 = (t: string) =>
  `<h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#0B2A4A;font-weight:500">${t}</h2>`;

const p = (t: string) =>
  `<p style="margin:0 0 14px;font-size:15px;color:#374151;line-height:1.7">${t}</p>`;

const row = (label: string, value: string) =>
  `<tr><td style="padding:8px 12px;font-size:13px;font-weight:600;color:#6b7280;width:140px;background:#fafbfd;border:1px solid #e8eaed">${label}</td><td style="padding:8px 12px;font-size:14px;color:#111827;border:1px solid #e8eaed">${value}</td></tr>`;

const table = (rows: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0">${rows}</table>`;

const badge = (color: string, text: string) =>
  `<span style="display:inline-block;padding:4px 12px;border-radius:20px;background:${color};font-size:12px;font-weight:600;color:#fff;margin-bottom:20px">${text}</span>`;

// ─── 1. Contact: confirmation to submitter ────────────────────────────────────
export async function sendContactConfirmation(to: string, name: string) {
  await send(
    to,
    "We've received your message — Lamstone HealthCare",
    branded(`
      ${h2("Thank you for reaching out!")}
      ${p(`Hi <strong>${name}</strong>,`)}
      ${p("We've received your message and our team will respond within <strong>24 hours</strong>.")}
      ${p("In the meantime, feel free to explore our pharmacy network and cosmetics division.")}
      <p style="margin:24px 0 0">
        <a href="https://www.lamstonehealthcare.com" style="display:inline-block;padding:12px 28px;background:#b00f23;color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">
          Visit Our Website
        </a>
      </p>
    `)
  );
}

// ─── 2. Contact: team alert ───────────────────────────────────────────────────
export async function sendContactTeamAlert(data: {
  full_name: string; email: string; phone?: string; subject: string; message: string;
}) {
  await send(
    TEAM,
    `[New Contact] ${data.subject} — ${data.full_name}`,
    branded(`
      ${badge("#0B2A4A", "NEW CONTACT SUBMISSION")}
      ${h2("New Contact Form Submission")}
      ${table([
        row("Name", data.full_name),
        row("Email", `<a href="mailto:${data.email}" style="color:#b00f23">${data.email}</a>`),
        row("Phone", data.phone || "—"),
        row("Subject", data.subject),
        row("Message", data.message.replace(/\n/g, "<br>")),
      ].join(""))}
    `)
  );
}

// ─── 3. Newsletter: welcome ───────────────────────────────────────────────────
export async function sendNewsletterWelcome(to: string) {
  await send(
    to,
    "Welcome to Lamstone HealthCare Updates",
    branded(`
      ${h2("You're subscribed!")}
      ${p("Thank you for subscribing to Lamstone HealthCare updates.")}
      ${p("You will receive our latest pharmacy news, Lamé product releases, and healthcare insights.")}
    `)
  );
}

// ─── 4. Investment: team alert ────────────────────────────────────────────────
export async function sendInvestmentAlert(data: {
  name: string; email: string; phone: string;
  request_type: string; opportunity_name?: string; message: string;
}) {
  const typeLabel: Record<string, string> = {
    deck: "Investment Deck Request",
    memorandum: "Information Memorandum Request",
    opportunity_inquiry: "Opportunity Inquiry",
  };
  await send(
    TEAM,
    `[Investment] ${typeLabel[data.request_type] ?? data.request_type} — ${data.name}`,
    branded(`
      ${badge("#C9A227", "INVESTMENT INQUIRY")}
      ${h2(`Investment: ${typeLabel[data.request_type] ?? data.request_type}`)}
      ${table([
        row("Name", data.name),
        row("Email", `<a href="mailto:${data.email}" style="color:#b00f23">${data.email}</a>`),
        row("Phone", data.phone),
        row("Type", typeLabel[data.request_type] ?? data.request_type),
        data.opportunity_name ? row("Opportunity", data.opportunity_name) : "",
        row("Message", data.message.replace(/\n/g, "<br>")),
      ].join(""))}
    `)
  );
}

// ─── 5. Distribution: team alert ─────────────────────────────────────────────
export async function sendDistributionAlert(data: {
  name: string; email: string; phone: string;
  company: string; category: string; message: string;
}) {
  const categoryLabel: Record<string, string> = {
    skincare: "Skincare",
    personal_care: "Personal Care",
    healthcare_cosmetics: "Healthcare Cosmetics",
  };
  await send(
    TEAM,
    `[Distribution] ${categoryLabel[data.category] ?? data.category} — ${data.company}`,
    branded(`
      ${badge("#0B2A4A", "DISTRIBUTION INQUIRY")}
      ${h2("Distribution Inquiry")}
      ${table([
        row("Name", data.name),
        row("Company", data.company),
        row("Email", `<a href="mailto:${data.email}" style="color:#b00f23">${data.email}</a>`),
        row("Phone", data.phone),
        row("Category", categoryLabel[data.category] ?? data.category),
        row("Message", data.message.replace(/\n/g, "<br>")),
      ].join(""))}
    `)
  );
}

// ─── 6. Careers: team alert ───────────────────────────────────────────────────
export async function sendCareersAlert(data: {
  full_name: string; email: string; phone: string;
  position: string; cover_letter: string; resume_url?: string;
}) {
  await send(
    TEAM,
    `[Careers] Application — ${data.full_name} for ${data.position}`,
    branded(`
      ${badge("#059669", "CAREER APPLICATION")}
      ${h2("New Career Application")}
      ${table([
        row("Name", data.full_name),
        row("Email", `<a href="mailto:${data.email}" style="color:#b00f23">${data.email}</a>`),
        row("Phone", data.phone),
        row("Position", data.position),
        row("Cover Letter", data.cover_letter.replace(/\n/g, "<br>")),
        data.resume_url ? row("Resume", `<a href="${data.resume_url}" style="color:#b00f23">Download Resume</a>`) : row("Resume", "Not provided"),
      ].join(""))}
    `)
  );
}

// ─── 7. Partnership: team alert ───────────────────────────────────────────────
export async function sendPartnershipAlert(data: {
  name: string; email: string; phone: string;
  inquiry_type: string; message: string;
}) {
  const typeLabel = data.inquiry_type === "pharmacy_partner"
    ? "Pharmacy Partnership"
    : "General Partnership";
  await send(
    TEAM,
    `[Partnership] ${typeLabel} — ${data.name}`,
    branded(`
      ${badge("#b00f23", "PARTNERSHIP INQUIRY")}
      ${h2(`${typeLabel} Inquiry`)}
      ${table([
        row("Name", data.name),
        row("Email", `<a href="mailto:${data.email}" style="color:#b00f23">${data.email}</a>`),
        row("Phone", data.phone),
        row("Type", typeLabel),
        row("Message", data.message.replace(/\n/g, "<br>")),
      ].join(""))}
    `)
  );
}
