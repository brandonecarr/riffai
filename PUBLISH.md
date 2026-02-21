# RiffAI — How to Publish Updates

Every time you want to push a new version to customers, follow these steps.
The app will auto-detect the update, download it silently, and prompt users to restart.

---

## One-Time Setup (do this once)

### 1. Create a GitHub account & repository
1. Go to https://github.com and sign in (or create an account).
2. Create a **new repository** named exactly: `riffai-releases`
3. Set it to **Public** (electron-updater needs to read releases without a token).
4. You don't need to add any files — leave it empty.

### 2. Create a GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name like "RiffAI Publisher"
4. Check the **`repo`** scope (full control of private repositories)
5. Click **Generate token** and **copy it immediately** (you won't see it again)

### 3. Set the token in your environment
Open Terminal and run (replace the token with yours):

```bash
echo 'export GH_TOKEN="ghp_yourTokenHere"' >> ~/.zprofile
source ~/.zprofile
```

To verify it's set: `echo $GH_TOKEN`

---

## Every Release: Step-by-Step

### Step 1 — Bump the version number
In `package.json`, update the `"version"` field:
```json
"version": "1.0.1"   ← change this each release
```

Use this pattern:
- Bug fixes: `1.0.0` → `1.0.1`
- New features: `1.0.0` → `1.1.0`
- Major changes: `1.0.0` → `2.0.0`

### Step 2 — Build and publish (Mac)
Open Terminal in the RiffAI project folder and run:

```bash
npm run release
```

This will:
- Build the `.dmg` for Mac
- Upload it to GitHub Releases automatically
- Create a draft release that gets published immediately

For Windows (run from `~/riffai-winbuild` after copying the project there — see `BUILD-WINDOWS-FROM-MAC.command`):
```bash
GH_TOKEN=your_token npm run release:win
```

### Step 3 — Done!
Customers' apps will silently check for updates every 4 hours and also on launch.
When the new version is found, they'll see a notification in the bottom-right corner of the app:

- **"Update available"** — downloading in background (auto-dismisses after 5 seconds)
- **"Downloading update…"** — shows progress %
- **"Update ready to install"** — gives them "Restart Now" or "Later" buttons

If they click **Later**, the update installs automatically next time they quit the app.

---

## Quick Reference

| What you want to do | Command |
|---|---|
| Build Mac DMG (no publish) | `npm run build` |
| Build Windows EXE (no publish) | `npm run build:win` |
| Build + publish Mac update | `npm run release` |
| Build + publish Windows update | `npm run release:win` |
| Build + publish both | `npm run release:all` |

---

## Viewing Your Releases
Your published releases will appear at:
`https://github.com/brandonecarr/riffai-releases/releases`

You can add release notes there so customers know what changed.

---

## Troubleshooting

**"GH_TOKEN is not set" error** — Run `source ~/.zprofile` or restart Terminal, then try again.

**Mac says "app is damaged"** — The app needs to be code-signed with an Apple Developer account ($99/year) for Gatekeeper to trust it fully. For now, customers can right-click → Open to bypass the warning on first launch.

**Windows SmartScreen warning** — Same situation: an EV Code Signing certificate removes this. Until then, customers click "More info" → "Run anyway".

**Update not showing for customers** — Make sure the version number in `package.json` was actually bumped before publishing. The updater compares version numbers.
