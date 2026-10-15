// ── Experience filters ──────────────────────────────
const filterButtons = document.querySelectorAll('.filters .chip');
const timelineItems = document.querySelectorAll('.tl-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle('is-active', b === btn));
    timelineItems.forEach(item => {
      const tags = (item.dataset.tags || '').split(' ');
      const show = filter === 'all' || tags.includes(filter);
      item.classList.toggle('is-hidden', !show);
    });
  });
});

// ── VirtualKrishna Chat Widget ──────────────────────
const vkLauncher = document.getElementById('vkLauncher');
const vkPanel = document.getElementById('vkPanel');
const vkClose = document.getElementById('vkClose');
const vkMessages = document.getElementById('vkMessages');
const vkInput = document.getElementById('vkInput');
const vkSend = document.getElementById('vkSend');

// Where the chat server lives.
// Local testing uses the same server; the live GitHub Pages site calls the hosted server on Render.
const VK_API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? ''
  : 'https://virtualtwin-chat.onrender.com';

let vkHistory = [];
let vkBusy = false;

function vkOpen() {
  vkPanel.classList.add('open');
  vkInput.focus();
}
function vkCloseChat() {
  vkPanel.classList.remove('open');
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

async function vkSendMessage(overrideText) {
  const text = (overrideText ?? vkInput.value).trim();
  if (!text || vkBusy) return;

  vkBusy = true;
  vkSend.disabled = true;
  vkAddMessage(text, 'user');
  vkInput.value = '';

  const typingEl = vkAddTyping();

  try {
    const res = await fetch(`${VK_API_BASE}/api/chat`, {
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
    vkAddError('Could not reach the server. Check that the chat backend is running.');
  } finally {
    vkBusy = false;
    vkSend.disabled = false;
    vkInput.focus();
  }
}

vkSend.addEventListener('click', () => vkSendMessage());
vkInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') vkSendMessage();
});

// Suggested question chips
document.querySelectorAll('.vk-chip').forEach(chip => {
  chip.addEventListener('click', () => vkSendMessage(chip.dataset.q));
});
