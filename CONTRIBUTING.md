# Changelog

All notable changes to Popup Blocker Pro will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- Firefox Add-ons store submission
- Per-site statistics dashboard
- Import/export whitelist as JSON

---

## [1.0.0] — 2025

### Added
- Core popup blocking via `window.open()` override (non-configurable, non-writable)
- User gesture detection using `navigator.userActivation` (Chrome 72+ / Firefox 107+)
- Fallback gesture tracking via click/keydown/touchstart timestamps (1s window)
- Synthetic click interception on `target="_blank"` links (strict mode)
- Iframe support via `all_frames: true` in manifest
- Secondary defense layer: `webNavigation.onCreatedNavigationTarget`
- Extension popup UI: ON/OFF toggle, session/tab/global counters
- One-click "Allow this site" whitelist button in popup
- Options page: whitelist management, protection levels (Basic / Strict)
- Per-tab block counter shown as toolbar badge
- Subtle in-page notification (bottom-right, non-intrusive)
- Manifest V3 build for Chrome / Edge / Brave / Opera
- Manifest V2 build for Firefox
- npm build script for packaging both browsers
- Diagnostic test page (`popup-blocker-pro-test.html`) with 9 scenarios
- Interactive demo page (`Popup-Blocker-Pro_demo.html`) for GitHub Pages
- Complete bilingual documentation (English / French)
- MIT License
- CI/CD with GitHub Actions

---

[Unreleased]: https://github.com/madjeek-web/Popup-Blocker-Pro/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/madjeek-web/Popup-Blocker-Pro/releases/tag/v1.0.0
