import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CreditCard, Shield, CheckCircle, X } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const candidateName = urlParams.get('name') || '';
  const candidateEmail = urlParams.get('email') || '';
  const candidatePhone = urlParams.get('phone') || '';

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simuler un traitement de paiement
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Rediriger vers le test avec les paramètres
    navigate(createPageUrl('Test') + `?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}&phone=${encodeURIComponent(candidatePhone)}`);
  };

  const isFormValid = cardNumber.length >= 16 && expiryDate.length >= 5 && cvv.length >= 3;

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
                  <span className="text-5xl font-bold">29€</span>
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
                    <CreditCard className="w-6 h-6 text-[#00504e]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé</h2>
                    <p className="text-sm text-gray-600">Informations cryptées</p>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-gray-700">Numéro de carte</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-gray-700">Date d'expiration</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setExpiryDate(value);
                        }}
                        className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                        maxLength={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-gray-700">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Candidat :</p>
                    <p className="font-semibold text-gray-900">{candidateName}</p>
                    <p className="text-sm text-gray-600">{candidateEmail}</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isFormValid || isProcessing}
                    className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 transition-all shadow-lg shadow-[#17c3b2]/25"
                  >
                    {isProcessing ? (
                      'Traitement en cours...'
                    ) : (
                      <>
                        Payer 29€ et accéder au test
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    Paiement sécurisé par SSL. Vos données sont protégées.
                  </p>
                </form>
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