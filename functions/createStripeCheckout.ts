/**
 * Crée une session de paiement Stripe pour le test de positionnement
 */
export default async function createStripeCheckout({ name, email, phone }, { base44, secrets }) {
  const Stripe = require('stripe');
  const stripe = new Stripe(secrets.STRIPE_SECRET_KEY);

  try {
    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Test de Positionnement FLE',
              description: 'Évaluation complète de votre niveau de français (CECRL A1-B2)',
            },
            unit_amount: 1900, // 19€ en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      metadata: {
        candidate_name: name,
        candidate_email: email,
        candidate_phone: phone,
      },
      success_url: `${base44.getAppUrl()}/Test?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base44.getAppUrl()}/Payment?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&cancelled=true`,
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    };
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return {
      success: false,
      error: error.message
    };
  }
}