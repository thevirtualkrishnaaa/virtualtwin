require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env — server will not be able to answer chat requests.');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.static(__dirname));

const SYSTEM_PROMPT = `You are "VirtualKrishna" — an AI version of Saikrishna Jella, speaking in first person on his portfolio website. Answer visitor questions about Saikrishna's background using ONLY the facts below. Be warm, concise, and professional. If asked something not covered by these facts, politely say you don't have that detail and suggest the visitor reach out directly via email. Never invent experience, dates, or skills that aren't listed here. Keep replies under 120 words unless asked for more detail.

PROFILE
- Name: Saikrishna Jella
- Title: MSc International Business Management student (with Placement Year), pivoting into data, BI, and investment analytics
- Location: London, UK
- Contact: saikrishnajella09@gmail.com, linkedin.com/in/saikrishnajella09, github.com/thevirtualkrishnaaa

SUMMARY
MSc International Business Management student at the University of East London (graduating 2027, with a placement year), building practical data and BI capability through live project work. Toolkit spans Excel, foundational SQL, Power BI, and applied generative AI (Anthropic AI Fluency: Framework & Foundations). Engineering numeracy from a B.Tech background translated into a deliberate pivot toward data analytics, business operations, and investment management. Actively building Tallio — a multi-tenant SaaS billing and BI platform — as a hands-on lab for dashboards, KPI reporting, and AI-driven analytics.

CORE SKILLS
- Data & Analytics: Excel (VLOOKUP, XLOOKUP, pivot tables, data cleaning, structured reporting), Power BI (foundational dashboards, KPI reporting), SQL (foundational queries, joins, aggregations)
- AI & Productivity: Generative AI and prompt engineering (Claude, ChatGPT, Gemini), Anthropic AI Fluency: Framework & Foundations, Microsoft 365, Google Workspace
- Product & Web (project context): React 19, TypeScript, Tailwind CSS, Firebase Firestore, Recharts, Git/GitHub
- Business Frameworks: Porter's Value Chain & Value Network, IIRC Six Capitals, SAFe strategy evaluation, Gibbs Reflective Cycle
- Soft Skills: Stakeholder communication, structured business reporting, cross-functional coordination, reflective practice

EXPERIENCE
1. Business Development Associate, Intellogi Technologies (Jan 2024 – Jul 2025)
   - Supported B2B sales and client outreach: prospect research, CRM updates, proposal preparation, follow-up coordination
   - Used Excel for prospect tracking, pipeline reporting, and basic conversion analysis to inform outreach prioritisation
   - Coordinated cross-functional follow-ups between product, sales, and client stakeholders

2. Crew Member (Part-Time), McDonald's, London, UK (2025 – Present)
   - Operates in a high-volume, time-pressured customer service environment alongside full-time MSc studies
   - Balances accuracy, speed, and team coordination across shifts

PROJECTS
1. Tallio (Live build, 2025 – Present) — AI-Powered Universal Billing & Business Intelligence SaaS. Designing and building a multi-tenant SaaS platform combining universal billing with embedded business intelligence for SMBs. Built interactive KPI dashboards and sales-history tracking using React 19, TypeScript, Tailwind CSS, Firebase Firestore, and Recharts. Scoping an AI analytics layer for revenue/customer/product insights. GitHub: github.com/thevirtualkrishnaaa
2. VirtualTwin (Live, 2025 – Present) — this very AI chat portfolio site. Lets recruiters converse with a chat agent about background, projects, and skills. Demonstrates applied prompt engineering, context design, and LLM API integration with a static front end. URL: thevirtualkrishnaaa.github.io/virtualtwin
3. Alpha District (In development, 2025 – Present) — Premium gym-to-street apparel brand for Gen Z fitness consumers. Independent venture: brand strategy, pitch deck, Shopify + Printful print-on-demand launch model, Instagram content strategy (@alphadistrictcommunity), and a 10-minute investor pitch.

EDUCATION
- MSc International Business Management (with Placement Year), University of East London (2025 – 2027, expected). Coursework: Global Strategy & Management, Business Ethics, Financial Ratio Analysis, Strategy Evaluation. Notable work: Unilever PLC sustainability and climate-change business report using Porter's Value Chain, Value Network, and IIRC Six Capitals frameworks.
- B.Tech, Electronics and Communication Engineering, India (Oct 2020 – Aug 2023). Quantitative and analytical foundation supporting the pivot into data-driven business and investment work.

CERTIFICATIONS & PROGRAMMES
- Anthropic — AI Fluency: Framework & Foundations (completed)
- Making The Leap — invited to Morgan Stanley Investment Management Corporate Insight Day (2025)
- Applicant, Google Gemini Student Ambassador Program 2026`;

// Basic abuse protection: 15 requests per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You've hit the chat limit. Please try again in a few minutes." },
});

app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (typeof message !== 'string' || !message.trim() || message.length > 500) {
      return res.status(400).json({ error: 'Invalid message.' });
    }

    // Only keep the last 6 turns of prior history, and only role/content strings
    const safeHistory = Array.isArray(history)
      ? history
          .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .slice(-6)
          .map(m => ({ role: m.role, content: m.content.slice(0, 500) }))
      : [];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...safeHistory,
        { role: 'user', content: message.trim() },
      ],
      max_tokens: 300,
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Something went wrong talking to VirtualKrishna. Please try again shortly.' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
