import { NextResponse } from "next/server";

// Contact form endpoint.
// For now it validates and logs. To persist to Supabase later, set
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and insert into a `contact_messages` table.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
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
    if (!res.ok) return NextResponse.json({ error: "Could not save your message." }, { status: 502 });
  } else {
    console.log("[contact]", { name, email, topic, message });
  }

  return NextResponse.json({ ok: true });
}
