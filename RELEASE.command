#!/bin/bash
# ── RiffAI Release Script ─────────────────────────────────────────────
# Double-click this file to build and publish a new Mac release to GitHub.
# Reads GH_TOKEN from .stripe-keys so you never have to set it manually.
# ─────────────────────────────────────────────────────────────────────

cd "$(dirname "$0")"

KEYS_FILE=".stripe-keys"
if [ ! -f "$KEYS_FILE" ]; then
  echo "❌  .stripe-keys file not found. Cannot read GH_TOKEN."
  echo "    Add a line: GH_TOKEN=ghp_xxxx  to .stripe-keys"
  read -p "Press Enter to close..."
  exit 1
fi

# Load keys
export $(grep -v '^#' "$KEYS_FILE" | xargs)

if [ -z "$GH_TOKEN" ]; then
  echo "❌  GH_TOKEN not found in .stripe-keys"
  read -p "Press Enter to close..."
  exit 1
fi

echo "✅  GH_TOKEN loaded"
echo ""
echo "📦  Building and publishing RiffAI Mac release..."
echo ""

npm run release

echo ""
if [ $? -eq 0 ]; then
  echo "✅  Release published to GitHub successfully!"
  echo "    https://github.com/brandonecarr/riffai/releases"
else
  echo "❌  Release failed. Check the output above."
fi

echo ""
read -p "Press Enter to close..."
