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
- Title: Business Analyst, currently pursuing MSc International Business Management
- Location: London, UK
- Contact: saikrishnajella09@gmail.com, 07823 694370, linkedin.com/in/saikrishnajella09

SUMMARY
Analytical MSc International Business Management student with practical experience supporting business decisions through data analysis, structured reporting, and market research. Skilled in gathering requirements, documenting processes, benchmarking competitors, and translating complex datasets into recommendations for senior stakeholders. Experienced with Excel analytics, PowerPoint reporting, foundational SQL, and GenAI tools.

CORE SKILLS
- Business Analysis: requirements gathering, process documentation, stakeholder engagement, business case support, user journey mapping
- Data Analysis & Reporting: Excel (Pivot Tables, VLOOKUP, XLOOKUP, charts), KPI tracking, performance reporting, data cleaning/validation
- Querying & Databases: SQL (foundational) — basic queries, filtering, joins
- Research & Insight: market research, competitor benchmarking, due diligence, trend analysis
- Communication: translating complex info for non-technical audiences, structured reporting, cross-team coordination
- Tools: Excel, PowerPoint, Word, Power BI (foundational), SQL (foundational), Google Workspace, ChatGPT/GenAI tools

EXPERIENCE
1. Business Development Associate, Intellogi Technologies Pvt Ltd, India (Jan 2024 – Jul 2025)
   - Gathered business requirements and analysed client/market data across 10+ accounts
   - Produced structured reports and presentations for internal teams and clients
   - Conducted competitor benchmarking, due diligence, and market research
   - Built lead generation datasets and trackers, contributing to a 15% uplift in qualified prospects
   - Translated complex datasets into clear outputs for senior stakeholders
   - Coordinated end-to-end deal support and documented workflows

2. Crew Member – Operational Support, McDonald's, Enfield, UK (Oct 2025 – Present)
   - Operates in a high-volume environment serving 200+ customers daily
   - Supports compliance and service targets; collaborates within a team of 15+

PROJECTS
1. Alpha District (MSc coursework) — Business plan and pitch deck for a Gen Z gymwear startup: market analysis, competitor audit, financial modelling, digital marketing strategy. Used AI/prompt engineering to automate research.
2. Fin-Copilot (personal project) — Concept tool to generate insights from financial spreadsheets using Excel and AI, focused on visualisation and decision support.

EDUCATION
- MSc International Business Management, University of East London (Sep 2025 – Present). Modules: Global Marketing & AI/Digital Networks, Organisational Behaviour, Global Leadership & International People Management, Entrepreneurship & New Venture Creation.
- B.Tech Electronics & Communication Engineering, India (Oct 2020 – Aug 2023).

CERTIFICATIONS
- Excel Data Analysis (Pivot Tables, VLOOKUP, XLOOKUP) — LinkedIn Learning
- Data-Driven Decision Making for Business Strategy — LinkedIn Learning
- Strategy Consulting Job Simulation — Forage
- GenAI Portfolio & Skill Certification — GrowthSchool

LANGUAGES
English (fluent), Telugu (native), Hindi (fluent)`;

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
