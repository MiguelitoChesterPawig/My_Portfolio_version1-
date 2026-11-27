# Portfolio — Miguelito Chester Pawig

A flowchart-themed portfolio built with **Next.js**, **Tailwind CSS** and **Motion**.
Each section is a node on a flowchart: Start → About → Skills → Projects → Experience → Ask AI → End.

![Portfolio home page](public/images/projects/Portfolio%28Home%29.jpg)

## Highlights

- **AI assistant that only talks about me.** It answers recruiter questions from `src/content/profile.ts`, refuses off-topic or prompt-injection requests, and tries several Gemini models in a row (with Claude as an option). If no AI is available it still answers from the profile offline.
- **Contact form built to resist spam.** Honeypot field, Cloudflare Turnstile captcha, per-field character allow-lists, link validation and HTML escaping. Messages are emailed (Resend) and optionally saved to Supabase.
- **Rate-limited API.** The chat allows 20 questions per visitor per hour, shared across all servers through Upstash Redis, with an in-memory fallback.
- **Fast on phones.** Every picture goes through Next's image optimizer, so a phone downloads a small WebP sized for its screen instead of the original file. Proof videos only download when they are shown.
- **One content file.** All text, projects, skills and certificates live in `profile.ts`; the components only display it.
- **Every feature is optional.** With no keys set, the site still works; the AI, email, captcha and database switch on only when their keys exist.
- **Checked on every push.** GitHub Actions runs lint, a type check and a full production build.

**Built with:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Vercel

---

## 1. Run it on your computer

Open this folder in **VS Code**, open the terminal (`Ctrl + ~`), and run:

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser. Changes you save show up right away.

---

## 2. Edit your info (the main file)

👉 **`src/content/profile.ts`** — all the text on the site comes from this one file.

- Anything inside `[BRACKETS]` is a placeholder. Replace it.
- To remove an item (e.g. an unused project), delete it from the list.
- Skill levels: `1` learning · `2` basic · `3` intermediate · `4` strong

## 3. Replace the images

| What | Where to put it | Then update in profile.ts |
|---|---|---|
| Your photo | `public/images/profile.webp` | `photo: "/images/profile.webp"` |
| Project screenshots | `public/images/projects/` | `images: [...]` |
| TechWorld flowchart / ERD / DFD | `public/images/projects/` | `diagrams: [...]` |
| Certificates | `public/images/certificates/` | `image: "..."` |
| Curriculum Vitae | replace `public/curriculum-vitae.pdf` | `cv: "..."` |

Tip: screenshots look best at **16:9** (e.g. 1280×720). Your photo looks best at **4:5**.

## 4. Change colors

Open `src/app/globals.css` → edit the colors at the top (`--forest`, `--ivory`, `--coral`).

---

## 5. Turn on the extra features (optional)

Copy `.env.example` → rename the copy to **`.env.local`** → paste your keys.

### AI chat
1. Go to console.anthropic.com → **API Keys** → create a key.
2. Add a small credit and set a **monthly spend limit** (e.g. $5).
3. Paste it into `ANTHROPIC_API_KEY`.

The AI only answers from what's in `profile.ts`, so keep that file accurate.

### Shared chat rate limit (recommended on Vercel)
1. Vercel → **Storage → Upstash → Redis** (free) → connect it to this project. The keys are added for you.
2. Or create one at upstash.com and paste the REST URL and token into `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Without it the limit still works, but it resets whenever Vercel starts a new server.

### Contact form emails
1. resend.com → **API Keys** → create a key → paste into `RESEND_API_KEY`.
2. `CONTACT_TO_EMAIL` = the email where you want to receive messages
   (on the free plan without a domain, this must be the email you signed up to Resend with).

### Save messages to a database (Supabase)
1. supabase.com → New project.
2. Open **SQL Editor** → run this:

```sql
create table messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
alter table messages enable row level security;
```

3. **Project Settings → API** → copy the **Project URL** and the **service_role** key into `.env.local`.
   (Keep the service_role key secret — it only runs on the server.)

---

## 6. Put it online (Vercel)

1. Create a new **GitHub** repository and upload this folder:
   ```bash
   git init
   git add .
   git commit -m "first version of my portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
2. vercel.com → **Add New → Project** → import the repo → **Deploy**.
3. In Vercel → **Settings → Environment Variables**, add the same keys from `.env.local`.
   Then redeploy.
4. (Optional) **Settings → Domains** → add your own domain.

---

## 7. Surprise features

- **Personal greeting link:** send `yoursite.com/?for=Accenture` and the page says
  "Good morning, Accenture team 👋".
- **Visitor log** in the hero shows device and local time.
- **Flowchart line** fills in coral as you scroll.
- **AI assistant** answers recruiter questions 24/7.

## File map

```
src/
  content/profile.ts      ← YOUR INFO (edit this)
  app/page.tsx            ← order of sections
  app/globals.css         ← colors
  app/api/chat/route.ts   ← AI chat back-end
  app/api/contact/route.ts← contact form back-end
  components/             ← each section of the page
  lib/optimized.ts        ← resized images for plain <img> tags
scripts/cv/               ← builds the PDF CV (uses scripts/cv/profile.png)
.github/workflows/ci.yml  ← lint + type check + build on every push
public/
  images/                 ← photos, screenshots, certificates
  curriculum-vitae.pdf
```
