import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(stripeKey);

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return Response.json({ error: 'No signature' }, { status: 400 });
  }

  const body = await req.text();
  
  let event;
  
  try {
    // Vérifier la signature du webhook
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const candidateEmail = session.customer_email || session.metadata?.candidate_email;
    const candidateName = session.metadata?.candidate_name || session.customer_details?.name;
    const candidatePhone = session.metadata?.candidate_phone;

    if (candidateEmail) {
      try {
        // Trouver la session gratuite correspondante
        const freeSessions = await base44.asServiceRole.entities.FreeTestSession.filter({
          candidate_email: candidateEmail,
          has_paid: false
        });

        if (freeSessions.length > 0) {
          // Mettre à jour la session pour indiquer que le paiement a été effectué
          await base44.asServiceRole.entities.FreeTestSession.update(
            freeSessions[0].id,
            { has_paid: true }
          );
          
          console.log(`Payment confirmed for ${candidateEmail}`);
        }
      } catch (error) {
        console.error('Error updating free session:', error);
      }
    }
  }

  return Response.json({ received: true });
});