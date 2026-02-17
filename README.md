# Popup-Blocker-Pro
Popup Blocker Pro : an open source, free, secure and powerful browser extension that blocks attempts to open tabs in the background without user consent. By : Fabien Conéjéro

##

Technical Specifications
Browser Compatibility
Chrome (Manifest V3)

Firefox (Manifest V2/V3)

Edge

Opera

Brave

Project Structure
```
popup-blocker-pro/
├── src/
│   ├── manifest.json (with browser-specific configurations)
│   ├── background.js (service worker)
│   ├── content.js (injected script)
│   ├── popup.html (user interface)
│   ├── popup.css (styles)
│   ├── popup.js (popup logic)
│   ├── options.html (options page)
│   ├── options.js
│   └── icons/
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── docs/
│   └── README.md
├── .gitignore
├── LICENSE (MIT)
└── package.json
```

Required Features
Core Features:
Detection and blocking of popup/window opening attempts:

window.open() without user interaction

Links with target="_blank" using scripts

Redirects via JavaScript

Iframes attempting to open windows

User Interface:
Toolbar icon

Control popup with:

ON/OFF switch

Block counter

Quick access to settings

Options page with:

Whitelist (authorized sites)

Protection levels (basic/strict)

Visual notifications

Security:
No data collection

Minimal required permissions

Auditable and commented code

Automatic updates via GitHub

Development Instructions
Manifest.json Structure:
Permissions: ["storage", "webNavigation", "tabs"]

Host_permissions: ["<all_urls>"] or optional

Persistent background service worker

Detection Algorithm :
```text
javascript :

 // Logic to implement
- Intercept window.open attempts
- Check source (user click vs. script)
- Block if not user-initiated
```
______

Installation from GitHub
Clear instructions in README

Prepared build files

Packaging scripts for each browser

Installation and Packaging
For Users:
Download from GitHub Releases

Step-by-step instructions for each browser:

Chrome/Edge/Brave: Developer mode → Load unpacked extension

Firefox: about:debugging → Load Temporary Add-on

For Developers:
```bash
git clone [your-repo]
npm install
npm run build  # Generates builds for each browser
```

Required Tests
Tests on various websites known for popups

Performance tests (memory/CPU impact)

Cross-browser compatibility tests

Security tests

Documentation to Provide
Complete README.md in English/French

Installation guide

User guide

Privacy policy

MIT License

Expected Deliverables
Complete and commented source code

Ready-to-use builds

User documentation

Automation scripts

Video demo (optional)

Author / Creator: Fabien Conéjero
GitHub Profile


##

##

# 🚫 Popup Blocker Pro

Complete popup blocking extension for Chrome, Firefox, Edge, Brave, and Opera.

## 📦 File Structure

### Complete extension, file by file

| File | Description |
|------|-------------|
| `manifest.json` | Manifest V3 for Chrome/Edge/Brave/Opera |
| `manifest.firefox.json` | Manifest V2 for Firefox |
| `background.js` | Service worker - core blocking logic |
| `content.js` | Content script - primary popup interception |
| `popup.html` | Toolbar popup interface |
| `popup.css` | Popup CSS styles |
| `popup.js` | Popup JavaScript logic |
| `options.html` | Options page |
| `options.js` | Options page script |

### Icon management

| File | Description |
|------|-------------|
| `build.js` | Icon generation script |
| `package.json` | npm configuration and dependencies |
| `LICENSE` | MIT License |
| `.gitignore` | Git ignored files |
| `README.md` | Complete bilingual documentation |

### Installation packages

| File | Description |
|------|-------------|
| `popup-blocker-pro-chrome.zip` | Ready-to-use extension for Chrome, Edge, Brave, Opera (MV3) |
| `popup-blocker-pro-firefox.zip` | Ready-to-use extension for Firefox (MV2) |
| `popup-blocker-pro-source.zip` | Complete source code with build scripts |

## 🏗 Implemented Architecture

### Main components

| File | Role |
|------|------|
| **`content.js`** | Protection core, injected at `document_start`:<br>• Replaces `window.open()` in a non-configurable way<br>• Uses `navigator.userActivation` (native API Chrome 72+/Firefox 107+)<br>• Intercepts synthetic clicks on `target="_blank"` links<br>• Displays a discreet notification at bottom right |
| **`background.js`** | Secondary defense layer:<br>• Intercepts via `webNavigation.onCreatedNavigationTarget`<br>• Manages badge with per-tab counter<br>• Centralizes statistics |
| **Interface** | Popup + Options page:<br>• ON/OFF toggle<br>• Session/tab/global counters<br>• "Allow site" button (one-click whitelist)<br>• Basic / Strict levels<br>• Visual whitelist management |

## ⚡ Quick Installation (Chrome)

1. Unzip `popup-blocker-pro-chrome.zip`
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** → select the folder
