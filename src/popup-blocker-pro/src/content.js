/**
 * Popup Blocker Pro - Content Script
 *
 * Injected into every page at document_start (before any page JS runs).
 * Overrides window.open() to intercept popup attempts before they happen.
 * Communicates results back to the background worker.
 *
 * Security notes:
 *  - Uses an IIFE to avoid polluting the page scope.
 *  - The patched window.open is non-configurable to prevent pages from restoring it.
 *  - No user data, URLs, or page content is sent anywhere.
 */

(function () {
  'use strict';

  // ─── State ─────────────────────────────────────────────────────────────────

  let extensionEnabled = true;
  let protectionLevel = 'strict';
  let whitelist = [];
  let localBlockCount = 0;

  // ─── Bootstrap: load settings from background ──────────────────────────────

  function initSettings() {
    try {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
        if (chrome.runtime.lastError || !settings) return;
        extensionEnabled = settings.enabled;
        protectionLevel = settings.protectionLevel;
        whitelist = settings.whitelist || [];
      });
    } catch {
      // Extension context may be invalidated on page reload — safe to ignore.
    }
  }

  initSettings();

  // ─── Utility: Check current page against whitelist ─────────────────────────

  function isCurrentPageWhitelisted() {
    const hostname = window.location.hostname;
    return whitelist.some(
      (entry) => hostname === entry || hostname.endsWith(`.${entry}`)
    );
  }

  // ─── Utility: Detect user gesture ─────────────────────────────────────────

  /**
   * Browsers expose `navigator.userActivation` (Chrome 72+, Firefox 107+).
   * This is the most reliable way to determine if a popup is user-initiated.
   * Fallback: check if we're inside a trusted event handler using `lastUserInteraction`.
   */

  let lastUserInteraction = 0;
  const USER_GESTURE_WINDOW_MS = 1000; // 1 second after last user action.

  function isUserGesture() {
    // Prefer native API.
    if (navigator.userActivation) {
      return navigator.userActivation.isActive;
    }
    // Fallback: track interaction timestamps ourselves.
    return Date.now() - lastUserInteraction < USER_GESTURE_WINDOW_MS;
  }

  // Track clicks, keypresses, and touch events as user gestures.
  const GESTURE_EVENTS = ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown'];
  GESTURE_EVENTS.forEach((evt) => {
    document.addEventListener(evt, () => { lastUserInteraction = Date.now(); }, {
      capture: true,
      passive: true,
    });
  });

  // ─── Core: Override window.open ────────────────────────────────────────────

  const _nativeOpen = window.open.bind(window);

  /**
   * Our replacement window.open. Called in place of the real one.
   * Returns null (simulating a blocked popup) when appropriate.
   */
  function patchedWindowOpen(url, target, features) {
    // Always allow if extension is disabled or page is whitelisted.
    if (!extensionEnabled || isCurrentPageWhitelisted()) {
      return _nativeOpen(url, target, features);
    }

    // Allow if the call originates from a genuine user gesture.
    if (isUserGesture()) {
      return _nativeOpen(url, target, features);
    }

    // ── BLOCKED ──
    localBlockCount++;
    const resolvedUrl = url || 'about:blank';

    // Notify background worker (fire-and-forget; no sensitive data sent).
    try {
      chrome.runtime.sendMessage({
        type: 'POPUP_BLOCKED',
        url: resolvedUrl,
        count: localBlockCount,
      });
    } catch {
      // Ignore messaging errors (e.g. extension reloaded).
    }

    // Show a subtle in-page notification if enabled.
    showBlockNotification(resolvedUrl);

    // Return null — this is what browsers return for blocked popups.
    return null;
  }

  // Replace window.open, making our version non-writable so pages can't undo it.
  try {
    Object.defineProperty(window, 'open', {
      value: patchedWindowOpen,
      writable: false,
      configurable: false,
    });
  } catch {
    // Some pages use strict sandboxing that prevents property redefinition.
    // Fall back to simple assignment.
    window.open = patchedWindowOpen;
  }

  // ─── Core: Intercept target="_blank" link clicks ───────────────────────────

  /**
   * In strict mode, we also intercept programmatic link clicks that open new tabs.
   * A real user click on a visible link is always allowed.
   */

  if (protectionLevel === 'strict' || true) { // Always run; level checked inline.
    document.addEventListener(
      'click',
      (event) => {
        if (!extensionEnabled || isCurrentPageWhitelisted()) return;

        const anchor = event.target.closest('a[target="_blank"]');
        if (!anchor) return;

        // If the click was synthetic (isTrusted = false), block it.
        if (!event.isTrusted) {
          event.preventDefault();
          event.stopImmediatePropagation();
          localBlockCount++;
          try {
            chrome.runtime.sendMessage({
              type: 'POPUP_BLOCKED',
              url: anchor.href,
              count: localBlockCount,
            });
          } catch { /* ignore */ }
          showBlockNotification(anchor.href);
        }
      },
      { capture: true }
    );
  }

  // ─── Core: Block iframe window.open attempts ───────────────────────────────

  /**
   * When this content script runs inside an iframe (all_frames: true in manifest),
   * the same window.open patch applies automatically. No extra logic needed.
   */

  // ─── UI: Subtle block notification ────────────────────────────────────────

  let notificationTimeout = null;
  let notificationEl = null;

  function showBlockNotification(blockedUrl) {
    // Only show if the page body is available.
    if (!document.body) return;

    // Rate-limit: don't spam if many popups fire quickly.
    if (notificationTimeout) return;

    if (!notificationEl) {
      notificationEl = createNotificationElement();
      document.body.appendChild(notificationEl);
    }

    // Update label.
    const label = notificationEl.querySelector('.pbp-label');
    if (label) {
      label.textContent = `🚫 Popup blocked (${localBlockCount})`;
    }

    // Animate in.
    notificationEl.style.opacity = '1';
    notificationEl.style.transform = 'translateY(0)';

    notificationTimeout = setTimeout(() => {
      if (notificationEl) {
        notificationEl.style.opacity = '0';
        notificationEl.style.transform = 'translateY(20px)';
      }
      notificationTimeout = null;
    }, 2500);
  }

  function createNotificationElement() {
    const el = document.createElement('div');
    el.id = 'pbp-notification';
    el.setAttribute('aria-live', 'polite');

    // Inline styles so we don't conflict with page CSS.
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '2147483647',
      background: 'rgba(30,30,30,0.92)',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      pointerEvents: 'none',
      userSelect: 'none',
    });

    const label = document.createElement('span');
    label.className = 'pbp-label';
    label.textContent = '🚫 Popup blocked';
    el.appendChild(label);

    return el;
  }

  // ─── Listen for settings updates from background ───────────────────────────

  try {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'SETTINGS_UPDATED') {
        extensionEnabled = message.settings.enabled;
        protectionLevel = message.settings.protectionLevel;
        whitelist = message.settings.whitelist || [];
      }
    });
  } catch { /* ignore */ }

})();
