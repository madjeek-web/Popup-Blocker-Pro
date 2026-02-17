# Popup-Blocker-Pro
Popup Blocker Pro : an open source, free, secure and powerful browser extension that blocks attempts to open tabs in the background without user consent. 
By : Fabien Conéjéro

##

Browser Compatibility :

- Chrome (Manifest V3)
- Firefox (Manifest V2/V3)
- Edge
- Opera
- Brave

## 

⚡ Quick Installation :

- Chrome / Edge / Brave / Opera :

1. Unzip popup-blocker-pro-chrome.zip
2. Open chrome://extensions (or edge://extensions, brave://extensions)
3. Enable Developer mode
4. Click on "Load unpacked"
5. Select the unzipped folder

- Firefox :

1. Unzip popup-blocker-pro-firefox.zip
2. Open about:debugging
3. Click on "This Firefox" in the left menu
4. Click on "Load Temporary Add-on"
5. Select the manifest.json file inside the unzipped folder

##

HOW TO INSTALL THE EXTENSION IN CHROME / Edge / Brave / Opera
(Step-by-step instructions with explanations)

STEP 1 : FIND AND DOWNLOAD THE FILE
Go to your GitHub repository : https://github.com/FabienConejero/Popup-Blocker-Pro

Look for the popup-blocker-pro-chrome.zip file in the file list

RIGHT-CLICK on this file (not left-click)

A menu appears

Choose "Save link as..." or "Download the file"

Choose where to save it (example: Desktop or Downloads)

The file will download to your computer

STEP 2 : UNZIP THE FILE (VERY IMPORTANT!)
A ZIP file is like a compressed suitcase. You need to open it to see what's inside.

On Windows :

Go to the folder where you downloaded the file (Downloads or Desktop)

Find popup-blocker-pro-chrome.zip

RIGHT-CLICK on it

In the menu, choose "Extract All..."

A window opens: click on "Extract"

RESULT : A new folder appears, called popup-blocker-pro-chrome (without the .zip at the end)

On Mac :

Simply double-click on the .zip file

It automatically decompresses and creates a folder next to it

⚠️ WARNING: You must KEEP this unzipped folder! Do not delete it after installation, otherwise the extension will stop working.

STEP 3 : OPEN THE EXTENSIONS PAGE IN CHROME
Open Google Chrome (the browser)

In the address bar (at the top, where you type website addresses), type exactly :


chrome://extensions

Press Enter

RESULT : You arrive at a page showing all extensions installed in Chrome.

STEP 4 : ACTIVATE DEVELOPER MODE
Look at the top RIGHT of the chrome://extensions page

You see a switch called "Developer mode"

Click on it to activate it

The switch changes from gray to blue/green

BUTTONS APPEAR at the top left: "Load unpacked," "Pack extension," etc.

STEP 5 : LOAD THE EXTENSION
Click on the "Load unpacked" button (at the top left)

A window opens to choose a folder on your computer

Navigate to the folder you unzipped in STEP 2:

popup-blocker-pro-chrome (the folder, not the ZIP file!)

Select this folder (click on it once to highlight it)

Click on "Select Folder"

STEP 6 : VERIFY THE EXTENSION IS INSTALLED
The extension now appears in the list of extensions on chrome://extensions

Look at the top right of Chrome (near your profile icon)

You should see a new icon 🔒 appear (the Popup Blocker Pro icon)

The extension is enabled by default and works immediately

HOW TO USE THE EXTENSION
Click on the 🔒 icon in the toolbar

A small window opens with:

An ON/OFF switch to enable/disable

The number of blocked popups

An "Options" button to adjust settings

HOW TO UNINSTALL (IF NEEDED)
Go back to chrome://extensions

Find "Popup Blocker Pro" in the list

Click on "Remove" (red button)

Confirm by clicking on "Remove" in the window that opens

- SIMPLE VISUAL SUMMARY :

DOWNLOAD → popup-blocker-pro-chrome.zip

UNZIP → it becomes a FOLDER

CHROME → type chrome://extensions

ACTIVATE → Developer mode (switch at top right)

CLICK → "Load unpacked"

CHOOSE → the unzipped FOLDER

DONE → The icon appears at top right

##

- HOW TO INSTALL THE EXTENSION IN FIREFOX
(Step-by-step instructions with explanations)

