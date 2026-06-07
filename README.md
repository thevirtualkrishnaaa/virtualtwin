# 🧠 Virtual Twin — Saikrishna Jella's Interactive Portfolio
 
> A personal portfolio with a built-in AI Virtual Twin — a conversational agent trained on my professional history, academic background, and career goals. Ask it anything a recruiter would.
 
**[🔗 Live Demo → thevirtualkrishnaaa.github.io/virtualtwin](https://thevirtualkrishnaaa.github.io/virtualtwin)**
 
---
 
## What Is This?
 
This is my professional portfolio and personal showcase project, built entirely with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.
 
The standout feature is the **Virtual Twin**: an in-browser conversational agent preloaded with a domain-specific knowledge base covering my work experience, MSc coursework, analytical projects, skills, and job search. Recruiters and collaborators can interact with it directly on the page.
 
---
 
## Features
 
- **Virtual Twin Chat** — Knowledge-base-driven conversational agent answering recruiter questions about my background, with typing indicators and quick-question chips
- **Clean Minimal Design** — Professional layout built for LinkedIn sharing and recruiter visits; no gimmicks, no jargon
- **Fully Responsive** — Works on mobile, tablet, and desktop
- **Zero Dependencies** — Single HTML file; deploys instantly to GitHub Pages with no build step
- **Interactive Sections** — Experience timeline, skills grid, project cards, education, certifications, and a contact form
- **Formspree-ready Contact Form** — Drop in your Formspree ID and it works
---
 
## Tech Stack
 
| Layer | Choice | Why |
|---|---|---|
| Markup | HTML5 | Single-file simplicity |
| Styling | Vanilla CSS (custom properties) | No framework overhead |
| Logic | Vanilla JavaScript | Zero bundle size |
| Font | Inter via Google Fonts | Clean, professional |
| Hosting | GitHub Pages | Free, instant, reliable |
| Contact Form | Formspree | No backend needed |
 
---
 
## Project Structure
 
```
virtualtwin/
├── index.html        ← Full portfolio (all HTML, CSS, JS in one file)
├── README.md         ← This file
└── assets/
    ├── photo.jpg     ← Profile photo (add yours here)
    └── cv.pdf        ← Your CV/resume (add yours here)
```
 
---
 
## How to Customise
 
### 1. Add your profile photo
Replace the `SJ` initials placeholder in `index.html`:
```html
<!-- Find this: -->
SJ
 
<!-- Replace with: -->
<img src="assets/photo.jpg" alt="Saikrishna Jella">
```
 
### 2. Link your CV
Search for `YOUR_CV_LINK_HERE` (appears twice) and replace with:
- A direct link to your PDF in this repo: `assets/cv.pdf`
- Or a Google Drive / OneDrive shareable link
### 3. Activate the contact form
1. Sign up free at [formspree.io](https://formspree.io)
2. Create a new form and copy your form ID
3. In `index.html`, find:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
4. Replace `YOUR_FORM_ID` with your actual ID
### 4. Extend the Virtual Twin knowledge base
In `index.html`, find the `KB` array in the `<script>` section. Add new entries:
```js
{
    keys: ['your', 'trigger', 'words'],
    r: "Your response text here."
}
```
 
---
 
## Deployment (GitHub Pages)
 
This repo is already configured to deploy via GitHub Pages. Any push to `main` updates the live site automatically.
 
To deploy from scratch:
```bash
git clone https://github.com/thevirtualkrishnaaa/virtualtwin.git
cd virtualtwin
# Replace files with your updated versions
git add .
git commit -m "Update portfolio"
git push origin main
```
 
---
 
## About the Virtual Twin Concept
 
The Virtual Twin is a pattern I designed to let recruiters and collaborators get honest, grounded answers about my background without requiring a live conversation. It uses a keyword-matched knowledge base (not a language model API) — this means it works with zero cost, zero latency, and no API keys required.
 
The knowledge base covers: work experience, academic modules, analytical projects, SQL & Excel skills, GenAI workflows, certifications, and career objectives.
 
---
 
## Contact
 
- **Email:** saikrishnajella09@gmail.com
- **LinkedIn:** [linkedin.com/in/saikrishnajella09](https://linkedin.com/in/saikrishnajella09)
- **Location:** London, UK — open to roles in London and remotely
---
 
*Built by Saikrishna Jella · 2026 · Vanilla HTML/CSS/JS · Hosted on GitHub Pages*
