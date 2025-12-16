import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Volume2, PlayCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QuestionCard({ question, selectedAnswer, onSelect, questionNumber }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playAudio = () => {
    // Si la question a un texte audio, utiliser la synthèse vocale
    if (question.audioText) {
      setIsPlaying(true);
      
      // Extraire le texte à lire (enlever "Audio : " et les guillemets)
      const textToSpeak = question.audioText.replace(/^Audio\s*:\s*['"]?|['"]?$/g, '');
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // Vitesse légèrement réduite pour meilleure compréhension
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.cancel(); // Annuler toute lecture en cours
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionNumber}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        {/* Question Level Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#17c3b2]/10 text-[#00504e]">
            Niveau {question.level}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {question.category}
          </span>
        </div>

        {/* Audio Player for Oral Comprehension */}
        {question.audioText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-gradient-to-r from-[#17c3b2]/10 to-[#32cf8a]/10 border-[#17c3b2]/30">
              <Volume2 className="h-5 w-5 text-[#00504e]" />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-[#00504e] mb-1">Question audio</p>
                    <p className="text-sm text-gray-600">
                      Cliquez sur le bouton pour écouter l'extrait audio
                    </p>
                  </div>
                  <Button
                    onClick={playAudio}
                    disabled={isPlaying}
                    className="bg-[#00504e] hover:bg-[#17c3b2] flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <PlayCircle className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {isPlaying ? 'En lecture...' : 'Écouter'}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <motion.button
                key={index}
                onClick={() => onSelect(option)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 text-left group ${
                  isSelected
                    ? 'border-[#17c3b2] bg-[#17c3b2]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#32cf8a] hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
                    isSelected
                      ? 'bg-[#17c3b2] text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-[#32cf8a]/20 group-hover:text-[#00504e]'
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-5 h-5" /> : letters[index]}
                </span>
                <span className={`flex-1 font-medium ${isSelected ? 'text-[#00504e]' : 'text-gray-700'}`}>
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}