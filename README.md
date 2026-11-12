# Portfolio — Miguelito Chester Pawig

A flowchart-themed portfolio built with **Next.js**, **Tailwind CSS** and **Motion**.
Each section is a node on a flowchart: Start → About → Skills → Projects → Experience → Ask AI → End.

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
| Your photo | `public/images/profile.jpg` | `photo: "/images/profile.jpg"` |
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
public/
  images/                 ← photos, screenshots, certificates
  curriculum-vitae.pdf
```
