/**
 * Popup Blocker Pro - Popup Script
 * Manages the toolbar popup UI.
 */

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const toggleEnabled  = document.getElementById('toggle-enabled');
const statusBanner   = document.getElementById('status-banner');
const statusText     = document.getElementById('status-text');
const statSession    = document.getElementById('stat-session');
const statTab        = document.getElementById('stat-tab');
const statTotal      = document.getElementById('stat-total');
const currentSite    = document.getElementById('current-site');
const btnWhitelist   = document.getElementById('btn-whitelist');
const pillBasic      = document.getElementById('pill-basic');
const pillStrict     = document.getElementById('pill-strict');
const levelHint      = document.getElementById('level-hint');
const btnOptions     = document.getElementById('btn-options');
const extVersion     = document.getElementById('ext-version');

const LEVEL_HINTS = {
  basic:  'Blocks obvious script popups. Recommended for general use.',
  strict: 'Blocks all non-user-initiated new tabs & windows.',
};

// ─── State ────────────────────────────────────────────────────────────────────

let settings = {};
let currentHostname = '';
let currentTabId = null;

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  // Extension version.
  const manifest = chrome.runtime.getManifest();
  extVersion.textContent = `v${manifest.version}`;

  // Load settings.
  settings = await sendMessage({ type: 'GET_SETTINGS' });

  // Get active tab info.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabId = tab?.id ?? null;

  try {
    currentHostname = new URL(tab?.url || '').hostname || '—';
  } catch {
    currentHostname = '—';
  }
  currentSite.textContent = currentHostname;

  // Tab stats.
  const tabStats = await sendMessage({ type: 'GET_TAB_STATS' });

  // Render UI.
  renderToggle(settings.enabled);
  renderStats(settings.sessionBlocked, tabStats?.tabBlocked ?? 0, settings.totalBlocked);
  renderLevel(settings.protectionLevel);
  renderWhitelistButton(settings.whitelist);
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderToggle(enabled) {
  toggleEnabled.checked = enabled;
  statusBanner.classList.toggle('disabled', !enabled);
  statusText.textContent = enabled ? 'Protection Active' : 'Protection Disabled';
}

function renderStats(session, tab, total) {
  statSession.textContent = formatCount(session);
  statTab.textContent     = formatCount(tab);
  statTotal.textContent   = formatCount(total);
}

function renderLevel(level) {
  pillBasic.classList.toggle('active', level === 'basic');
  pillStrict.classList.toggle('active', level === 'strict');
  levelHint.textContent = LEVEL_HINTS[level] || '';
}

function renderWhitelistButton(whitelist) {
  const listed = isWhitelisted(currentHostname, whitelist);
  btnWhitelist.textContent = listed ? '✓ Allowed' : 'Allow site';
  btnWhitelist.classList.toggle('btn-whitelisted', listed);
  btnWhitelist.disabled = currentHostname === '—';
}

function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
  return String(n || 0);
}

function isWhitelisted(hostname, whitelist) {
  return (whitelist || []).some(
    (entry) => hostname === entry || hostname.endsWith(`.${entry}`)
  );
}

// ─── Event handlers ───────────────────────────────────────────────────────────

toggleEnabled.addEventListener('change', async () => {
  settings.enabled = toggleEnabled.checked;
  await saveSettings({ enabled: settings.enabled });
  renderToggle(settings.enabled);
  broadcastSettingsUpdate();
});

pillBasic.addEventListener('click', () => setLevel('basic'));
pillStrict.addEventListener('click', () => setLevel('strict'));

async function setLevel(level) {
  settings.protectionLevel = level;
  await saveSettings({ protectionLevel: level });
  renderLevel(level);
  broadcastSettingsUpdate();
}

btnWhitelist.addEventListener('click', async () => {
  if (!currentHostname || currentHostname === '—') return;

  const whitelist = settings.whitelist || [];
  const idx = whitelist.indexOf(currentHostname);

  if (idx === -1) {
    whitelist.push(currentHostname);
  } else {
    whitelist.splice(idx, 1);
  }

  settings.whitelist = whitelist;
  await saveSettings({ whitelist });
  renderWhitelistButton(whitelist);
  broadcastSettingsUpdate();
});

btnOptions.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sendMessage(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) { resolve(null); return; }
      resolve(response);
    });
  });
}

function saveSettings(patch) {
  return new Promise((resolve) => {
    chrome.storage.local.set(patch, resolve);
  });
}

/** Notify all content scripts in the current tab about settings changes. */
function broadcastSettingsUpdate() {
  if (!currentTabId) return;
  chrome.tabs.sendMessage(currentTabId, {
    type: 'SETTINGS_UPDATED',
    settings,
  }).catch(() => { /* ignore if content script not ready */ });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

init().catch(console.error);
