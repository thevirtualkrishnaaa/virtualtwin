# 🧠 Virtual Twin — Saikrishna Jella's Interactive Portfolio

> A bold, modern portfolio with **VirtualKrishna** — a real GPT-powered AI chat that answers questions about my background, skills, and projects as if it were me.

---

## What Is This?

A personal portfolio site for Saikrishna Jella, Business Analyst & MSc International Business Management student. It features a bold, editorial design and an AI chat widget (**VirtualKrishna**) backed by the OpenAI API, grounded in my actual CV so it only answers from real facts.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup / Styling | HTML5, vanilla CSS (custom properties), Syne + Inter fonts |
| Frontend Logic | Vanilla JavaScript |
| Backend | Node.js + Express |
| AI | OpenAI API (`gpt-4o-mini`), via a backend proxy so the key is never exposed to the browser |
| Rate Limiting | `express-rate-limit` (15 requests / 15 min per IP) |

---

## ⚠️ Important: Live Demo vs. Local Run

This repo is hosted on **GitHub Pages**, which only serves static files — it **cannot run the Node/Express backend**. That means:

- The portfolio's design, layout, and content are fully visible on the GitHub Pages link.
- The **VirtualKrishna AI chat only works when running the project locally**, since it depends on `server.js` and a private OpenAI API key.

## Running Locally (with AI chat)

```bash
npm install
cp .env.example .env   # then add your own OPENAI_API_KEY
npm start
```

Visit `http://localhost:3000` — the chat widget (bottom-right) will be fully functional.

---

## Project Structure

```
virtualtwin/
├── index.html        ← Portfolio markup + VirtualKrishna chat widget
├── styles.css         ← All styling
├── script.js          ← Frontend interactivity + chat widget logic
├── server.js          ← Express backend, proxies OpenAI chat requests securely
├── package.json
├── .env.example       ← Template for required environment variables
└── assets/
    └── cv.pdf         ← My CV/resume
```

---

## Security Notes

- The OpenAI API key lives only in a local `.env` file — never committed, never sent to the browser.
- All chat requests are proxied through `server.js`, which validates input length, limits conversation history, and rate-limits per IP.
