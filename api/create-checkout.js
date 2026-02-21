// api/create-checkout.js
// Creates a Stripe Checkout session for the RiffAI Pro plan.
// Called from the Electron app when user clicks "Upgrade to Pro".

const Stripe = require('stripe');

module.exports = async (req, res) => {
  // CORS — allow requests from the Electron app (file://) and your website
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { email } = req.body || {};

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID, // set this in Vercel env vars
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { app: 'riffai' },
      },
      success_url: 'https://riffai.vercel.app/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url:  'https://riffai.vercel.app/',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
};
