#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  RiffAI — macOS Builder
#  Double-click this file to build the app.
#  A .dmg installer will appear in the dist/ folder when done.
# ─────────────────────────────────────────────────────────────

# Navigate to the folder containing this script
cd "$(dirname "$0")"

BOLD="\033[1m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║         RiffAI — Mac Builder         ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════╝${RESET}"
echo ""

# ── 1. Check for Node.js ──────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js is not installed.${RESET}"
  echo ""
  echo "  Please download and install Node.js from:"
  echo -e "  ${CYAN}https://nodejs.org${RESET}  (choose the LTS version)"
  echo ""
  echo "  Then double-click this script again."
  echo ""
  read -p "  Press Enter to open the Node.js download page..."
  open "https://nodejs.org"
  exit 1
fi

NODE_VER=$(node --version)
echo -e "  ${GREEN}✓${RESET} Node.js ${NODE_VER} found"

# ── 2. Install / refresh dependencies ────────────────────────
echo ""
echo -e "${BOLD}  Step 1/2 — Installing dependencies...${RESET}"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
  echo -e "\n  ${RED}✗ npm install failed. See errors above.${RESET}"
  read -p "  Press Enter to exit..."
  exit 1
fi
echo -e "  ${GREEN}✓${RESET} Dependencies ready"

# ── 3. Build ─────────────────────────────────────────────────
echo ""
echo -e "${BOLD}  Step 2/2 — Building macOS app (this takes ~1–2 min)...${RESET}"
echo ""

npm run build

BUILD_STATUS=$?

echo ""
if [ $BUILD_STATUS -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  ✓ Build complete!${RESET}"
  echo ""
  echo -e "  Your installer is in:  ${CYAN}dist/RiffAI.dmg${RESET}"
  echo ""
  echo -e "  ${BOLD}Next steps:${RESET}"
  echo "  1. Open the DMG file"
  echo "  2. Drag 'RiffAI' into your Applications folder"
  echo "  3. Eject the DMG"
  echo "  4. Launch RiffAI from Applications or Spotlight"
  echo ""
  echo "  ⚠️  First launch: macOS may warn 'unidentified developer'."
  echo "     Right-click the app → Open → Open to bypass this once."
  echo ""
  # Open the dist folder in Finder
  open dist/
else
  echo -e "${RED}${BOLD}  ✗ Build failed.${RESET}"
  echo ""
  echo "  Common fixes:"
  echo "  • Make sure you have at least 500 MB of free disk space"
  echo "  • Try running: npm install --legacy-peer-deps"
  echo "  • Check the errors printed above"
fi

echo ""
read -p "  Press Enter to close..."
