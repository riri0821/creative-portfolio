import { NextResponse } from "next/server";

// Contact form endpoint.
// Emails each message through Resend when RESEND_API_KEY and CONTACT_TO_EMAIL are set
// (see README). Also saves to Supabase when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
// With neither configured it only logs, and in production it reports that sending is off.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPIC_LABEL: Record<string, string> = { message: "Message", connect: "Connect", collaborate: "Collaborate" };

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function sendEmail(name: string, email: string, message: string, topic: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return null;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // Resend's shared sender works without owning a domain (it can only deliver to your own account email)
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `[${TOPIC_LABEL[topic]}] New message from ${name}`,
      text: `Topic: ${TOPIC_LABEL[topic]}\nFrom: ${name} <${email}>\n\n${message}`,
      html: `<p><b>Topic:</b> ${TOPIC_LABEL[topic]}<br><b>From:</b> ${escape(name)} &lt;${escape(email)}&gt;</p><p style="white-space:pre-wrap">${escape(message)}</p>`,
    }),
  });
  if (!res.ok) console.error("[contact] resend failed", res.status, await res.text());
  return res.ok;
}

async function saveToSupabase(name: string, email: string, message: string, topic: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, email, message, topic }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().slice(0, 120);
  const message = String(body.message ?? "").trim().slice(0, 1000);
  const topic = ["message", "connect", "collaborate"].includes(String(body.topic)) ? String(body.topic) : "message";

  if (!name || !message || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  // A network error counts as a failed delivery rather than crashing the request
  const attempt = (p: Promise<boolean | null>) =>
    p.catch((err) => {
      console.error("[contact]", err);
      return false;
    });
  const [emailed, saved] = await Promise.all([
    attempt(sendEmail(name, email, message, topic)),
    attempt(saveToSupabase(name, email, message, topic)),
  ]);

  if (emailed === null && saved === null) {
    console.log("[contact]", { name, email, topic, message });
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "The contact form isn't set up yet. Please reach me on LinkedIn." }, { status: 503 });
    }
  } else if (!emailed && !saved) {
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
