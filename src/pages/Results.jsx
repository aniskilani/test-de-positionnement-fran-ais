import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { RotateCcw, Download, Share2, Mail } from 'lucide-react';
import LevelResult from '@/components/test/LevelResult';

export default function Results() {
  const urlParams = new URLSearchParams(window.location.search);
  const score = parseInt(urlParams.get('score')) || 0;
  const level = urlParams.get('level') || 'A1';
  const name = urlParams.get('name') || 'Candidat';

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Mon résultat - Test de français',
        text: `J'ai obtenu le niveau ${level} avec ${score}% au test de français ParlerEmploi Formation !`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi Formation" 
            className="h-12 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 mb-1">Félicitations {name} !</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Vos résultats
            </h1>
          </motion.div>

          {/* Result Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 mb-8">
            <LevelResult level={level} score={score} />
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleShare}
                className="h-12 rounded-xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              <a href="mailto:contact@parleremploi.fr?subject=Demande de formation français">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </a>
            </div>

            <Link to={createPageUrl('Home')} className="block">
              <Button 
                className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Refaire le test
              </Button>
            </Link>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 bg-gradient-to-r from-[#00504e] to-[#17c3b2] rounded-3xl p-8 text-center text-white"
          >
            <h3 className="text-xl font-bold mb-3">
              Envie de progresser ?
            </h3>
            <p className="opacity-90 mb-6">
              ParlerEmploi Formation vous accompagne avec des cours de français adaptés à votre niveau et vos objectifs professionnels.
            </p>
            <a href="https://parleremploi.fr" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-[#00504e] hover:bg-gray-100 font-semibold px-8 h-12 rounded-xl">
                Découvrir nos formations
              </Button>
            </a>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ParlerEmploi Formation. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}