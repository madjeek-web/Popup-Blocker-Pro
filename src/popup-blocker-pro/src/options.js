/**
 * Popup Blocker Pro - Options Page Script
 */

const LEVEL_DESCRIPTIONS = {
  basic:  '🛡 Basic — Blocks obvious script-opened popups (window.open without user gesture). Recommended for most users.',
  strict: '🔒 Strict — Blocks all programmatically opened tabs and windows, including script-triggered target="_blank" links.',
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const optEnabled       = document.getElementById('opt-enabled');
const optNotifications = document.getElementById('opt-notifications');
const optLevelBasic    = document.getElementById('opt-level-basic');
const optLevelStrict   = document.getElementById('opt-level-strict');
const optLevelDesc     = document.getElementById('opt-level-desc');
const whitelistInput   = document.getElementById('whitelist-input');
const whitelistAdd     = document.getElementById('whitelist-add');
const whitelistTags    = document.getElementById('whitelist-tags');
const optStatSession   = document.getElementById('opt-stat-session');
const optStatTotal     = document.getElementById('opt-stat-total');
const resetStats       = document.getElementById('reset-stats');
const toast            = document.getElementById('toast');

// ─── Load & Render ────────────────────────────────────────────────────────────

async function load() {
  const s = await storageGet();
  optEnabled.checked       = s.enabled ?? true;
  optNotifications.checked = s.showNotifications ?? true;
  setLevel(s.protectionLevel || 'strict');
  renderWhitelist(s.whitelist || []);
  optStatSession.textContent = s.sessionBlocked || 0;
  optStatTotal.textContent   = s.totalBlocked || 0;
}

function setLevel(level) {
  optLevelBasic.classList.toggle('active', level === 'basic');
  optLevelStrict.classList.toggle('active', level === 'strict');
  optLevelDesc.textContent = LEVEL_DESCRIPTIONS[level] || '';
}

function renderWhitelist(list) {
  whitelistTags.innerHTML = '';
  list.forEach((hostname) => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${hostname} <button class="tag-remove" data-host="${hostname}" aria-label="Remove ${hostname}">×</button>`;
    whitelistTags.appendChild(tag);
  });
}

// ─── Save helper ──────────────────────────────────────────────────────────────

async function save(patch) {
  await storageSet(patch);
  showToast();
  broadcastUpdate();
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

async function broadcastUpdate() {
  const settings = await storageGet();
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    try {
      chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED', settings });
    } catch { /* ignore */ }
  }
}

// ─── Event Listeners ─────────────────────────────────────────────────────────

optEnabled.addEventListener('change', () => save({ enabled: optEnabled.checked }));
optNotifications.addEventListener('change', () => save({ showNotifications: optNotifications.checked }));

optLevelBasic.addEventListener('click', async () => {
  setLevel('basic');
  await save({ protectionLevel: 'basic' });
});
optLevelStrict.addEventListener('click', async () => {
  setLevel('strict');
  await save({ protectionLevel: 'strict' });
});

// Whitelist: Add
async function addToWhitelist() {
  const raw = whitelistInput.value.trim().toLowerCase();
  if (!raw) return;

  // Sanitize: strip protocols, paths, etc.
  let hostname = raw.replace(/^https?:\/\//i, '').split('/')[0];

  const s = await storageGet();
  const list = s.whitelist || [];
  if (list.includes(hostname)) {
    whitelistInput.value = '';
    return;
  }
  list.push(hostname);
  renderWhitelist(list);
  whitelistInput.value = '';
  await save({ whitelist: list });
}

whitelistAdd.addEventListener('click', addToWhitelist);
whitelistInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addToWhitelist(); });

// Whitelist: Remove (event delegation)
whitelistTags.addEventListener('click', async (e) => {
  const btn = e.target.closest('.tag-remove');
  if (!btn) return;

  const host = btn.dataset.host;
  const s = await storageGet();
  const list = (s.whitelist || []).filter((h) => h !== host);
  renderWhitelist(list);
  await save({ whitelist: list });
});

// Reset stats
resetStats.addEventListener('click', async () => {
  if (!confirm('Reset all statistics? This cannot be undone.')) return;
  await storageSet({ totalBlocked: 0, sessionBlocked: 0 });
  optStatSession.textContent = 0;
  optStatTotal.textContent   = 0;
  showToast();
});

// ─── Storage wrappers ─────────────────────────────────────────────────────────

function storageGet() {
  return new Promise((resolve) => chrome.storage.local.get(null, resolve));
}

function storageSet(data) {
  return new Promise((resolve) => chrome.storage.local.set(data, resolve));
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

load().catch(console.error);
