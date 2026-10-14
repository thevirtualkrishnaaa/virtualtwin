# Saikrishna Jella — Portfolio with VirtualKrishna

A dashboard-style portfolio for **Saikrishna Jella**, with **VirtualKrishna**: an AI chat that answers questions about his experience, projects and skills in the first person, using only facts from his CV.

🔗 **Live site:** https://thevirtualkrishnaaa.github.io/virtualtwin/ (design only, see [Live vs. local](#live-vs-local))

---

## Features

- **Dashboard layout:** a top bar, KPI tiles, and panel-based sections for a clean, data-led look.
- **Experience timeline** with filters for Data, Operations and Sales.
- **Project showcase:** Tallio (a self-built billing and BI SaaS), VirtualTwin (this site), and Alpha District.
- **VirtualKrishna chat:** asks questions about the candidate, with suggestion chips for common queries.
- **Responsive:** the chat is docked on the side on desktop and becomes a floating button on mobile.

---

## Tech stack

| Layer | Choice |
|---|---|
| Markup & styling | HTML5, CSS custom properties, Inter, Syne and JetBrains Mono fonts |
| Frontend | Vanilla JavaScript (no framework or build step) |
| Backend | Node.js + Express |
| AI | Google Gemini API (`gemini-2.5-flash` by default), called from the server |
| Rate limiting | `express-rate-limit`: 15 requests per 15 minutes per IP |

---

## Quick start

You need [Node.js](https://nodejs.org) (version 18 or later) and a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

```bash
git clone https://github.com/thevirtualkrishnaaa/virtualtwin.git
cd virtualtwin
npm install
```

Create a `.env` file in the project root:

```bash
echo "GEMINI_API_KEY=your-key-here" > .env
```

Then start the server:

```bash
npm start
```

Open **http://localhost:3000**.

---

## Configuration

Settings live in `.env` (copy from `.env.example`):

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | — | Your Gemini API key. Keep it secret. |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Which Gemini model answers chats |
| `PORT` | No | `3000` | Port for the local server |

---

## Customising the content

- **Facts the chatbot uses:** edit the `SYSTEM_PROMPT` in `server.js`. The bot only answers from what's written there, so keep it accurate and up to date.
- **Page content:** edit `index.html`. Experience, projects, skills and education are each a separate section.
- **Styling:** colours and fonts are CSS variables at the top of `styles.css`.

---

## Live vs. local

GitHub Pages only serves static files, so it **cannot run the Node/Express server**. That means:

- The design and content are visible on the live link.
- The **VirtualKrishna chat only works when the server is running**, because it needs `server.js` and your private API key.

---

## Project structure

```
virtualtwin/
├── index.html        ← Page markup and chat widget
├── styles.css        ← All styling (dashboard layout, chat, responsive rules)
├── script.js         ← Experience filters and chat widget logic
├── server.js         ← Express server; sends chat requests to Gemini
├── package.json      ← Dependencies and start script
├── .env.example      ← Template for environment variables
└── assets/           ← Images and documents
```

---

## Security notes

- The Gemini API key lives only in your local `.env` file, which is git-ignored. It's never sent to the browser.
- Chat requests go through `server.js`, which:
  - limits each message to 500 characters,
  - keeps only the most recent conversation turns,
  - rate-limits each visitor's IP address.
- Set a monthly spending limit or quota in your Google Cloud / AI Studio account to avoid unexpected costs.

---

## Contact

- Email: saikrishnajella09@gmail.com
- LinkedIn: [linkedin.com/in/saikrishnajella09](https://linkedin.com/in/saikrishnajella09)
- GitHub: [github.com/thevirtualkrishnaaa](https://github.com/thevirtualkrishnaaa)
