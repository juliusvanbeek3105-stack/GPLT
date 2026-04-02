# WAR WATCH — Geopolitical Intelligence Terminal

A real-time geopolitical intelligence dashboard with a rotating 3D globe, live AI analysis powered by Claude, streaming deep-dive reports, watchlist, alerts, and market impact tracking.

---

## What it does

- **Rotating globe** — countries color-coded by conflict status (red = active conflict, amber = tension, green = ally). Drag to rotate.
- **Clickable hotspot markers** — click any conflict zone to open a streaming JP Morgan-style deep-dive brief.
- **Live analysis** — fetches real news via web search and generates structured intelligence reports with risk ratings and confidence scores.
- **Stock ticker** — defense stocks and commodities with live simulated price drift.
- **Watchlist** — track your own tickers with geopolitical exposure flags.
- **Alert system** — detects escalations between analysis runs and stores them.
- **History** — past briefings stored in localStorage.
- **PDF export** — print/save any briefing.

---

## Quick Start (Local)

**Prerequisites:** Node.js 18 or higher, an Anthropic API key

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Add your Anthropic API key to .env
#    Open .env and replace: ANTHROPIC_API_KEY=sk-ant-your-key-here

# 4. Start the server
npm start

# 5. Open your browser
#    http://localhost:3000
```

Get your Anthropic API key at: https://console.anthropic.com

---

## Deploy to Render (Free — Recommended)

Render gives you a free hosted URL in about 5 minutes.

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/warwatch.git
   git push -u origin main
   ```

2. **Create Render account** at https://render.com (free)

3. **New Web Service** → Connect your GitHub repo

4. **Settings:**
   - Name: `warwatch-terminal` (or anything you like)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

5. **Add Environment Variable:**
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from https://console.anthropic.com

6. **Deploy** → Render gives you a URL like `https://warwatch-terminal.onrender.com`

> **Note:** Free Render instances sleep after 15 minutes of inactivity. First load after sleep takes ~30 seconds. Upgrade to paid ($7/mo) to keep it always-on.

---

## Deploy to Railway

1. Install Railway CLI: `npm install -g railway`
2. ```bash
   railway login
   railway init
   railway up
   railway variables set ANTHROPIC_API_KEY=sk-ant-your-key-here
   railway open
   ```

---

## Deploy to Vercel (Serverless)

Vercel works but requires converting server.js to serverless functions. Render or Railway are simpler for this app.

---

## How to Use

| Action | How |
|--------|-----|
| Run analysis | Click **Run Analysis** button (top right) or press **Space** |
| Change focus | Click focus buttons on the globe (Global / Energy / Trade / Defense / EM) |
| Deep dive | Click any orange hotspot marker on the globe |
| Filter intel | Click any country on the globe |
| Clear filter | Click **Clear** (bottom right of globe) |
| Add to watchlist | Go to Watchlist tab → type ticker → Add |
| View alerts | Click the dot button or Alerts tab |
| Export PDF | Click the download button (⬇) |
| Rotate globe | Click and drag |

---

## Project Structure

```
warwatch/
├── server.js          # Express server — proxies Anthropic API
├── package.json       # Dependencies
├── render.yaml        # One-click Render deployment
├── .env.example       # Environment variable template
├── .gitignore
└── public/
    └── index.html     # Full terminal frontend (globe, UI, all logic)
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key from console.anthropic.com |
| `PORT` | No | Server port (default: 3000) |

---

## Tech Stack

- **Backend:** Node.js + Express (minimal, no extra dependencies)
- **Frontend:** Vanilla JS + D3.js + TopoJSON (no framework)
- **AI:** Claude claude-sonnet-4-20250514 with web search tool
- **Globe:** D3 geo-orthographic projection + world-atlas TopoJSON

---

## API Cost Estimate

Each **Run Analysis** call uses approximately 800–1,200 output tokens with web search.
Each **Deep Analysis** streaming call uses approximately 600–800 output tokens.

At current Claude claude-sonnet-4-20250514 pricing, running 10 analyses per day costs roughly $0.10–0.25/day.

---

## Troubleshooting

**Globe is a black sphere with no countries**
→ The world-atlas JSON failed to load from CDN. Check your internet connection. Hotspot markers still work.

**Analysis returns cached data**
→ Your API key may be missing or invalid. Check your `.env` file and restart the server.

**"Cannot find module 'express'"**
→ Run `npm install` first.

**Node version error**
→ Requires Node 18+. Check with `node --version`. Update at https://nodejs.org

---

## License

MIT — build on it freely.
