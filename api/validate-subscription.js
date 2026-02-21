// api/validate-subscription.js
// Checks whether a given email has an active RiffAI Pro subscription in Stripe.
// Called by the Electron app on launch and after the user enters their email.
//
// GET /api/validate-subscription?email=user@example.com
// Returns: { active: true|false, plan: 'pro'|'free', email, customerId? }

const Stripe = require('stripe');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')  return res.status(405).json({ error: 'Method not allowed' });

  const email = (req.query.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'email param required' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Find customers with this email
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (!customers.data.length) {
      return res.status(200).json({ active: false, plan: 'free', email });
    }

    // Check each customer for an active subscription
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 5,
      });

      // Also check trialing subscriptions
      const trialing = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'trialing',
        limit: 5,
      });

      const allActive = [...subs.data, ...trialing.data];

      // Find a RiffAI Pro subscription
      const proSub = allActive.find(sub =>
        sub.items.data.some(item =>
          item.price.id === process.env.STRIPE_PRO_PRICE_ID
        )
      );

      if (proSub) {
        return res.status(200).json({
          active: true,
          plan: 'pro',
          email,
          customerId: customer.id,
          subscriptionId: proSub.id,
          currentPeriodEnd: proSub.current_period_end,
        });
      }
    }

    return res.status(200).json({ active: false, plan: 'free', email });
  } catch (err) {
    console.error('validate-subscription error:', err);
    return res.status(500).json({ error: err.message });
  }
};
