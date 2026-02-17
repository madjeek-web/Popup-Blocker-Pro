#!/usr/bin/env node
/**
 * Popup Blocker Pro - Build Script
 * Generates distributable packages for Chrome, Firefox, Edge, Opera, and Brave.
 *
 * Usage:
 *   npm run build              # Build all
 *   npm run build -- --chrome  # Build Chrome only
 *   npm run build -- --firefox # Build Firefox only
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC  = path.join(__dirname, '../src');
const DIST = path.join(__dirname, '../dist');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function zipDir(sourceDir, outputZip) {
  try {
    execSync(`cd "${path.dirname(sourceDir)}" && zip -r "${outputZip}" "${path.basename(sourceDir)}"`, {
      stdio: 'inherit',
    });
  } catch {
    console.warn('  ⚠  zip not available — skipping archive creation.');
  }
}

// ─── Build targets ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const buildAll     = args.length === 0;
const buildChrome  = buildAll || args.includes('--chrome');
const buildFirefox = buildAll || args.includes('--firefox');

if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
fs.mkdirSync(DIST, { recursive: true });

// ─── Chrome / Edge / Brave / Opera (Manifest V3) ─────────────────────────────

if (buildChrome) {
  console.log('\n📦  Building Chrome / Edge / Brave / Opera (Manifest V3)…');
  const outDir = path.join(DIST, 'chrome');
  copyDir(SRC, outDir);

  // Remove Firefox-specific manifest.
  const ffManifest = path.join(outDir, 'manifest.firefox.json');
  if (fs.existsSync(ffManifest)) fs.unlinkSync(ffManifest);

  // Ensure we're using the MV3 manifest (already the default).
  console.log('  ✔  Copied source files');

  zipDir(outDir, path.join(DIST, 'popup-blocker-pro-chrome.zip'));
  console.log('  ✔  Created popup-blocker-pro-chrome.zip');
}

// ─── Firefox (Manifest V2) ────────────────────────────────────────────────────

if (buildFirefox) {
  console.log('\n🦊  Building Firefox (Manifest V2)…');
  const outDir = path.join(DIST, 'firefox');
  copyDir(SRC, outDir);

  // Replace manifest.json with the Firefox version.
  const ffSrc  = path.join(outDir, 'manifest.firefox.json');
  const mainM  = path.join(outDir, 'manifest.json');
  if (fs.existsSync(ffSrc)) {
    fs.copyFileSync(ffSrc, mainM);
    fs.unlinkSync(ffSrc);
    console.log('  ✔  Applied Firefox manifest');
  }

  // Firefox MV2 uses background scripts array instead of service_worker — already handled in manifest.firefox.json.

  zipDir(outDir, path.join(DIST, 'popup-blocker-pro-firefox.zip'));
  console.log('  ✔  Created popup-blocker-pro-firefox.zip');
}

console.log('\n✅  Build complete! Output in ./dist/\n');