STEP 1: FIND AND DOWNLOAD THE FILE
Go to your GitHub repository: https://github.com/FabienConejero/Popup-Blocker-Pro

Look for popup-blocker-pro-firefox.zip in the file list

RIGHT-CLICK on this file (not left-click)

A menu appears

Choose "Save link as..." or "Download file"

Choose where to save it (example: Desktop or Downloads)

The file downloads to your computer

STEP 2 : UNZIP THE FILE (VERY IMPORTANT!)
A ZIP file is like a compressed suitcase. You need to open it to see what's inside.

On Windows:

Go to the folder where you downloaded the file (Downloads or Desktop)

Find popup-blocker-pro-firefox.zip

RIGHT-CLICK on it

In the menu, choose "Extract All..."

A window opens: click on "Extract"

RESULT : A new folder appears, called popup-blocker-pro-firefox (without .zip)

On Mac :

Simply double-click on the .zip file

It automatically decompresses and creates a folder next to it

⚠️ WARNING: You must KEEP this folder! Do not delete it after installation, otherwise the extension will stop working.

STEP 3 : OPEN THE FIREFOX DEBUGGING PAGE
Open Firefox (the browser)

In the address bar (at the top, where you type website addresses), type exactly :


about:debugging
Press Enter

RESULT : You arrive at the Firefox debugging page

STEP 4 : CLICK ON "THIS FIREFOX"
Look at the left side menu of the about:debugging page

Click on "This Firefox"

RESULT : A page opens showing temporary extensions

STEP 5 : LOAD THE EXTENSION (DIFFERENT FROM CHROME!)
Click on the button "Load Temporary Add-on" (under "Temporary Extensions")

A window opens to choose a file on your computer

Navigate to the folder you unzipped in STEP 2:

popup-blocker-pro-firefox (the folder)

Open this folder (double-click on it)

INSIDE the folder, find and select the file named manifest.json

(Important: In Firefox, you select the manifest.json file, not the folder!)

Click on "Open" or "Select File"

STEP 6 : VERIFY THE EXTENSION IS INSTALLED
The extension now appears in the "Temporary Extensions" list

Look at the top right of Firefox (near the menu icon ☰)

You should see a new icon 🔒 appear (the Popup Blocker Pro icon)

The extension is enabled and works immediately

HOW TO USE THE EXTENSION
Click on the 🔒 icon in the toolbar

A small window opens with :

An ON/OFF switch to enable/disable

The number of blocked popups

An "Options" button to adjust settings

⚠️ IMPORTANT NOTE FOR FIREFOX
Temporary extensions (loaded via about:debugging) only last for the current Firefox session. If you close and reopen Firefox, you'll need to load it again.

For permanent installation, you'll need to submit the extension to Mozilla Add-ons store (or use Firefox Developer Edition for permanent unsigned extensions).

HOW TO UNINSTALL (IF NEEDED)
Go back to about:debugging → "This Firefox"

Find "Popup Blocker Pro" in the "Temporary Extensions" list

Click on "Remove" (button on the right)

SIMPLE VISUAL SUMMARY :

1. DOWNLOAD → popup-blocker-pro-firefox.zip
2. UNZIP → it becomes a FOLDER
3. FIREFOX → type about:debugging
4. CLICK → "This Firefox" (left menu)
5. CLICK → "Load Temporary Add-on"
6. CHOOSE → manifest.json file INSIDE the folder
7. DONE → The icon 🔒 appears at top right

- KEY DIFFERENCE FROM CHROME :
Browser	What to select
Chrome/Edge/Brave	Select the whole FOLDER
Firefox	Select the manifest.json FILE inside the folder


##

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
Core Features :
Detection and blocking of popup/window opening attempts:

window.open() without user interaction

Links with target="_blank" using scripts

Redirects via JavaScript

Iframes attempting to open windows

User Interface :
Toolbar icon

Control popup with:

ON/OFF switch

Block counter

Quick access to settings

Options page with:

Whitelist (authorized sites)

Protection levels (basic/strict)

Visual notifications

Security :
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
For Users :
Download from GitHub Releases

Step-by-step instructions for each browser:

Chrome/Edge/Brave: Developer mode → Load unpacked extension

Firefox : about:debugging → Load Temporary Add-on

For Developers :
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
