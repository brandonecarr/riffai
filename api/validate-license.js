// api/validate-license.js
// Validates a RiffAI license key entered by the user in the app.
// GET /api/validate-license?key=RIFF-XXXX-XXXX-XXXX-XXXX
//
// Process:
//   1. Search Stripe customers by metadata: riffai_license = key
//   2. Check if that customer has an active or trialing subscription
//   3. Return { active, plan, email } — no active sub means the license is revoked
//
// License is automatically revoked when:
//   - Subscription is cancelled
//   - Payment fails and subscription moves to past_due / canceled
//   - Customer is deleted in Stripe

const Stripe = require('stripe');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = (req.query.key || '').trim().toUpperCase();
  if (!key) return res.status(400).json({ error: 'key param required' });

  // Basic format check: RIFF-XXXX-XXXX-XXXX-XXXX
  if (!/^RIFF-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) {
    return res.status(200).json({ active: false, plan: 'free', reason: 'invalid_format' });
  }

  const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());

  try {
    // Search Stripe customers by license key in metadata
    const result = await stripe.customers.search({
      query: `metadata['riffai_license']:'${key}'`,
      limit: 1,
    });

    if (!result.data.length) {
      return res.status(200).json({ active: false, plan: 'free', reason: 'not_found' });
    }

    const customer = result.data[0];

    // Check for an active or trialing subscription
    const [activeSubs, trialingSubs] = await Promise.all([
      stripe.subscriptions.list({ customer: customer.id, status: 'active',   limit: 5 }),
      stripe.subscriptions.list({ customer: customer.id, status: 'trialing', limit: 5 }),
    ]);

    const allValid = [...activeSubs.data, ...trialingSubs.data];

    if (!allValid.length) {
      // Customer exists but subscription lapsed / cancelled → license revoked
      return res.status(200).json({
        active: false,
        plan: 'free',
        reason: 'subscription_inactive',
        email: customer.email,
      });
    }

    const sub = allValid[0];

    return res.status(200).json({
      active: true,
      plan: 'pro',
      email: customer.email,
      subscriptionId: sub.id,
      currentPeriodEnd: sub.current_period_end,
      licenseKey: key,
    });
  } catch (err) {
    console.error('validate-license error:', err);
    return res.status(500).json({ error: err.message });
  }
};
