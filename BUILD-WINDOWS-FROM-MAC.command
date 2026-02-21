#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  RiffAI — Windows Installer Builder (run from macOS)
#  Double-click this file to cross-compile a Windows .exe
#  installer using electron-builder on your Mac.
#  Output will appear in the dist/ folder when done.
# ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

BOLD="\033[1m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║  RiffAI — Windows Builder (from Mac) ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════╝${RESET}"
echo ""

# ── 1. Check for Node.js ──────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo -e "${RED}  ✗ Node.js is not installed.${RESET}"
  echo ""
  echo "    Please install Node.js from: https://nodejs.org"
  echo ""
  read -p "    Press Enter to open the download page..."
  open "https://nodejs.org"
  exit 1
fi
echo -e "  ${GREEN}✓${RESET} Node.js $(node --version) found"

# ── 2. macOS makensis crashes when the project path has spaces.
#       Copy everything to a safe tmp path and build from there.
BUILD_DIR="$HOME/riffai-winbuild"
echo -e "  ${YELLOW}→${RESET} Copying project to build workspace (no spaces in path)..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
# Copy everything except node_modules and dist (rsync is faster)
rsync -a --exclude='node_modules' --exclude='dist' \
  "$SCRIPT_DIR/" "$BUILD_DIR/"
echo -e "  ${GREEN}✓${RESET} Copied to: $BUILD_DIR"

cd "$BUILD_DIR"

# ── 3. Check disk space ───────────────────────────────────────
AVAIL_KB=$(df -k . | awk 'NR==2 {print $4}')
AVAIL_GB=$(echo "scale=1; $AVAIL_KB/1048576" | bc 2>/dev/null || echo "?")
echo -e "  ${GREEN}✓${RESET} Free disk space: ~${AVAIL_GB} GB (need ~1.5 GB)"

# ── 4. Install dependencies in build workspace ────────────────
echo ""
echo -e "${BOLD}  Step 1/2 — Installing dependencies...${RESET}"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
  echo -e "\n  ${RED}✗ npm install failed. See errors above.${RESET}"
  read -p "  Press Enter to exit..."
  exit 1
fi
echo -e "  ${GREEN}✓${RESET} Dependencies ready"

# ── 5. Build Windows installer ────────────────────────────────
echo ""
echo -e "${BOLD}  Step 2/2 — Building Windows installer...${RESET}"
echo -e "  ${YELLOW}(First run downloads ~120 MB Windows Electron binary)${RESET}"
echo ""

npm run build:win

BUILD_STATUS=$?

echo ""
if [ $BUILD_STATUS -eq 0 ]; then
  # Copy the output .exe back to the original project's dist/ folder
  mkdir -p "$SCRIPT_DIR/dist"
  cp "$BUILD_DIR/dist/"RiffAI-Setup-*.exe "$SCRIPT_DIR/dist/" 2>/dev/null
  EXE=$(ls "$SCRIPT_DIR/dist/"RiffAI-Setup-*.exe 2>/dev/null | head -1)

  echo -e "${GREEN}${BOLD}  ✓ Build complete!${RESET}"
  echo ""
  if [ -n "$EXE" ]; then
    echo -e "  Installer: ${CYAN}${EXE}${RESET}"
  else
    echo -e "  Installer is in: ${CYAN}$BUILD_DIR/dist/${RESET}"
  fi
  echo ""
  echo -e "  ${BOLD}To distribute:${RESET}"
  echo "  • Send the .exe to your Windows users"
  echo "  • They double-click it to install RiffAI"
  echo "  • They may see a SmartScreen warning — click 'More info' → 'Run anyway'"
  echo ""
  # Open the dist folder
  open "$SCRIPT_DIR/dist/" 2>/dev/null || open "$BUILD_DIR/dist/"
else
  echo -e "${RED}${BOLD}  ✗ Build failed.${RESET}"
  echo ""
  echo "  Common fixes:"
  echo "  • Ensure you have internet access (downloads Windows Electron ~120 MB)"
  echo "  • Free up disk space (needs ~1.5 GB total)"
  echo "  • Check errors printed above"
fi

echo ""
read -p "  Press Enter to close..."
