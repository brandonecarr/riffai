// api/get-license.js
// Retrieves (or generates on first call) the license key for a completed Stripe checkout.
// Called by success.html after payment: GET /api/get-license?session_id=cs_xxx
//
// License keys are stored in Stripe Customer metadata (riffai_license).
// No external database required — Stripe is the source of truth.

const Stripe = require('stripe');

function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1 — too ambiguous
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `RIFF-${seg()}-${seg()}-${seg()}-${seg()}`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = req.query.session_id;
  if (!sessionId) return res.status(400).json({ error: 'session_id required' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Retrieve the checkout session with customer expanded
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    const customer = session.customer;
    if (!customer || typeof customer === 'string') {
      return res.status(404).json({ error: 'Customer not found in session' });
    }

    // If a license key already exists on this customer, return it
    if (customer.metadata?.riffai_license) {
      return res.status(200).json({
        licenseKey: customer.metadata.riffai_license,
        email: customer.email,
      });
    }

    // First call — generate a new license key and store it on the customer
    const licenseKey = generateLicenseKey();
    await stripe.customers.update(customer.id, {
      metadata: { riffai_license: licenseKey },
    });

    return res.status(200).json({
      licenseKey,
      email: customer.email,
    });
  } catch (err) {
    console.error('get-license error:', err);
    return res.status(500).json({ error: err.message });
  }
};
