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

L'extension complète, fichier par fichier. 

9 fichiers créésManifest V3 for Chrome/Edge/Brave/Operamanifest.jsonFirefox Manifest V2manifest.firefox.jsonBackground service worker - core blocking logicbackground.jsContent script - primary popup interception layercontent.jsPopup HTML - toolbar interfacepopup.htmlPopup CSS stylespopup.cssPopup JS logicpopup.jsOptions HTML pageoptions.htmlOptions page JSoptions.jsTerminéNow let's generate the icons programmatically:5 fichiers créés, a exécuté une commandeGenerate extension iconsScriptBuild scripts for each browserbuild.jspackage.jsonpackage.jsonMIT LicenseLICENSE.gitignore.gitignoreComplete bilingual READMEREADME.mdTerminéNow let's run the build to verify everything works:Orchestrated successful build completion and output preparationRun build to verifyScriptBuild succeeded. Now let me copy everything to outputs and present the files.TerminéBuild successful! Let's package everything for delivery:A exécuté une commande, lu un fichierCopy final outputsScriptPresented 3 filesTerminéL'extension est complète et prête à l'emploi. Voici un résumé de ce qui a été livré :

📦 3 fichiers livrés
FichierContenupopup-blocker-pro-chrome.zipExtension prête pour Chrome, Edge, Brave, Opera (MV3)popup-blocker-pro-firefox.zipExtension prête pour Firefox (MV2)popup-blocker-pro-source.zipCode source complet avec build scripts

🏗 Architecture implémentée
content.js — Le cœur de la protection, injecté à document_start :

Remplace window.open() de façon non-configurable (les sites ne peuvent pas le restaurer)
Utilise navigator.userActivation (API native Chrome 72+/Firefox 107+) pour détecter les vrais gestes utilisateur
Intercepte les clics synthétiques sur les liens target="_blank"
Affiche une notification discrète en bas à droite

background.js — Couche de défense secondaire :

Intercepte via webNavigation.onCreatedNavigationTarget les popups qui passeraient le content script
Gère le badge avec le compteur par onglet
Centralise les statistiques

Interface — Popup + page Options complètes avec :

Toggle ON/OFF, compteurs session/onglet/global
Bouton "Allow site" (whitelist d'un clic)
Niveaux Basique / Strict
Gestion visuelle de la whitelist

⚡ Installation immédiate (Chrome)

Dézipper popup-blocker-pro-chrome.zip
Ouvrir chrome://extensions
Activer le Mode développeur
Cliquer Charger l'extension non empaquetée → sélectionner le dossier
