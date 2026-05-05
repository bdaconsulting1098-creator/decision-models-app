# Mental Models Decision Advisor 🧠

A web app that uses mental models from Notion to help with everyday decisions.

## Two Modes

### 🖥️ Local Mode (No API Key Needed)
Uses your local OpenClaw gateway for LLM inference.

```bash
# Just run:
node dev.js
# Open http://localhost:3456
```

That's it. No API keys, no configuration. Just make sure OpenClaw is running.

### ☁️ Vercel Deployment (Free, Using OpenRouter)
Deploy to the cloud with free LLM via [OpenRouter](https://openrouter.ai).

**Setup:**
1. Get a free API key at https://openrouter.ai (sign up with GitHub)
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy:
```bash
vercel
```
4. Set environment variables in Vercel Dashboard:
   - `NOTION_TOKEN` — your Notion integration token
   - `OPENROUTER_API_KEY` — your OpenRouter key (sk-or-v1-xxx)

**That's it!** The app will use `google/gemini-2.0-flash-001` (free) by default.

## Data Sources
- **20 Kahneman Models** — from "Thinking, Fast and Slow" (Notion database)
- **100 Munger Models** — from "Charlie Munger's 100 Mental Models" (Notion page)

## Features
- 💡 **Decision Advisor** — describe a scenario, get AI analysis with matched mental models
- 📚 **Model Library** — browse, search, and filter all 120 models
- 🔍 **Smart Matching** — keyword-based model matching + LLM analysis
- 🎨 **Dark glass UI** — React 18 + Tailwind CSS

## Environment Variables

| Variable | Local | Vercel | Description |
|---|---|---|---|
| `NOTION_TOKEN` | Auto | Required | Notion API token |
| `OPENROUTER_API_KEY` | — | Required | OpenRouter free key |
| `OPENAI_API_KEY` | — | Optional | If you prefer OpenAI |
| `OPENAI_BASE_URL` | — | Optional | Custom OpenAI-compatible endpoint |
| `LLM_MODEL` | — | Optional | Override model (default: gemini-2.0-flash-001) |
