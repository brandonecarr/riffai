#!/bin/bash
# ─────────────────────────────────────────────────────────────────────
# RiffAI — Stripe + Vercel Setup Script
# Double-click this file to run it.
# It will:
#   1. Create the $19/month Stripe price (if it doesn't exist)
#   2. Log you into Vercel (browser opens once)
#   3. Set all required environment variables on your Vercel project
#
# Keys are read from .stripe-keys (next to this file, gitignored).
# ─────────────────────────────────────────────────────────────────────

set -e
cd "$(dirname "$0")"

# Load keys from local file (never committed to git)
KEYS_FILE="$(dirname "$0")/.stripe-keys"
if [ ! -f "$KEYS_FILE" ]; then
  echo ""
  echo "❌  Missing .stripe-keys file."
  echo ""
  echo "  Create a file called .stripe-keys next to this script"
  echo "  with the following contents (fill in your values):"
  echo ""
  echo "  STRIPE_SECRET=sk_live_..."
  echo "  STRIPE_PUB=pk_live_..."
  echo "  STRIPE_WEBHOOK_SECRET=whsec_..."
  echo "  PRODUCT_ID=prod_..."
  echo ""
  read -p "Press Enter to close..."
  exit 1
fi
source "$KEYS_FILE"

echo ""
echo "════════════════════════════════════════════"
echo "  RiffAI — Stripe + Vercel Setup"
echo "════════════════════════════════════════════"
echo ""

# ── Step 1: Find or create the Stripe price ──────────────────────────
echo "▶ Step 1: Looking up Stripe price for product $PRODUCT_ID..."

EXISTING_PRICE=$(curl -s "https://api.stripe.com/v1/prices?product=${PRODUCT_ID}&active=true&limit=1" \
  -u "${STRIPE_SECRET}:" | python3 -c "
import sys, json
data = json.load(sys.stdin)
prices = data.get('data', [])
if prices:
    print(prices[0]['id'])
")

if [ -n "$EXISTING_PRICE" ]; then
  PRICE_ID="$EXISTING_PRICE"
  echo "  ✅ Found existing price: $PRICE_ID"
else
  echo "  ℹ️  No price found — creating \$19/month price..."
  PRICE_RESPONSE=$(curl -s "https://api.stripe.com/v1/prices" \
    -u "${STRIPE_SECRET}:" \
    -d "unit_amount=1900" \
    -d "currency=usd" \
    -d "recurring[interval]=month" \
    -d "product=${PRODUCT_ID}" \
    -d "nickname=RiffAI Pro Monthly")
  PRICE_ID=$(echo "$PRICE_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
  echo "  ✅ Created price: $PRICE_ID"
fi

echo ""

# ── Step 2: Install / check Vercel CLI ───────────────────────────────
echo "▶ Step 2: Checking Vercel CLI..."
if ! command -v vercel &>/dev/null; then
  echo "  Installing Vercel CLI..."
  npm install -g vercel
fi
echo "  ✅ Vercel CLI ready"
echo ""

# ── Step 3: Login to Vercel ──────────────────────────────────────────
echo "▶ Step 3: Logging into Vercel (browser will open)..."
vercel whoami &>/dev/null || vercel login
echo "  ✅ Logged in"
echo ""

# ── Step 4: Link project (if needed) ─────────────────────────────────
echo "▶ Step 4: Linking to Vercel project..."
if [ ! -f ".vercel/project.json" ]; then
  vercel link --yes 2>/dev/null || vercel link
fi
echo "  ✅ Project linked"
echo ""

# ── Step 5: Set environment variables ────────────────────────────────
echo "▶ Step 5: Setting environment variables on Vercel..."

set_env() {
  local NAME="$1"
  local VALUE="$2"
  echo "  Setting $NAME..."
  printf "%s" "$VALUE" | vercel env add "$NAME" production --force 2>/dev/null || \
  printf "%s" "$VALUE" | vercel env add "$NAME" production
}

set_env "STRIPE_SECRET_KEY"        "$STRIPE_SECRET"
set_env "STRIPE_PUBLISHABLE_KEY"   "$STRIPE_PUB"
set_env "STRIPE_PRO_PRICE_ID"      "$PRICE_ID"
set_env "STRIPE_WEBHOOK_SECRET"    "$STRIPE_WEBHOOK_SECRET"

echo ""
echo "  ✅ All environment variables set"
echo ""

# ── Step 6: Redeploy ─────────────────────────────────────────────────
echo "▶ Step 6: Triggering Vercel redeploy..."
vercel --prod --yes 2>/dev/null || echo "  (deploy may already be running from git push)"
echo ""

echo "════════════════════════════════════════════"
echo "  ✅ Setup complete!"
echo ""
echo "  Price ID: $PRICE_ID"
echo ""
echo "  Your Stripe checkout is live."
echo "════════════════════════════════════════════"
echo ""
read -p "Press Enter to close..."
