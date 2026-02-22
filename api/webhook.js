// api/webhook.js
// Handles Stripe webhook events.
// On subscription created: generates a license key and stores it in Customer metadata.
//
// Stripe Dashboard → Webhooks → point to:
//   https://your-vercel-url.vercel.app/api/webhook
// Events to subscribe to:
//   customer.subscription.created
//   customer.subscription.deleted
//   customer.subscription.updated
//   invoice.payment_failed

const Stripe = require('stripe');

// Vercel must NOT parse the body — Stripe needs the raw bytes to verify signature
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || '').trim());
  const sig    = req.headers['stripe-signature'];

  // Collect raw body
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const buf = Buffer.concat(chunks);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'customer.subscription.created') {
    const sub        = event.data.object;
    const customerId = sub.customer;

    try {
      // Check if this customer already has a license key
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) return res.status(200).json({ received: true });

      if (!customer.metadata?.riffai_license) {
        // Generate and store license key
        const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const seg    = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const license = `RIFF-${seg()}-${seg()}-${seg()}-${seg()}`;

        await stripe.customers.update(customerId, {
          metadata: { riffai_license: license },
        });

        console.log(`License generated for ${customer.email}: ${license}`);
      }
    } catch (err) {
      console.error('License generation error:', err.message);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    // Subscription cancelled — license is automatically revoked because
    // validate-license checks for an ACTIVE subscription. No extra action needed.
    const sub = event.data.object;
    console.log('Subscription cancelled for customer:', sub.customer);
  }

  if (event.type === 'invoice.payment_failed') {
    const inv = event.data.object;
    console.log('Payment failed for:', inv.customer_email);
    // Stripe will automatically move the subscription to past_due / canceled
    // after the retry period ends. validate-license will reject it then.
  }

  return res.status(200).json({ received: true });
};
