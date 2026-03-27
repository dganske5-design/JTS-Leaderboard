# JTS Sales Scoreboard
**Live shared internal scoreboard — Next.js · Supabase · Vercel**

---

## 📁 File Structure

```
jts-scoreboard/
├── pages/
│   ├── _app.js                  App wrapper
│   ├── _document.js             HTML head + fonts
│   ├── index.js                 📊 Scoreboard (public)
│   ├── admin.js                 🔐 Admin panel
│   └── api/
│       ├── reps.js              GET  — fetch all reps
│       ├── stats.js             GET  — fetch stats for date range
│       ├── verify-admin.js      POST — check password
│       └── admin/
│           ├── reps.js          POST/PUT/DELETE — manage reps
│           ├── save-day.js      POST — save a day's stats
│           └── reset-year.js    POST — clear a year's stats
├── components/
│   ├── Nav.js                   Top navigation bar
│   ├── BarChart.js              Animated bar chart
│   ├── Leaderboard.js           Ranked rows
│   └── ScorePanel.js            Full panel (chart + leaderboard)
├── lib/
│   ├── supabase.js              Supabase client
│   └── dateHelpers.js           Date utilities
├── styles/
│   └── globals.css              All global styles + fonts
├── public/
│   └── jts-logo.png             ← PUT YOUR LOGO HERE
├── supabase-setup.sql           ← Run this in Supabase first
├── .env.local.example           ← Copy to .env.local
├── package.json
└── next.config.js
```

---

## STEP 1 — Supabase Setup (5 minutes)

1. Go to **https://supabase.com** → Sign up free → **New Project**
2. Give it a name (e.g. `jts-scoreboard`) and set a database password
3. Wait ~1 minute for setup to complete
4. In the left sidebar click **SQL Editor** → **New Query**
5. Open `supabase-setup.sql` from this folder, copy the entire contents, paste into the editor
6. Click **Run** — you should see "Success"
7. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon / public** key (long string starting with `eyJ...`)

---

## STEP 2 — Environment Variables

Create a file called `.env.local` in the root of this project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=JTS1971!
```

(Copy from `.env.local.example` and fill in your Supabase values.)

---

## STEP 3 — Add Your Logo

1. Take your JTS logo file (PNG works best)
2. Rename it to `jts-logo.png`
3. Drop it into the `/public/` folder
4. Delete `PLACE_LOGO_HERE.txt`

If no logo is added, the nav shows "JTS" text automatically — no crash.

---

## STEP 4 — Test Locally

```bash
# Install dependencies (first time only)
npm install

# Run dev server
npm run dev
```

Open in browser:
- **http://localhost:3000** — Scoreboard
- **http://localhost:3000/admin** — Admin panel (password: `JTS1971!`)

---

## STEP 5 — Deploy to GitHub

1. Create a new repo at **https://github.com** (name it `jts-scoreboard`, set to Private)
2. In the project folder run:

```bash
git init
git add .
git commit -m "Initial JTS Scoreboard"
git remote add origin https://github.com/YOUR_USERNAME/jts-scoreboard.git
git push -u origin main
```

---

## STEP 6 — Deploy to Vercel (Free)

1. Go to **https://vercel.com** → Sign in with GitHub
2. Click **Add New Project** → select your `jts-scoreboard` repo
3. Click **Deploy** (Vercel auto-detects Next.js — no config needed)
4. Once deployed, go to your project → **Settings → Environment Variables**
5. Add these three variables (same as your `.env.local`):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `ADMIN_PASSWORD` | `JTS1971!` |

6. Go to **Deployments** → click the three dots → **Redeploy** (so it picks up env vars)

Your live URL will be something like `https://jts-scoreboard.vercel.app`

---

## STEP 7 — How to Use Day-to-Day

### Entering daily stats:
1. Go to `your-site.vercel.app/admin`
2. Enter password: **JTS1971!**
3. Under **Enter Daily Stats**:
   - Pick the **Year** (dropdown)
   - Pick the **Month** (pill buttons — current month is highlighted with ★)
   - Click any **day on the calendar** to open the editor
   - Enter each rep's **Call Count** and **Talk Time (minutes)**
   - Click **💾 Save Day**
   - The calendar dot updates immediately showing total calls for that day

### Viewing the scoreboard:
- Share `your-site.vercel.app` with the whole team
- Three tabs: **Today** / **This Week** / **This Month**
- Auto-refreshes every 20 seconds
- Bar charts + ranked leaderboard for both Call Count and Talk Time

### Adding / removing reps:
- Admin panel → **Manage Reps** section
- Add, rename, or remove reps at any time
- Removing a rep also removes all their stats

### Resetting a year:
- Admin panel → **Danger Zone** at the bottom
- Select the year, click **Reset Year**, then confirm
- This clears all daily stats for that calendar year permanently

---

## Changing the Admin Password

1. Vercel Dashboard → Your project → **Settings → Environment Variables**
2. Edit `ADMIN_PASSWORD` to your new password
3. Click **Redeploy**

---

## Talk Time Reference

Talk time is entered in **total minutes**:

| Minutes | Displays as |
|---------|-------------|
| 30      | 30m         |
| 60      | 1h 00m      |
| 90      | 1h 30m      |
| 120     | 2h 00m      |
| 150     | 2h 30m      |

---

## ✅ Go-Live Checklist

- [ ] Supabase project created
- [ ] `supabase-setup.sql` executed in SQL Editor
- [ ] `.env.local` created with your Supabase keys
- [ ] `public/jts-logo.png` added
- [ ] `npm install` + `npm run dev` tested locally
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added in Vercel
- [ ] Redeployed on Vercel after adding env vars
- [ ] Admin login tested at `/admin`
- [ ] Scoreboard visible and live at root URL
- [ ] Shared URL with the team

---

*JTS Internal Use Only*
