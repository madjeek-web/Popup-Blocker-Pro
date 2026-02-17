# 🛡 Popup Blocker Pro

> Open source, privacy-first browser extension that silently blocks unwanted popups and background tabs — with zero data collection.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)]()
[![No Data Collected](https://img.shields.io/badge/Data-None%20Collected-green.svg)]()

---

## 🇬🇧 English

### Features

- **Blocks `window.open()`** calls not initiated by a real user click
- **Intercepts script-triggered `target="_blank"` links**
- **Works inside iframes** (all frames intercepted)
- **Whitelist** — allow specific sites with one click
- **Protection levels**: Basic (recommended) and Strict
- **Live badge** showing how many popups were blocked on the current tab
- **Session & all-time statistics**
- **Subtle in-page notifications** (optional, no visual noise)
- **100% open source, no telemetry, no ads**

### Browser Support

| Browser | Manifest | Status |
|---------|----------|--------|
| Chrome  | V3       | ✅ Full support |
| Edge    | V3       | ✅ Full support |
| Brave   | V3       | ✅ Full support |
| Opera   | V3       | ✅ Full support |
| Firefox | V2       | ✅ Full support |

### Installation (User)

#### Chrome / Edge / Brave / Opera

1. Download `popup-blocker-pro-chrome.zip` from [Releases](../../releases)
2. Unzip the file
3. Open `chrome://extensions` (or `edge://extensions`)
4. Enable **Developer mode** (top right toggle)
5. Click **Load unpacked** and select the unzipped folder

#### Firefox

1. Download `popup-blocker-pro-firefox.zip` from [Releases](../../releases)
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on…**
4. Select the `.zip` file (or any file inside the unzipped folder)

> **Note:** For a permanent Firefox installation, the extension needs to be signed via AMO (addons.mozilla.org). For development use, temporary loading works fine.

### Installation (Developer)

```bash
# Clone the repository
git clone https://github.com/your-username/popup-blocker-pro.git
cd popup-blocker-pro

# No runtime dependencies — just Node.js for the build script
npm run build          # Builds both Chrome and Firefox packages

# Or build individually:
npm run build:chrome
npm run build:firefox
```

Then load the appropriate folder from `dist/chrome` or `dist/firefox` in your browser.

### How It Works

```
User visits a page
     │
     ▼
content.js injected at document_start
     │
     ├─ Patches window.open() (non-writable/non-configurable)
     ├─ Tracks real user gestures (click, keydown, touch)
     └─ Intercepts synthetic click events on target="_blank" links
          │
          ▼
      User gesture? ──Yes──► Allow popup / new tab
          │
         No
          │
          ▼
      Site whitelisted? ──Yes──► Allow popup / new tab
          │
         No
          │
          ▼
      BLOCK ──► Notify background.js ──► Update badge & stats
```

Additionally, `background.js` listens on `webNavigation.onCreatedNavigationTarget` to catch any popups that bypass the content script layer (e.g., browser-level API calls from certain extensions or iframes with strict CSP).

### Protection Levels

| Level  | What's blocked |
|--------|---------------|
| Basic  | `window.open()` calls without a user gesture |
| Strict | Everything in Basic + programmatic `target="_blank"` clicks |

### Privacy Policy

Popup Blocker Pro collects **no data whatsoever**:

- No URLs are transmitted
- No browsing history is stored or sent
- No analytics or crash reporting
- Statistics are stored locally in your browser (`chrome.storage.local`) and never leave your device
- The extension has no network calls

### Permissions Explained

| Permission | Reason |
|-----------|--------|
| `storage` | Save your settings and statistics locally |
| `tabs` | Read the current tab URL to display the hostname in the popup |
| `webNavigation` | Intercept programmatically opened tabs at the browser level |
| `<all_urls>` | Inject the content script into all pages to intercept `window.open` |

### Contributing

Pull requests are welcome! Please:

1. Fork the repo and create a feature branch
2. Keep code well-commented
3. Test on at least Chrome and Firefox
4. Open a PR with a description of what changed and why

### License

MIT — see [LICENSE](LICENSE).

---

## 🇫🇷 Français

### Fonctionnalités

- **Bloque `window.open()`** lorsqu'il n'est pas déclenché par un vrai clic utilisateur
- **Intercepte les liens `target="_blank"` scriptés**
- **Fonctionne dans les iframes** (tous les cadres sont protégés)
- **Liste blanche** — autorisez un site en un clic
- **Niveaux de protection** : Basique et Strict
- **Badge en temps réel** indiquant le nombre de popups bloqués sur l'onglet courant
- **Statistiques de session et globales**
- **Notifications discrètes** sur la page (optionnelles)
- **100% open source, aucune télémétrie, aucune publicité**

### Installation (Utilisateur)

#### Chrome / Edge / Brave / Opera

1. Téléchargez `popup-blocker-pro-chrome.zip` depuis les [Releases](../../releases)
2. Décompressez l'archive
3. Ouvrez `chrome://extensions`
4. Activez le **Mode développeur** (interrupteur en haut à droite)
5. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez le dossier décompressé

#### Firefox

1. Téléchargez `popup-blocker-pro-firefox.zip` depuis les [Releases](../../releases)
2. Ouvrez `about:debugging#/runtime/this-firefox`
3. Cliquez sur **Charger un module complémentaire temporaire…**
4. Sélectionnez le fichier `.zip` (ou n'importe quel fichier dans le dossier décompressé)

### Installation (Développeur)

```bash
git clone https://github.com/votre-username/popup-blocker-pro.git
cd popup-blocker-pro
npm run build   # Génère les packages Chrome et Firefox dans dist/
```

### Comment ça fonctionne

Le script `content.js` est injecté dans chaque page **avant** l'exécution de tout JavaScript de la page. Il remplace `window.open()` par une version qui vérifie si l'appel provient d'un vrai geste utilisateur (clic, touche, etc.) via l'API `navigator.userActivation`. Si ce n'est pas le cas, le popup est bloqué et l'extension affiche une notification discrète.

Le service worker `background.js` intercepte également les tentatives d'ouverture d'onglets au niveau du navigateur via `webNavigation.onCreatedNavigationTarget`, assurant une double couche de protection.

### Niveaux de protection

| Niveau | Ce qui est bloqué |
|--------|------------------|
| Basique | Les appels `window.open()` sans geste utilisateur |
| Strict | Tout le Basique + les clics synthétiques sur `target="_blank"` |

### Politique de confidentialité

Popup Blocker Pro ne collecte **aucune donnée** :

- Aucune URL n'est transmise
- Aucun historique de navigation n'est stocké ou envoyé
- Aucune analytique ni rapport de crash
- Les statistiques sont stockées localement dans votre navigateur et ne quittent jamais votre appareil

### Permissions expliquées

| Permission | Raison |
|-----------|--------|
| `storage` | Sauvegarder vos paramètres et statistiques en local |
| `tabs` | Lire l'URL de l'onglet actif pour afficher le domaine dans le popup |
| `webNavigation` | Intercepter les onglets ouverts programmatiquement |
| `<all_urls>` | Injecter le script dans toutes les pages |

### Licence

MIT — voir [LICENSE](LICENSE).
