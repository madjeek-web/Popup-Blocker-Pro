# Architecture — Popup Blocker Pro

## Overview

Popup Blocker Pro uses a **dual-layer defense** architecture: a content script intercepts popup attempts at the JavaScript level, while a background service worker provides a secondary network-level catch.

```
Browser Tab
│
├── content.js  ← injected at document_start (before page JS)
│   ├── Overrides window.open() — non-configurable, non-writable
│   ├── Detects user gesture via navigator.userActivation
│   ├── Intercepts synthetic target="_blank" clicks
│   └── Shows in-page notification on block
│
└── background.js  ← service worker (MV3) / background page (MV2)
    ├── webNavigation.onCreatedNavigationTarget — catches tab opens
    ├── Manages per-tab counters + toolbar badge
    ├── Handles GET_SETTINGS / POPUP_BLOCKED messages
    └── Centralizes storage (chrome.storage.local)
```

## Detection Flow

```
window.open() called by page script
         │
         ▼
Is extension enabled?  ──No──► Allow (native open)
         │ Yes
         ▼
Is page whitelisted?   ──Yes──► Allow (native open)
         │ No
         ▼
navigator.userActivation.isActive?  ──True──► Allow
         │ False
         ▼
Date.now() - lastInteraction < 1000ms?  ──True──► Allow
         │ False
         ▼
         BLOCK → return null
         ├── sendMessage(POPUP_BLOCKED) → background
         └── showBlockNotification()
```

## Communication

| Message Type       | Direction              | Payload                        |
|--------------------|------------------------|--------------------------------|
| `GET_SETTINGS`     | content → background   | —                              |
| `POPUP_BLOCKED`    | content → background   | `{ url, count }`               |
| `SETTINGS_UPDATED` | background → content   | `{ enabled, protectionLevel, whitelist }` |

## Key Security Decisions

| Decision | Reason |
|----------|--------|
| `window.open` patched with `configurable: false` | Prevents pages from restoring the native function |
| `navigator.userActivation` preferred over event tracking | Native browser API, more reliable and harder to spoof |
| `all_frames: true` in manifest | Applies the same protection inside iframes |
| No external network requests | Zero data exfiltration risk |
| Minimal permissions (`storage`, `webNavigation`, `tabs`) | Principle of least privilege |

## File Map

```
src/popup-blocker-pro/src/
├── manifest.json           # Chrome/Edge/Brave/Opera (MV3)
├── manifest.firefox.json   # Firefox (MV2)
├── content.js              # Primary defense (injected into pages)
├── background.js           # Secondary defense + state management
├── popup.html / .js / .css # Toolbar popup UI
├── options.html / .js      # Settings page
└── icons/                  # Extension icons (16, 32, 48, 128px)
```
