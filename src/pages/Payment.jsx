import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle, X, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Payment() {
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const candidateName = urlParams.get('name') || '';
  const candidateEmail = urlParams.get('email') || '';
  const candidatePhone = urlParams.get('phone') || '';

  const handlePayment = () => {
    if (!candidateName || !candidateEmail) {
      setError('Informations manquantes. Veuillez retourner à la page d\'accueil.');
      return;
    }

    setLoading(true);
    
    // Redirection directe vers le lien de paiement Stripe
    const stripeUrl = `https://buy.stripe.com/5kQ14m5V0br49i8gLw87K00?prefilled_email=${encodeURIComponent(candidateEmail)}&client_reference_id=${encodeURIComponent(candidateName)}`;
    window.location.href = stripeUrl;
  };

  useEffect(() => {
    if (urlParams.get('cancelled') === 'true') {
      setCancelled(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi Formation" 
            className="h-20 object-contain"
          />
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Pricing Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Accédez à votre test de positionnement
              </h1>
              <p className="text-gray-600 mb-8">
                Un investissement pour mieux connaître votre niveau et choisir la formation adaptée.
              </p>

              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-[#00504e] to-[#17c3b2] rounded-3xl p-8 text-white mb-8">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">19€</span>
                  <span className="text-lg opacity-90">TTC</span>
                </div>
                <p className="opacity-90 mb-6">Test de positionnement complet</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Évaluation complète de votre niveau</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Résultats détaillés par compétence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Certification CECRL (A1 à B2)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Recommandations personnalisées</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-[#32cf8a]" />
                <span>Paiement 100% sécurisé</span>
              </div>
            </motion.div>

            {/* Right - Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#17c3b2]/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#00504e]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé Stripe</h2>
                    <p className="text-sm text-gray-600">Protection des acheteurs</p>
                  </div>
                </div>

                {cancelled && (
                  <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  {/* Candidate Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Candidat :</p>
                    <p className="font-semibold text-gray-900">{candidateName}</p>
                    <p className="text-sm text-gray-600">{candidateEmail}</p>
                    <p className="text-sm text-gray-600">{candidatePhone}</p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 transition-all shadow-lg shadow-[#17c3b2]/25"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Redirection en cours...
                      </>
                    ) : (
                      <>
                        Payer 19€ et accéder au test
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <div className="space-y-2">
                    <p className="text-center text-xs text-gray-500">
                      Paiement sécurisé par Stripe • Remboursement garanti
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ParlerEmploi Formation. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}