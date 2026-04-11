# Happiest Health — L1 Support Chatbot

AI-powered first-contact resolution assistant for the Happiest Health PMS
(ERPNext Healthcare) platform, built for the Happiest Minds L1 Support team.

## Live Site
https://antarjaala.github.io/l1-support-chatbot/

## Architecture
Browser — React + Vite (GitHub Pages)
↓
Cloudflare Worker — hh-l1-proxy.shivaprasadsk.workers.dev
(CORS proxy — routes to LLM based on x-provider header)
↓
Groq API (llama-3.3-70b-versatile) — Free
OR
Anthropic API (claude-haiku-4-5-20251001) — Pay per token

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | CSS Modules |
| AI Proxy | Cloudflare Worker (free tier) |
| LLM Free | Groq / Llama 3.3 70B (14,400 req/day free) |
| LLM Paid | Anthropic Claude Haiku (~$1/M input tokens) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (auto deploy on push to main) |

## Features
- Live AI chat trained on Happiest Health SOPs and knowledge base
- Switchable AI provider — Groq (free) or Anthropic Claude (paid)
- Quick query dropdown for top 7 common L1 issues
- SLA reference panel (P1–P4) always visible in sidebar
- Scenario Drill mode for new agent onboarding and training
- API key stored in browser localStorage — no backend or database needed

## Escalation Chain (encoded in AI system prompt)
| Order | Name | Role |
|-------|------|------|
| 1st | M Vishnu | L2 Support BA — first contact for all PMS issues |
| 2nd | Soundarya Angadi | PMS L2 Specialist |
| 3rd | Shivaprasad | L2 Manager |
| 4th | Aditya Narayan Sahoo | L2 Support Developer (code-level issues) |

## Knowledge Base Coverage
System prompt in `src/constants.js` covers:
- Login & Access (Zscaler, Session Defaults, URL)
- Patient Registration and Appointment Booking
- Billing, Invoicing and Razorpay payment handling
- Therapy Sessions and Patient Encounters
- Reports and data exports
- SLA matrix (P1–P4) and escalation contacts

## Project Structure
src/
App.jsx           Main UI — provider switcher, chat, sidebar
App.module.css    All component styles
api.js            LLM API call via Cloudflare Worker
constants.js      System prompt, quick queries, drill scenarios
index.css         Global reset and variables
main.jsx          React entry point
worker/
index.js          Cloudflare Worker CORS proxy source
.github/workflows/
deploy.yml        GitHub Actions — build and deploy to Pages

## Local Development
```bash
npm install
npm run dev        # Dev server at localhost:5173
npm run build      # Production build
```

## Deployment
Push to `main` triggers GitHub Actions which builds and deploys automatically.
GitHub Pages source must be set to **GitHub Actions** under Settings → Pages.

## API Keys
No environment variables needed. Each user enters their API key in the
chatbot sidebar. Keys are stored in browser localStorage only and never
sent to any server except the selected LLM provider via the Cloudflare Worker.

## Cost Estimate
| Provider | Cost | Daily Limit |
|----------|------|-------------|
| Groq (Llama) | Free forever | 14,400 requests/day |
| Anthropic Haiku | ~₹300–500/month for L1 team of 10 | No hard limit |
| New Anthropic accounts | $5 free credit (no card needed) | — |
