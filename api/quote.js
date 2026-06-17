// api/quote.js — Vercel serverless function (Node 18+, zero dependencies)
//
// Receives quote-form submissions, runs four spam gates, and emails clean
// leads via Resend. The destination address lives ONLY in env vars, so it
// never appears in page source and cannot be scraped.
//
// Required env vars (set per Vercel project):
//   RESEND_API_KEY  - Resend API key (re_...)
//   QUOTE_FROM      - verified sender, e.g. "Knoxville Land Clearing <quotes@knoxvillelandclearing.com>"
//   QUOTE_TO        - comma-separated recipients, e.g. "ben@sevengensystems.com,operations@bushbusters.com"
// Optional:
//   SITE_NAME       - label used in the email subject (default "Website")
//   MIN_FILL_MS     - min ms between page load and submit (default 3000)
//
// Drop-in reusable: identical across sites, behavior set entirely by env.

const RATE = new Map(); // best-effort per-warm-instance IP throttle
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Content lures from the observed attack (graph.org / USDC "balance" / wallet spam)
const BLOCK_PATTERNS = [
  /graph\.org/i,
  /\bUSDC?\b/i,
  /\bBALANCE\b/i,
  /\b0x[a-fA-F0-9]{40}\b/,                 // ETH wallet
  /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/, // BTC wallet
  /t\.me\//i,
  /\b(crypto|airdrop|withdraw|wallet seed|private key)\b/i,
  /[Ѐ-ӿ]{4,}/,                   // long Cyrillic runs
];
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  return (Array.isArray(xff) ? xff[0] : (xff || "")).split(",")[0].trim() || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const hits = (RATE.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  RATE.set(ip, hits);
  if (RATE.size > 5000) RATE.clear(); // crude memory cap
  return hits.length > MAX_PER_WINDOW;
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise((resolve) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => resolve(d));
    req.on("error", () => resolve(""));
  });
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return Object.fromEntries(new URLSearchParams(raw));
  }
}

const esc = (s) =>
  String(s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const minFill = Number(process.env.MIN_FILL_MS || 3000);
  const body = await readBody(req);
  const {
    name = "",
    phone = "",
    email = "",
    property_size = "",
    service = "",
    message = "",
    _company = "", // honeypot — must stay empty
    _elapsed = "", // ms since page load — set by client JS
  } = body;

  // Gate 1 — honeypot
  if (String(_company).trim() !== "") {
    return res.status(200).json({ ok: true }); // silent drop
  }

  // Gate 2 — timing trap (bots POST instantly / skip the JS that sets _elapsed)
  const elapsed = Number(_elapsed);
  if (!Number.isFinite(elapsed) || elapsed < minFill || elapsed > 60 * 60 * 1000) {
    return res.status(200).json({ ok: true }); // silent drop
  }

  // Gate 3 — per-IP rate limit
  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ ok: false, error: "Too many requests" });
  }

  // Gate 4 — content heuristics
  const blob = [name, phone, email, property_size, service, message].join(" \n ");
  if (BLOCK_PATTERNS.some((re) => re.test(blob)) || EMOJI.test(name)) {
    return res.status(200).json({ ok: true }); // silent drop
  }

  // Minimal validity for a real lead
  if (!String(name).trim() || !String(phone).trim()) {
    return res.status(400).json({ ok: false, error: "Name and phone are required." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM;
  const to = (process.env.QUOTE_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  const site = process.env.SITE_NAME || "Website";
  if (!apiKey || !from || !to.length) {
    console.error("quote.js misconfigured: missing RESEND_API_KEY / QUOTE_FROM / QUOTE_TO");
    return res.status(500).json({ ok: false, error: "Server not configured." });
  }

  const html = `
    <h2>New Quote Request — ${esc(site)}</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">
      <tr><td><b>Name</b></td><td>${esc(name)}</td></tr>
      <tr><td><b>Phone</b></td><td>${esc(phone)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(email)}</td></tr>
      <tr><td><b>Property size</b></td><td>${esc(property_size)}</td></tr>
      <tr><td><b>Service</b></td><td>${esc(service)}</td></tr>
      <tr><td valign="top"><b>Message</b></td><td>${esc(message).replace(/\n/g, "<br>")}</td></tr>
    </table>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: String(email).trim() || undefined,
        subject: `New Quote Request — ${site}`,
        html,
      }),
    });
    if (!r.ok) {
      console.error("Resend error", r.status, await r.text());
      return res.status(502).json({ ok: false, error: "Could not send. Please call us." });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("quote.js send failure", e);
    return res.status(502).json({ ok: false, error: "Could not send. Please call us." });
  }
}
