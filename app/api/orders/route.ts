import { google } from "googleapis";
import { Resend } from "resend";
import type { NextRequest } from "next/server";

import { validateOrderBody } from "../../lib/orderValidation";

type RateEntry = { count: number; resetAt: number };
const RATE_LIMIT = new Map<string, RateEntry>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  // @ts-expect-error NextRequest.ip exists in some runtimes
  return req.ip || "unknown";
}

function rateLimitOk(ip: string) {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count += 1;
  return true;
}

function requireEnv(name: string) {
  const raw = process.env[name];
  if (!raw) throw new Error(`Missing env var: ${name}`);
  const value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}

function normalizeGoogleSheetId(input: string) {
  // Accept either the raw spreadsheet ID (recommended) or a full Sheets URL.
  // Example URL: https://docs.google.com/spreadsheets/d/<ID>/edit?gid=0#gid=0
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match?.[1]) return match[1];
  return input;
}

async function appendToSheet(row: (string | number)[]) {
  const email = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKeyRaw = requireEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const spreadsheetId = normalizeGoogleSheetId(requireEnv("GOOGLE_SHEET_ID"));

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Orders!A1",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toDisplay(value: string) {
  return value.trim() ? value : "-";
}

function toIsoWithOffset(date: Date, offsetMinutes: number) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const offsetMins = String(absMinutes % 60).padStart(2, "0");

  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  const hours = String(shifted.getUTCHours()).padStart(2, "0");
  const minutes = String(shifted.getUTCMinutes()).padStart(2, "0");
  const seconds = String(shifted.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
}

function buildOrderEmailHtml(data: {
  createdAt: string;
  locale: string;
  packId: string;
  quantity: number;
  name: string;
  phone: string;
  address: string;
  utmSource: string;
  utmCampaign: string;
  referrer: string;
}) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Created At", value: data.createdAt },
    { label: "Locale", value: data.locale },
    { label: "Pack", value: data.packId },
    { label: "Quantity", value: String(data.quantity) },
    { label: "Customer Name", value: data.name },
    { label: "Phone", value: data.phone },
    { label: "Address", value: data.address },
    { label: "UTM Source", value: toDisplay(data.utmSource) },
    { label: "UTM Campaign", value: toDisplay(data.utmCampaign) },
    { label: "Referrer", value: toDisplay(data.referrer) },
  ];

  const tableRows = rows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eef2ff; width: 170px; color: #475569; font-size: 13px; font-weight: 600; vertical-align: top;">${escapeHtml(label)}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eef2ff; color: #0f172a; font-size: 14px; line-height: 1.5; vertical-align: top;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="margin: 0; padding: 24px 12px; background: #f8fafc; font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
      <div style="max-width: 700px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden;">
        <div style="padding: 18px 20px; background: linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%); color: #ffffff;">
          <div style="font-size: 12px; font-weight: 600; opacity: 0.9; letter-spacing: 0.04em; text-transform: uppercase;">Remed · New Order</div>
          <div style="margin-top: 6px; font-size: 22px; line-height: 1.2; font-weight: 700;">Order Confirmation</div>
          <div style="margin-top: 6px; font-size: 14px; opacity: 0.95;">Pack ${escapeHtml(data.packId)} × ${escapeHtml(String(data.quantity))}</div>
        </div>

        <div style="padding: 18px 20px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #eef2ff; border-radius: 10px; overflow: hidden;">
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div style="margin-top: 14px; font-size: 12px; color: #64748b;">Generated automatically by Remed landing page.</div>
        </div>
      </div>
    </div>
  `;
}

async function sendEmail({
  text,
  subject,
  html,
}: {
  text: string;
  subject: string;
  html: string;
}) {
  const resendApiKey = requireEnv("RESEND_API_KEY");
  const notifyTo = requireEnv("NOTIFY_EMAIL_TO");
  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "Remed <onboarding@resend.dev>",
    to: notifyTo,
    subject,
    text,
    html,
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimitOk(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateOrderBody(body);
  if (!validation.ok) {
    return Response.json(
      { ok: false, error: validation.error },
      { status: 400 },
    );
  }

  if (validation.isSpam) {
    return Response.json({ ok: true });
  }

  const createdAt = toIsoWithOffset(new Date(), 60);
  const v = validation.value;

  const referrerFromHeader = req.headers.get("referer") || "";
  const referrer = v.referrer || referrerFromHeader;

  const row = [
    createdAt,
    v.locale,
    v.packId,
    v.quantity,
    v.name,
    v.phone,
    v.address,
    v.utmSource,
    v.utmCampaign,
    referrer,
  ];

  try {
    await appendToSheet(row);
  } catch (e) {
    console.error("Failed to append to Google Sheet", e);
    return Response.json(
      { ok: false, error: "Failed to save order" },
      { status: 500 },
    );
  }

  const subject = `New Remed order (${v.packId} x${v.quantity})`;
  const emailText = [
    `createdAt: ${createdAt}`,
    `locale: ${v.locale}`,
    `packId: ${v.packId}`,
    `quantity: ${v.quantity}`,
    "",
    `name: ${v.name}`,
    `phone: ${v.phone}`,
    `address: ${v.address}`,
    "",
    `utmSource: ${v.utmSource || "-"}`,
    `utmCampaign: ${v.utmCampaign || "-"}`,
    `referrer: ${referrer || "-"}`,
  ].join("\n");

  const emailHtml = buildOrderEmailHtml({
    createdAt,
    locale: v.locale,
    packId: v.packId,
    quantity: v.quantity,
    name: v.name,
    phone: v.phone,
    address: v.address,
    utmSource: v.utmSource || "",
    utmCampaign: v.utmCampaign || "",
    referrer: referrer || "",
  });

  try {
    await sendEmail({ text: emailText, subject, html: emailHtml });
  } catch (e) {
    // Do not fail the request if email sending fails.
    console.error("Failed to send Resend email", e);
  }

  return Response.json({ ok: true });
}
