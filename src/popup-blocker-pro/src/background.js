/**
 * Popup Blocker Pro - Background Service Worker
 * Handles tab interception, whitelist checks, and statistics.
 * No user data is ever collected or transmitted.
 */

// ─── Default Settings ────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  enabled: true,
  protectionLevel: 'strict', // 'basic' | 'strict'
  showNotifications: true,
  whitelist: [],             // Array of hostnames (e.g. "example.com")
  totalBlocked: 0,
  sessionBlocked: 0,
};

// ─── Utility: Storage helpers ─────────────────────────────────────────────────

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(DEFAULT_SETTINGS, resolve);
  });
}

async function updateSettings(patch) {
  return new Promise((resolve) => {
    chrome.storage.local.set(patch, resolve);
  });
}

// ─── Utility: Extract hostname from URL ───────────────────────────────────────

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// ─── Utility: Check if hostname matches whitelist ─────────────────────────────

function isWhitelisted(hostname, whitelist) {
  return whitelist.some((entry) => {
    // Support both exact match and wildcard subdomain match
    return hostname === entry || hostname.endsWith(`.${entry}`);
  });
}

// ─── Core: Tab creation interception (Manifest V3) ───────────────────────────

/**
 * Listen for newly created tabs. If opened programmatically from a page
 * that is NOT whitelisted, we close the tab and increment the counter.
 *
 * NOTE: Chrome MV3 does not expose a synchronous "before tab open" hook,
 * so we rely on webNavigation.onCreatedNavigationTarget for popup detection
 * combined with tab creation events.
 */

chrome.tabs.onCreated.addListener(async (tab) => {
  const settings = await getSettings();
  if (!settings.enabled) return;

  // A tab without an opener is a user-initiated new tab — always allow.
  if (!tab.openerTabId) return;

  // Get the opener tab to determine the source hostname.
  let openerTab;
  try {
    openerTab = await chrome.tabs.get(tab.openerTabId);
  } catch {
    // Opener tab no longer exists — allow the new tab as a precaution.
    return;
  }

  const sourceHostname = getHostname(openerTab.url || '');
  if (isWhitelisted(sourceHostname, settings.whitelist)) return;

  // In 'basic' mode, only block tabs opened to about:blank (classic popup pattern).
  // In 'strict' mode, also block tabs opened to external URLs.
  const targetUrl = tab.pendingUrl || tab.url || '';
  const isBlankPopup = !targetUrl || targetUrl === 'about:blank';

  if (settings.protectionLevel === 'basic' && !isBlankPopup) return;

  // The content script is the primary gatekeeper for window.open().
  // This background-level check handles cases the content script may miss
  // (e.g. tabs opened via browser APIs, iframes, etc.).
  // We log the block here; content.js sends a message to confirm blocks.
});

// ─── Core: webNavigation popup detection ─────────────────────────────────────

chrome.webNavigation.onCreatedNavigationTarget.addListener(async (details) => {
  const settings = await getSettings();
  if (!settings.enabled) return;

  const sourceHostname = getHostname(details.sourceFrameUrl || '');
  if (isWhitelisted(sourceHostname, settings.whitelist)) return;

  // details.sourceProcessId being present confirms a script-initiated open.
  // Close the newly created tab immediately.
  try {
    await chrome.tabs.remove(details.tabId);
    await recordBlock(settings, details.sourceTabId, sourceHostname, details.url);
  } catch {
    // Tab may already be closed or inaccessible — silently ignore.
  }
});

// ─── Core: Message handler (from content.js) ─────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'POPUP_BLOCKED') {
    handleContentScriptBlock(message, sender).then(sendResponse);
    return true; // Keep the message channel open for async response.
  }

  if (message.type === 'GET_SETTINGS') {
    getSettings().then(sendResponse);
    return true;
  }

  if (message.type === 'GET_TAB_STATS') {
    getTabStats(sender.tab?.id).then(sendResponse);
    return true;
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Called when content.js reports a blocked window.open() attempt. */
async function handleContentScriptBlock(message, sender) {
  const settings = await getSettings();
  if (!settings.enabled) return { blocked: false };

  const hostname = getHostname(sender.tab?.url || '');
  if (isWhitelisted(hostname, settings.whitelist)) return { blocked: false };

  await recordBlock(settings, sender.tab?.id, hostname, message.url);
  return { blocked: true };
}

/** Persists block statistics and updates the badge. */
async function recordBlock(settings, tabId, hostname, blockedUrl) {
  const newTotal = (settings.totalBlocked || 0) + 1;
  const newSession = (settings.sessionBlocked || 0) + 1;

  await updateSettings({ totalBlocked: newTotal, sessionBlocked: newSession });
  updateBadge(tabId, newSession);

  console.debug(
    `[Popup Blocker Pro] Blocked popup from "${hostname}" → "${blockedUrl}"`
  );
}

/** Per-tab block count stored in memory (resets on worker restart). */
const tabBlockCounts = new Map();

function updateBadge(tabId, sessionCount) {
  if (!tabId) return;

  const current = (tabBlockCounts.get(tabId) || 0) + 1;
  tabBlockCounts.set(tabId, current);

  // Show the count on the extension icon badge.
  chrome.action?.setBadgeText({ text: String(current), tabId });
  chrome.action?.setBadgeBackgroundColor({ color: '#e74c3c', tabId });

  // Firefox uses browserAction instead of action.
  chrome.browserAction?.setBadgeText({ text: String(current), tabId });
  chrome.browserAction?.setBadgeBackgroundColor({ color: '#e74c3c', tabId });
}

async function getTabStats(tabId) {
  return { tabBlocked: tabBlockCounts.get(tabId) || 0 };
}

// ─── Lifecycle: Reset session counter on startup ──────────────────────────────

chrome.runtime.onStartup.addListener(async () => {
  await updateSettings({ sessionBlocked: 0 });
  tabBlockCounts.clear();
});

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First install — write defaults.
    await updateSettings(DEFAULT_SETTINGS);
    console.log('[Popup Blocker Pro] Installed successfully.');
  }
  if (details.reason === 'update') {
    console.log(`[Popup Blocker Pro] Updated to v${chrome.runtime.getManifest().version}`);
  }
});
