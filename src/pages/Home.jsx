import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Clock, Target, Award, CheckCircle, MessageCircle, Lock, Shield } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showTrainerDialog, setShowTrainerDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const features = [
    { icon: Clock, text: "30-45 minutes", label: "Durée estimée" },
    { icon: Target, text: "71 questions", label: "Questions adaptatives" },
    { icon: Award, text: "Niveau CECRL", label: "De A1 à C2" },
  ];

  const handleTrainerAccess = async () => {
    setIsChecking(true);
    setPasswordError(false);
    
    try {
      const result = await base44.functions.invoke('verifyTrainerPassword', {
        username: username,
        password: password
      });

      if (result.data.success) {
        localStorage.setItem('trainer_name', result.data.trainer.full_name);
        navigate(createPageUrl('TrainerAccess'));
      } else {
        setPasswordError(true);
        setTimeout(() => setPasswordError(false), 2000);
      }
    } catch (error) {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi Formation" 
            className="h-20 object-contain"
          />
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-[#32cf8a]" />
            Test gratuit et sans engagement
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#17c3b2]/10 text-[#00504e] text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[#32cf8a] animate-pulse" />
                Évaluez votre niveau de français
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Test de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00504e] to-[#17c3b2]">
                  Positionnement
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Découvrez votre niveau de français selon le Cadre Européen Commun de Référence pour les Langues (CECRL). 
                Un test adaptatif pour une évaluation précise.
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-6 mb-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#32cf8a]/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-[#00504e]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{feature.text}</p>
                      <p className="text-sm text-gray-500">{feature.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Commencer le test
                </h2>
                <p className="text-gray-600 mb-8">
                  Renseignez vos informations pour recevoir vos résultats
                </p>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Votre nom</Label>
                    <Input
                      id="name"
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Votre email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean.dupont@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      className={`h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20 ${emailError ? 'border-red-500' : ''}`}
                    />
                    {emailError && (
                      <p className="text-sm text-red-600">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Votre téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#17c3b2] focus:ring-[#17c3b2]"
                      />
                      <span className="text-sm text-gray-700">
                        J'accepte que mes données personnelles soient collectées et traitées pour recevoir mes résultats et être contacté(e) concernant les formations.{' '}
                        <Link to={createPageUrl('Privacy')} className="text-[#17c3b2] hover:underline">
                          Voir la politique de confidentialité
                        </Link>
                      </span>
                    </label>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <p className="text-sm text-amber-900">
                      ⚠️ <strong>Important :</strong> Le test est à titre indicatif. Les résultats ne constituent pas une certification officielle mais une évaluation pédagogique de votre niveau.
                    </p>
                  </div>

                  <Button 
                    type="button"
                    onClick={() => {
                      if (!name || !email || !phone || !gdprConsent) return;

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(email)) {
                        setEmailError('Veuillez entrer un email valide (ex: nom@email.com)');
                        return;
                      }

                      setEmailError('');
                      localStorage.setItem('test_candidate_name', name);
                      localStorage.setItem('test_candidate_email', email);
                      localStorage.setItem('test_candidate_phone', phone);
                      localStorage.setItem('test_gdpr_consent', 'true');
                      navigate(createPageUrl('Test') + `?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
                    }}
                    className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 transition-all shadow-lg shadow-[#17c3b2]/25"
                    disabled={!name || !email || !phone || !gdprConsent}
                  >
                    Démarrer le test gratuit
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>Vos données sont protégées (RGPD)</span>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3 text-center">Besoins d'informations ?</p>
                    <a 
                      href="https://wa.me/33652675393?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20formations%20FLE" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 rounded-xl border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contactez-nous sur WhatsApp
                      </Button>
                    </a>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ParlerEmploi Formation. Tous droits réservés.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
              <Link to={createPageUrl('LegalNotice')} className="hover:text-[#17c3b2] transition-colors">
                Mentions légales
              </Link>
              <span>•</span>
              <Link to={createPageUrl('Privacy')} className="hover:text-[#17c3b2] transition-colors">
                Politique de confidentialité
              </Link>
              <span>•</span>
              <Link to={createPageUrl('Terms')} className="hover:text-[#17c3b2] transition-colors">
                CGU
              </Link>
              <span>•</span>
              <Link to={createPageUrl('FAQ')} className="hover:text-[#17c3b2] transition-colors">
                FAQ
              </Link>
              <span>•</span>
              <Link to={createPageUrl('Contact')} className="hover:text-[#17c3b2] transition-colors">
                Contact
              </Link>
              <span>•</span>
              <Link to={createPageUrl('MyAccount')} className="hover:text-[#17c3b2] transition-colors">
                Mes données
              </Link>
            </div>
          </div>
          <button
            onClick={() => setShowTrainerDialog(true)}
            className="text-xs text-gray-400 hover:text-[#17c3b2] transition-colors flex items-center gap-1 mx-auto"
          >
            <Lock className="w-3 h-3" />
            Accès formateur
          </button>
        </div>
      </footer>

      {/* Trainer Password Dialog */}
      <Dialog open={showTrainerDialog} onOpenChange={setShowTrainerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#00504e]">
              <Lock className="w-5 h-5" />
              Accès Formateur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trainerUsername">Nom d'utilisateur</Label>
              <Input
                id="trainerUsername"
                type="text"
                placeholder="marie.leclerc"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`h-12 rounded-xl ${passwordError ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerPassword">Mot de passe</Label>
              <Input
                id="trainerPassword"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrainerAccess()}
                className={`h-12 rounded-xl ${passwordError ? 'border-red-500' : ''}`}
              />
              {passwordError && (
                <p className="text-sm text-red-600">Identifiants incorrects</p>
              )}
            </div>
            <Button
              onClick={handleTrainerAccess}
              disabled={isChecking || !username || !password}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00504e] to-[#17c3b2]"
            >
              {isChecking ? 'Vérification...' : 'Accéder'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}