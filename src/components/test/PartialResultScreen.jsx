import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Lock, ArrowRight, Star } from 'lucide-react';

export default function PartialResultScreen({ score, totalQuestions, candidateName, candidateEmail, candidatePhone }) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let estimatedLevel = "A1-A2";
  if (percentage >= 80) estimatedLevel = "B1-B2";
  else if (percentage >= 60) estimatedLevel = "A2-B1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#17c3b2] to-[#32cf8a] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Excellent début, {candidateName} !
        </h2>
        
        <p className="text-center text-gray-600 mb-8">
          Vous avez terminé les 5 premières questions gratuites
        </p>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Score provisoire</p>
              <p className="text-4xl font-bold text-[#00504e]">
                {percentage}%
              </p>
              <p className="text-sm text-gray-500">
                {score} bonnes réponses sur {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Niveau estimé</p>
              <span className="inline-block px-4 py-2 rounded-full bg-[#17c3b2]/10 text-[#00504e] font-bold text-lg">
                {estimatedLevel}
              </span>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-start gap-3 mb-4">
            <Lock className="w-6 h-6 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Débloquez votre évaluation complète</h3>
              <p className="opacity-90 text-sm">
                15 questions supplémentaires pour une certification précise et des recommandations personnalisées
              </p>
            </div>
          </div>
          
          <div className="space-y-2 ml-9">
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4" />
              <span>Certification CECRL officielle (A1 à B2)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4" />
              <span>Analyse détaillée par compétence</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4" />
              <span>Recommandations de formation adaptées</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link 
          to={createPageUrl('Payment') + `?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}&phone=${encodeURIComponent(candidatePhone)}`}
        >
          <Button className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow-lg">
            Continuer pour 19€
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>

        <p className="text-center text-sm text-gray-500 mt-4">
          Paiement sécurisé • Résultats immédiats
        </p>
      </motion.div>
    </motion.div>
  );
}