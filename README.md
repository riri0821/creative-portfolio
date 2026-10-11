# NSO Portfolio OS

A developer portfolio themed after Needy Streamer Overload: a pastel 90s desktop with draggable
`.exe` windows, plus a plain one-page "Normal View" for phones and anyone who prefers scrolling.

All copy is lorem ipsum and every photo/avatar slot is intentionally blank. All art is original
CSS/SVG pixel art; no game assets are used.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where to edit things

| What | File |
| --- | --- |
| Name, handle, intro lines, links, stats, projects, posts, chat lines | `lib/content.ts` |
| Portrait photo | put it in `public/` and set `profile.portrait` in `lib/content.ts` |
| Resume | put `resume.pdf` in `public/` and set `links.resume = "/resume.pdf"` |
| Colors and fonts | `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx` |
| Pixel icons | `components/PixelIcon.tsx` (16x16 character grids) |
| Window positions/sizes | `computeLayout` in `components/Desktop.tsx` |

## How it behaves

- **Boot screen** (desktop browsers): `ENTER DESKTOP` or `NORMAL VIEW`. The choice is saved in
  localStorage. Start menu has `Switch View`; `Shut Down` clears the choice and returns here.
- Reduced motion turned on: goes straight to Normal View. Slow connections skip the boot animation.
- **Phones (< 768px)**: 1-second "Now Loading..." splash, then Normal View with a sticky Task
  Manager header and a bottom tab bar. Resizing a desktop browser below 768px switches live.
- **Desktop**: double-click icons (single tap on touch) to open windows. Drag by the title bar,
  double-click the title bar to maximize. Taskbar tabs focus/minimize. Speaker icon toggles click
  sounds (synthesized, on by default).
- **Contact form** posts to `app/api/superchat/route.ts`, which emails each message to you through
  [Resend](https://resend.com). In Vercel, open the project's Settings, then Environment Variables, and add:
  - `RESEND_API_KEY`: an API key from resend.com (free plan)
  - `CONTACT_TO_EMAIL`: the email you signed up to Resend with (the shared sender can only deliver there)

  Then redeploy. Replying to a message email replies to the visitor. Without these variables the form
  only logs in development and shows a "not set up yet" error in production. To also store messages in
  Supabase, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` and create:

```sql
create table contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  topic text,
  created_at timestamptz default now()
);
```

## Stack

Next.js (App Router), Tailwind CSS, Framer Motion (drag + animation), Zustand (window state).
