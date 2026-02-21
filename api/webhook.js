// api/webhook.js
// Handles Stripe webhook events.
// Currently logs events — extend this to send welcome emails, etc.
//
// In Stripe Dashboard → Webhooks, point to:
//   https://your-vercel-url.vercel.app/api/webhook
// Events to listen for:
//   customer.subscription.created
//   customer.subscription.deleted
//   customer.subscription.updated
//   invoice.payment_failed

const Stripe = require('stripe');

// Vercel disables body parsing for raw webhook verification
export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig    = req.headers['stripe-signature'];
  const buf    = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('New Pro subscriber:', event.data.object.customer);
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled:', event.data.object.customer);
      break;
    case 'invoice.payment_failed':
      console.log('Payment failed for:', event.data.object.customer_email);
      break;
    default:
      // Ignore other events
  }

  res.status(200).json({ received: true });
};
