// Navbar on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNav();
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.ml').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-float').forEach(el => observer.observe(el));

// Hero elements animate on load
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-float').forEach(el => {
    el.classList.add('visible');
  });
});

// ── VirtualKrishna Chat Widget ──────────────────────
const vkLauncher = document.getElementById('vkLauncher');
const vkPanel = document.getElementById('vkPanel');
const vkClose = document.getElementById('vkClose');
const vkMessages = document.getElementById('vkMessages');
const vkInput = document.getElementById('vkInput');
const vkSend = document.getElementById('vkSend');

let vkHistory = [];
let vkBusy = false;

function vkOpen() {
  vkPanel.classList.add('open');
  vkLauncher.classList.add('hidden');
  vkInput.focus();
}
function vkCloseChat() {
  vkPanel.classList.remove('open');
  vkLauncher.classList.remove('hidden');
}

vkLauncher.addEventListener('click', vkOpen);
vkClose.addEventListener('click', vkCloseChat);

function vkAddMessage(text, role) {
  const el = document.createElement('div');
  el.className = `vk-msg vk-msg-${role === 'user' ? 'user' : 'bot'}`;
  el.textContent = text; // textContent avoids HTML injection from model or user input
  vkMessages.appendChild(el);
  vkMessages.scrollTop = vkMessages.scrollHeight;
  return el;
}

function vkAddTyping() {
  const el = document.createElement('div');
  el.className = 'vk-msg-typing';
  el.innerHTML = '<span></span><span></span><span></span>';
  vkMessages.appendChild(el);
  vkMessages.scrollTop = vkMessages.scrollHeight;
  return el;
}

function vkAddError(text) {
  const el = document.createElement('div');
  el.className = 'vk-msg vk-msg-error';
  el.textContent = text;
  vkMessages.appendChild(el);
  vkMessages.scrollTop = vkMessages.scrollHeight;
}

async function vkSendMessage() {
  const text = vkInput.value.trim();
  if (!text || vkBusy) return;

  vkBusy = true;
  vkSend.disabled = true;
  vkAddMessage(text, 'user');
  vkInput.value = '';

  const typingEl = vkAddTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: vkHistory }),
    });

    typingEl.remove();

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      vkAddError(data.error || 'Something went wrong. Please try again.');
      return;
    }

    const data = await res.json();
    vkAddMessage(data.reply, 'bot');
    vkHistory.push({ role: 'user', content: text });
    vkHistory.push({ role: 'assistant', content: data.reply });
    vkHistory = vkHistory.slice(-12);
  } catch (err) {
    typingEl.remove();
    vkAddError('Could not reach the server. Make sure it is running locally.');
  } finally {
    vkBusy = false;
    vkSend.disabled = false;
    vkInput.focus();
  }
}

vkSend.addEventListener('click', vkSendMessage);
vkInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') vkSendMessage();
});
