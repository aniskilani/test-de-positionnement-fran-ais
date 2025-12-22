import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { name, email, phone } = await req.json();

    const origin = new URL(req.url).origin;
    const appPath = origin.includes('base44.app') ? origin : origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Test de Positionnement FLE',
              description: 'Évaluation complète de votre niveau de français',
            },
            unit_amount: 1900,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        candidate_name: name,
        candidate_email: email,
        candidate_phone: phone,
      },
      success_url: `${appPath}/Test?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
      cancel_url: `${appPath}/Payment?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&cancelled=true`,
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});