# Happiest Health L1 Support Chatbot

AI-powered first-contact support assistant for the Happiest Health PMS (ERPNext Healthcare) platform.

## Overview
This chatbot helps Happiest Minds L1 support agents resolve live calls from Happiest Health clinic staff in real time. It provides structured responses in the format: **Likely Cause → Step-by-Step Actions → Escalate If**.

## Architecture
Browser (React + Vite)
↓
Cloudflare Worker (CORS proxy)
↓
Groq API (Llama 3.3 70B) — free tier
OR
Anthropic API (Claude Haiku) — paid

## Tech Stack
- **Frontend:** React 18 + Vite 5, CSS Modules
- **AI Proxy:** Cloudflare Worker (hh-l1-proxy.shivaprasadsk.workers.dev)
- **LLM Options:** Groq (Llama 3.3 70B) — free | Anthropic Claude Haiku — paid
- **Hosting:** GitHub Pages (auto-deploy via GitHub Actions)

## Features
- Live chat with AI trained on Happiest Health SOPs
- Supports both Groq (free) and Anthropic (paid) APIs
- Scenario Drill mode for agent training
- Quick query shortcuts for top 7 common issues
- SLA reference panel (P1–P4)
- Escalation chain: M Vishnu → Soundarya Angadi → Shivaprasad

## Live Site
https://antarjaala.github.io/l1-support-chatbot/

## Setup
```bash
npm install
npm run dev        # local development
npm run build      # production build
```

## Environment
No environment variables needed. API key is entered by the user in the browser sidebar and stored in localStorage.

## Cloudflare Worker
The Worker at `worker/index.js` acts as a CORS proxy routing requests to either Groq or Anthropic based on the `x-provider` header.

## Knowledge Base
The AI system prompt is in `src/constants.js` and covers:
- Login & Access issues
- Patient Registration
- Appointments
- Billing & Invoicing (including Razorpay)
- Therapy Sessions & Encounters
- Reports
- SLA matrix and escalation contacts
