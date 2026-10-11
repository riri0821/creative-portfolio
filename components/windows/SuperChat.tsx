"use client";

import { useState, type FormEvent } from "react";
import { contact, contactTopics, links } from "@/lib/content";
import { blip } from "@/lib/sound";

type Status = "idle" | "sending" | "sent" | "error";

export default function SuperChat() {
  const [topic, setTopic] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const color = contactTopics[topic].color;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    blip(1200);
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/superchat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          topic: contactTopics[topic].id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="border-2 border-nso-ink px-3 py-2" style={{ background: color }}>
        <p className="font-pixel text-lg text-nso-night">{contact.heading}</p>
        <p className="mt-1 font-body text-sm leading-relaxed text-nso-night">{contact.intro}</p>
      </div>

      <fieldset>
        <legend className="mb-1 text-xs text-nso-rose">What&apos;s this about?</legend>
        <div className="flex flex-wrap gap-1.5">
          {contactTopics.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                blip(600 + i * 120);
                setTopic(i);
              }}
              aria-pressed={topic === i}
              className={`border-2 border-nso-ink px-3 py-0.5 text-xs text-nso-night ${topic === i ? "translate-y-[1px]" : "shadow-[2px_2px_0_#4d21cb]"}`}
              style={{ background: t.color }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <form onSubmit={submit} className="space-y-2">
        <label className="block">
          <span className="text-xs text-nso-rose">Name</span>
          <input name="name" required maxLength={80} className="px-input" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-xs text-nso-rose">Email</span>
          <input name="email" type="email" required maxLength={120} className="px-input" placeholder="youremail@example.com" />
        </label>
        <label className="block">
          <span className="text-xs text-nso-rose">Message</span>
          <textarea name="message" required maxLength={1000} rows={3} className="px-input resize-none" placeholder="Share your thoughts..." />
        </label>
        <button type="submit" disabled={status === "sending"} className="px-btn w-full py-2 text-base disabled:opacity-60">
          {status === "sending" ? "SENDING..." : "SEND"}
        </button>
        <p role="status" className="min-h-[1.25rem] text-center text-xs">
          {status === "sent" && <span className="text-[#2a9d6f]">Thanks! Your message was sent.</span>}
          {status === "error" && <span className="text-[#e0245e]">{error}</span>}
        </p>
      </form>

      <div className="flex flex-wrap gap-2 border-t-2 border-dashed border-nso-lav pt-3">
        <a className="px-btn text-xs" href={links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="px-btn text-xs" href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="px-btn text-xs" href={links.resume} download>
          DOWNLOAD RESUME
        </a>
      </div>
    </div>
  );
}
