import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, UserCheck, Shield } from 'lucide-react';

export default function TrainerAccess() {
  const [trainerName, setTrainerName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');

  const handleStart = () => {
    if (trainerName && candidateName && candidateEmail && candidatePhone) {
      localStorage.setItem('trainer_name', trainerName);
      localStorage.setItem('test_candidate_name', candidateName);
      localStorage.setItem('test_candidate_email', candidateEmail);
      localStorage.setItem('test_candidate_phone', candidatePhone);
      
      window.location.href = createPageUrl('Test') + 
        `?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}&phone=${encodeURIComponent(candidatePhone)}&trainer=true&trainerName=${encodeURIComponent(trainerName)}`;
    }
  };

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
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#17c3b2]/10 text-[#00504e] text-sm font-medium">
            <Shield className="w-4 h-4" />
            Accès Formateur
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00504e] text-white text-sm font-medium mb-6"
            >
              <UserCheck className="w-5 h-5" />
              Espace Formateurs
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Test de Positionnement Complet
            </h1>
            <p className="text-lg text-gray-600">
              Accès gratuit au test complet pour les formateurs ParlerEmploi
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100"
          >
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleStart(); }}>
              {/* Formateur Info */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#17c3b2]" />
                  Informations Formateur
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="trainerName" className="text-gray-700">Votre nom (formateur)</Label>
                  <Input
                    id="trainerName"
                    placeholder="Marie Dupont"
                    value={trainerName}
                    onChange={(e) => setTrainerName(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                    required
                  />
                </div>
              </div>

              {/* Candidate Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations Candidat
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName" className="text-gray-700">Nom du candidat</Label>
                    <Input
                      id="candidateName"
                      placeholder="Jean Martin"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateEmail" className="text-gray-700">Email du candidat</Label>
                    <Input
                      id="candidateEmail"
                      type="email"
                      placeholder="jean.martin@email.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidatePhone" className="text-gray-700">Téléphone du candidat</Label>
                    <Input
                      id="candidatePhone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-[#17c3b2] focus:ring-[#17c3b2]/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 transition-all shadow-lg shadow-[#17c3b2]/25"
                disabled={!trainerName || !candidateName || !candidateEmail || !candidatePhone}
              >
                Démarrer le test complet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="bg-[#17c3b2]/10 rounded-xl p-4 text-sm text-[#00504e]">
                <p className="font-medium mb-1">✓ Accès gratuit au test complet</p>
                <p className="text-gray-600">Les résultats seront enregistrés sous votre nom de formateur</p>
              </div>
            </form>
          </motion.div>
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