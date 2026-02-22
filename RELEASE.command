#!/bin/bash
# ── RiffAI Release Script ─────────────────────────────────────────────
# Double-click this file to build and publish a new Mac release to GitHub.
# Automatically bumps the patch version (1.0.0 → 1.0.1 → 1.0.2 …)
# so electron-builder always publishes a new release and users get notified.
# ─────────────────────────────────────────────────────────────────────

cd "$(dirname "$0")"

# ── Load secrets ──────────────────────────────────────────────────────
KEYS_FILE=".stripe-keys"
if [ ! -f "$KEYS_FILE" ]; then
  echo "❌  .stripe-keys not found. Cannot read GH_TOKEN."
  read -p "Press Enter to close..."; exit 1
fi
export $(grep -v '^#' "$KEYS_FILE" | xargs)

if [ -z "$GH_TOKEN" ]; then
  echo "❌  GH_TOKEN not found in .stripe-keys"
  read -p "Press Enter to close..."; exit 1
fi
echo "✅  GH_TOKEN loaded"

# ── Bump patch version in package.json ───────────────────────────────
CURRENT=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
PATCH=$((PATCH + 1))
NEXT="$MAJOR.$MINOR.$PATCH"

node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
  pkg.version = '$NEXT';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
echo "✅  Version bumped: $CURRENT → $NEXT"

# ── Commit the version bump ───────────────────────────────────────────
git add package.json
git commit -m "chore: bump version to $NEXT"
GIT_TERMINAL_PROMPT=0 git push "https://${GH_TOKEN}@github.com/brandonecarr/riffai.git" main
echo "✅  Version committed and pushed"

# ── Build and publish ─────────────────────────────────────────────────
echo ""
echo "📦  Building and publishing RiffAI $NEXT..."
echo ""

npm run release

echo ""
if [ $? -eq 0 ]; then
  echo "✅  Release $NEXT published to GitHub!"
  echo "    https://github.com/brandonecarr/riffai/releases"
  echo ""
  echo "    Users running $CURRENT will be notified to update within 5 seconds of next launch."
else
  echo "❌  Release failed. Check the output above."
fi

echo ""
read -p "Press Enter to close..."
